import os
import argparse
import sys
import re
import datetime

PATTERN_PLAYERS = r'^Partecipano: '
PATTERN_GUEST = r'^Ospite: '
PATTERN_PLAYER = r'([^\()]+?)\s*\(([^\)]+)\)'
PATTERN_TITLE = r'^title: '
PATTERN_DATE = r'^date: '

parser = argparse.ArgumentParser()

parser.add_argument("path", help="Path to folder containing session recaps")

def get_data(filepath):
    data = {}
    players = []
    data["players"] = players
    with open(filepath, 'r') as f:
        lines = f.readlines()
        for line in lines:
            players_match = re.search(PATTERN_PLAYERS, line)
            guest_match = re.search(PATTERN_GUEST, line)
            title_match = re.search(PATTERN_TITLE, line)
            date_match = re.search(PATTERN_DATE, line)
            if players_match or guest_match:
                end = players_match.end() if players_match else guest_match.end()
                split = re.split(r'\s*,\s*', line[end:])
                for pair in split:
                    splitmatch = re.search(PATTERN_PLAYER, pair)
                    if splitmatch:
                        players.append({
                            "name": splitmatch.group(1).strip(),
                            "player": splitmatch.group(2).strip(),
                            "guest": guest_match is not None,
                        })
                    else:
                        print(f"[WARN] File {filepath}: Player formatted wrong: {pair}")
            if title_match:
                split = re.split(r'\s*-\s*', line[title_match.end():], maxsplit=1)
                title = split[1].strip()
                number = int(re.sub(r'Sessione', '', split[0]).strip())
                data["title"] = title
                data["number"] = number
            if date_match:
                datestr = line[date_match.end():].strip()
                data["date"] = datetime.datetime.strptime(datestr, "%d/%m/%Y")
                        
    return data

def get_folder_data(dir) -> "list[dict]": 
    session_data = []
    for file in os.listdir(dir):
        data = get_data(os.path.join(dir, file))
        session_data.append(data)
    return session_data

def main(args):
    all_data = get_folder_data(os.path.abspath(args.path))

if __name__ == "__main__":
    args = parser.parse_args()
    main(args)