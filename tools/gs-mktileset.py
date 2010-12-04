#!/usr/bin/env python3.2

import os, sys
import argparse
import json


parser = argparse.ArgumentParser(description="Generate tileset.json manifest for a tileset.")
parser.add_argument('tileset', metavar='TILESET', type=str, action="store",
                    help='the tileset to generate a manifest for')

def main():
    args = parser.parse_args()

    tileset_dir = os.path.join("assets", "tileset", args.tileset)

    manifest = {}
    for filename in os.listdir(tileset_dir):
        if filename.endswith('.png'):
            tile_id, direction, frame, _ = filename.split('.')
            manifest.setdefault(tile_id, {})
            manifest[tile_id].setdefault(direction, [])
            manifest[tile_id][direction].append(filename)

    manifest_json = json.dumps(manifest)
    open(os.path.join("assets", "tileset", args.tileset, "tileset.json"), "w").write(manifest_json)

if __name__ == '__main__':
    sys.exit(main())
