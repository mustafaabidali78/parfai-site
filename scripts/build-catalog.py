#!/usr/bin/env python3
"""Turns a Rakuten product feed (FragranceNet, merchant 216) into catalog/fragrancenet.json.

Usage:  python3 scripts/build-catalog.py path/to/216_4752867_mp.xml catalog/fragrancenet.json

- Keeps perfumes only (category "Fragrances") that are in stock.
- Merges sizes and concentrations of the same perfume into one entry.
- Does NOT store prices on purpose (prices go stale quickly).
- Stores affiliate links in a short form: the shared start of every link is saved once.
"""
import json, re, sys, collections
import xml.etree.ElementTree as ET

GENDERS = {'MEN': 0, 'WOMEN': 1, 'UNISEX': 2}
LINK = re.compile(r'^(https://click\.linksynergy\.com/link\?id=[^&]+&offerid=\d+\.)(\d+)(&type=15&murl=)(.*)$')


def clean_title(title, house):
    t = title.strip()
    t = re.sub(r'\s+by\s+' + re.escape(house) + r'$', '', t, flags=re.I).strip()
    return t or title.strip()


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def main(src, dst):
    groups = collections.OrderedDict()
    prefix = mid = None
    for _, el in ET.iterparse(src, events=('end',)):
        if el.tag != 'product' or el.get('product_id') is None:
            continue  # skip the nested <product> link tag
        try:
            if (el.findtext('category/secondary') or '') != 'Fragrances':
                continue
            if (el.findtext('shipping/availability') or '') != 'in-stock':
                continue
            name = el.get('name') or ''
            if ' by ' not in name:
                continue
            title, rest = name.split(' by ', 1)
            gm = re.search(r'\bfor (MEN|WOMEN|UNISEX)\s*$', rest)
            if not gm:
                continue
            gender = GENDERS[gm.group(1)]
            rest = rest[:gm.start()].strip()
            label = re.sub(r'\s+', ' ', rest).strip()
            house = (el.get('manufacturer_name') or '').strip()
            long = el.findtext('description/long') or ''
            ym = re.search(r'in (\d{4})', long)
            year = int(ym.group(1)) if ym else 0
            nm = re.search(r'pos+esse?s a blend of:\s*(.*?)(?:\s+It is recommended|$)', long, re.S)
            notes = [n.strip().lower() for n in nm.group(1).strip().rstrip('.').split(',') if n.strip()] if nm else []
            rec = re.search(r'It is recommended for ([a-z ,&]+?) wear', long)
            wear = rec.group(1).strip() if rec else ''
            link = el.findtext('URL/product') or ''
            lm = LINK.match(link)
            if not lm:
                continue
            prefix, mid = lm.group(1), lm.group(3)
            title = clean_title(title, house)
            key = (house.lower(), title.lower(), gender)
            g = groups.setdefault(key, dict(house=house, title=title, gender=gender, year=0, notes=[], wear='', variants=[]))
            g['year'] = g['year'] or year
            if len(notes) > len(g['notes']):
                g['notes'] = notes
            g['wear'] = g['wear'] or wear
            g['variants'].append([lm.group(2), label, lm.group(4)])
        finally:
            el.clear()

    items, used = [], set()
    for g in sorted(groups.values(), key=lambda g: (g['house'].lower(), g['title'].lower(), g['gender'])):
        base = slugify(f"{g['house']} {g['title']} {['men','women','unisex'][g['gender']]}")
        slug, n = base, 2
        while slug in used:
            slug = f'{base}-{n}'; n += 1
        used.add(slug)
        g['variants'].sort(key=lambda v: v[1])
        items.append([slug, g['house'], g['title'], g['gender'], g['year'], g['notes'], g['wear'], g['variants']])

    out = {'v': 1, 'store': 'FragranceNet', 'pre': prefix, 'mid': mid, 'items': items}
    with open(dst, 'w') as f:
        json.dump(out, f, separators=(',', ':'), ensure_ascii=False)
    print(f'{len(items)} perfumes written to {dst}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
