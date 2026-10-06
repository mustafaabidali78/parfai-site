#!/usr/bin/env python3
"""Safety check before the catalogue file is replaced.

Usage:  python3 scripts/check-catalog.py current.json new.json

Stops (exit code 1) if the new catalogue looks broken: far fewer perfumes than
before, or missing the pieces the website needs. Prints a short summary.
"""
import json, sys


def load(path):
    with open(path) as f:
        return json.load(f)


def main(current_path, new_path):
    new = load(new_path)
    items = new.get('items', [])
    try:
        old_items = load(current_path).get('items', [])
    except (OSError, ValueError):
        old_items = []
    problems = []
    if len(items) < 5000:
        problems.append(f'only {len(items)} perfumes (expected thousands)')
    if old_items and len(items) < 0.8 * len(old_items):
        problems.append(f'dropped from {len(old_items)} to {len(items)} perfumes')
    if not new.get('pre') or not new.get('mid'):
        problems.append('affiliate link pattern is missing')
    if any(not it[7] for it in items):
        problems.append('some perfumes have no buy links')
    old_ids = {it[0] for it in old_items}
    new_ids = {it[0] for it in items}
    print(f'Perfumes now: {len(items)} (before: {len(old_items)})')
    print(f'Added: {len(new_ids - old_ids)}   Removed: {len(old_ids - new_ids)}')
    if problems:
        print('NOT replacing the catalogue:', '; '.join(problems))
        sys.exit(1)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
