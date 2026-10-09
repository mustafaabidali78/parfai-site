#!/usr/bin/env python3
"""Saves one small bottle picture for each perfume in the catalogue.

Usage:  python3 scripts/fetch-photos.py feed.xml catalog/fragrancenet.json catalog-img

- The pictures come from FragranceNet's own Rakuten product feed (the picture
  address of each product). Rakuten confirmed publishers may show them.
- The pictures are saved exactly as received (no editing) as catalog-img/<id>.jpg,
  where <id> is the first size's product id, which is what the website looks for.
- Pictures already saved are skipped, so running it again only fetches new ones.
- Only fragrancenet.com picture addresses are fetched. If the shop refuses the
  first requests (for example it blocks this computer), the script stops at once
  and says so. It never tries to get around a block.
"""
import json, os, re, sys, threading, time, urllib.error, urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor

LINK = re.compile(r'^https://click\.linksynergy\.com/link\?id=[^&]+&offerid=\d+\.(\d+)&type=15&murl=')
UA = 'ParfAI-photo-sync/1.0 (+https://parfai.org; affiliate publisher using the Rakuten product feed)'
HOST_OK = re.compile(r'^https://([a-z0-9-]+\.)*fragrancenet\.com/', re.I)
WORKERS = 4
START = time.time()


def log(msg):
    print(f'[{time.time() - START:6.0f}s] {msg}', flush=True)


def image_of(el):
    """The picture address of one <product> in the feed."""
    url = el.find('URL')
    if url is None:
        return ''
    for tag in ('productImage', 'image', 'imageURL'):
        v = (url.findtext(tag) or '').strip()
        if v:
            return v
    for child in url:
        if 'image' in child.tag.lower() and (child.text or '').strip():
            return child.text.strip()
    return ''


def read_feed(feed_path, wanted):
    """Maps product id -> picture address, for the ids in `wanted` only."""
    found = {}
    for _, el in ET.iterparse(feed_path, events=('end',)):
        if el.tag != 'product' or el.get('product_id') is None:
            continue
        try:
            m = LINK.match(el.findtext('URL/product') or '')
            if m and m.group(1) in wanted:
                img = image_of(el)
                if img:
                    found[m.group(1)] = img
        finally:
            el.clear()
    return found


def looks_like_picture(data):
    return len(data) >= 800 and (data[:2] == b'\xff\xd8' or data[:8] == b'\x89PNG\r\n\x1a\n' or data[:4] == b'RIFF')


def fetch(url):
    """Returns (bytes or None, reason)."""
    last = 'unknown'
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'image/*'})
            with urllib.request.urlopen(req, timeout=25) as r:
                data = r.read()
            if looks_like_picture(data):
                return data, 'ok'
            return None, 'not a picture'
        except urllib.error.HTTPError as e:
            last = f'HTTP {e.code}'
            if e.code in (403, 404, 410, 451):
                return None, last
        except Exception as e:  # timeouts, resets
            last = type(e).__name__
        time.sleep(1.5 * (attempt + 1))
    return None, last


def main(feed_path, catalogue_path, out_dir):
    items = json.load(open(catalogue_path))['items']
    os.makedirs(out_dir, exist_ok=True)
    have = {f[:-4] for f in os.listdir(out_dir) if f.endswith('.jpg')}
    groups = []  # (file id, [all size ids of this perfume])
    wanted = set()
    for it in items:
        ids = [v[0] for v in it[7]]
        if ids:
            groups.append((ids[0], ids))
            wanted.update(ids)
    log(f'{len(groups)} perfumes in the catalogue, {len(have)} pictures already saved')
    pics = read_feed(feed_path, wanted)
    log(f'{len(pics)} picture addresses found in the feed')
    sample = next(iter(pics.items()), None)
    if sample:
        log(f'example: product {sample[0]} -> {sample[1]}')

    todo = []
    for fid, ids in groups:
        if fid in have:
            continue
        url = next((pics[i] for i in ids if i in pics), '')
        if url and HOST_OK.match(url):
            todo.append((fid, url))
    log(f'{len(todo)} pictures to fetch')
    if not todo:
        return 0

    lock = threading.Lock()
    stat = {'ok': 0, 'bad': 0, 'done': 0, 'stop': False}
    reasons = {}

    def work(job):
        fid, url = job
        if stat['stop']:
            return
        data, why = fetch(url)
        with lock:
            stat['done'] += 1
            if data:
                stat['ok'] += 1
            else:
                stat['bad'] += 1
                reasons[why] = reasons.get(why, 0) + 1
            if stat['done'] == 12 and stat['ok'] == 0:
                stat['stop'] = True
                log(f'The first 12 requests all failed ({reasons}). Stopping so nothing is forced.')
            if stat['done'] % 500 == 0:
                log(f"{stat['done']} tried, {stat['ok']} saved, {stat['bad']} failed")
        if data:
            tmp = os.path.join(out_dir, fid + '.tmp')
            with open(tmp, 'wb') as f:
                f.write(data)
            os.replace(tmp, os.path.join(out_dir, fid + '.jpg'))
        time.sleep(0.1)

    with ThreadPoolExecutor(WORKERS) as ex:
        list(ex.map(work, todo))
    log(f"Finished: {stat['ok']} saved, {stat['bad']} failed {reasons if reasons else ''}")
    return 1 if (stat['stop'] or (stat['ok'] == 0 and stat['done'] >= 12)) else 0


if __name__ == '__main__':
    sys.exit(main(*sys.argv[1:4]))
