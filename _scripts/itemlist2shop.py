import ijson
import os
import sys
from urllib.parse import unquote,quote

ROW_NUM = 12

VANILLA_SOURCES = [
    "DMG",
    "XGE",
    "TCE",
    "EGW",
]

scriptdir = os.path.dirname(os.path.abspath(__file__))
rootdir = os.path.abspath(os.path.join(scriptdir, ".."))

itemfiles = [os.path.join(rootdir, "_data/homebrew/items.json")] + list(
        os.path.join(rootdir, "_data/homebrew/itemsextra", file)
        for file in os.listdir(os.path.join(rootdir, "_data/homebrew/itemsextra"))
    )

def printrow(list: list, sep=",", number=None):
    print(sep.join(map(lambda s: s.replace(",",""),list)), end="")
    if number:
        for i in range(number - len(list)):
            print(",", end="")
    print()

def getitemrecord(name: str, source: str):
    for file in itemfiles:
        with open(file, "rb") as f:
            try:
                return next(filter(lambda x: x["name"].lower().startswith(name) or name.startswith(x["name"].lower()), ijson.items(f, "item")))
            except StopIteration:
                pass
    return None

def slugify(a: str, apostrophe="-"):
    a = a.lower().replace(" ", "-")
    a = a.lower().replace("'", apostrophe)
    return a

def main(infile: str):
    path = os.path.abspath(infile)

    printrow([
        "name",
        "link",
        "spell",
        "desc",
        "price",
        "rarity",
        "amount",
        "magicspecific",
        "attunement",
        "new",
        "restocked",
        "special",
    ], number=ROW_NUM)

    sources = {}
    with open(path, "rb") as f:
        sources = {src.lower(): src for src in ijson.items(f, "sources.item")}

    item_names = []
    for file in itemfiles:
        with open(file, "rb") as f:
            for record in ijson.items(f, "item"):
                item_names.append(record["name"])

    with open(path, "rb") as f:
        for record in ijson.items(f, "items.item"):
            header: str = record["h"]
            count: int = record["c"]

            split = header.split("_")
            name = "_".join(split[:-1])
            source = split[-1]
            
            source = sources.get(source, source)
            name = unquote(name)

            item_record = getitemrecord(name, source)
            
            formatted_name = item_record["name"] if item_record else name
            rarity = item_record["rarity"] if item_record else ""
            value = str(item_record["value"] / 100) if (item_record and "value" in item_record) else ""
            value = value.replace(".0", "")

            link = ""
            if source in VANILLA_SOURCES:
                link = f"http://dnd5e.wikidot.com/wondrous-items:{slugify(name, apostrophe='')}"
            elif item_record:
                link = f"/homebrew/items#{slugify(item_record['name'])}"

            printrow([formatted_name, link, "", "", value, rarity, str(count)], number=ROW_NUM)
            

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Input file not specified!", file=sys.stderr)
        sys.exit(-1)
    main(infile = sys.argv[1])