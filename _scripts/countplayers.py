import os
import argparse
import re
import datetime
import pandas as pd
import copy
from matplotlib import pyplot as plt
from matplotlib import colors
import numpy as np
import random

PATTERN_PLAYERS = r'^Partecipano: '
PATTERN_GUEST = r'^Ospite: '
PATTERN_PLAYER = r'([^\()]+?)\s*\(([^\)]+)\)'
PATTERN_TITLE = r'^title: '
PATTERN_DATE = r'^date: '

parser = argparse.ArgumentParser()

parser.add_argument("path", help="Path to folder containing session recaps")
parser.add_argument("-o", "--out", default=None, help="Output plot image")
parser.add_argument("--dpi", type=int, default=None, help="Output image DPI")
parser.add_argument("-s", "--silent", action="store_true", help="Avoid rendering plot to window")
parser.add_argument("--colorseed", type=int, help="Seed for random colors")

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

def get_simplified_data_df(session_data: list[dict]) -> pd.DataFrame:
    simplified_data = copy.deepcopy(session_data)

    for data in simplified_data:
        for player in data["players"]:
            data[player["player"]] = player["name"]
        del data["players"]

    return pd.DataFrame(simplified_data).set_index("number")

def draw_attendance_plot(df: pd.DataFrame, drawseps = True, seed = 845, char_colors: dict = {}, show=True, figsize=(10, 6)):
    att_df = df.drop(["date", "title"], axis=1)

    # Plot colored table
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=figsize)

    sepcol = [*ax.get_facecolor()]
    sepcol[3] = 0.33

    rand = random.Random(seed)
    char_col_offset = rand.randrange(0, 360)
    char_colors = char_colors.copy()

    for i, col in enumerate(att_df):
        last = None
        for j, idx in enumerate(df.index):
            value = df.loc[idx, col]
            is_diff = value != last
            last = value
            if not pd.isna(value):
                # color = string_to_colour(value, saturation=1, value=0.6, shift=545)
                color = None
                if value in char_colors:
                    color = char_colors[value]
                else:
                    color = colors.hsv_to_rgb(np.array([char_col_offset / 360., 0.75, 0.6]))
                    char_col_offset = (char_col_offset + rand.randrange(90, 150)) % 360
                    char_colors[value] = color
                ax.add_patch(plt.Rectangle((i, j), 1, 1, 
                                        color=color, 
                                        alpha=0.9, 
                                        ec=None,
                                        ))
                if drawseps:
                    ax.plot([i, i+1], [j, j], color=sepcol, lw=0.5)
                if is_diff:
                    ax.text(i+0.5, j+0.45, value, ha='center', va='center', color='white')
    ax.set_xticks(np.arange(len(att_df.columns))+0.5)
    ax.set_xticklabels(att_df.columns)
    ax.set_yticks(np.arange(len(df.index))+0.5)
    ax.set_yticklabels(df.index)
    ax.set_title('Gente e PG a sessione')
    ax.margins(0.01)

    ax.set_yticks(ax.get_yticks() + 0.5)
    ax.set_yticklabels('')
    # Customize minor tick labels
    plt.yticks(
        [int(x) - 0.5 for x in df.index], 
        labels=df.index,
        minor=True,
    )
    ax.tick_params(axis='y', which='minor', length=0, pad=8)
    ax.tick_params(axis='x', length=0)

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(False)

    plt.subplots_adjust(top=1.1)

    if show:
        plt.show()

    return ax, fig

def main(args):
    all_data = get_folder_data(os.path.abspath(args.path))
    df = get_simplified_data_df(all_data)
    extraargs = {}
    if args.colorseed:
        extraargs["seed"] = args.colorseed
    ax, fig = draw_attendance_plot(df, show=not args.silent, **extraargs)

    if args.out:
        extraargs_save = {}
        if args.dpi:
            extraargs_save["dpi"] = args.dpi

        out = os.path.abspath(args.out)
        outdir = os.path.dirname(out)

        if not os.path.exists(outdir):
            os.makedirs(outdir)
            print("Created directory", outdir)

        plt.savefig(args.out, transparent=True, bbox_inches='tight', **extraargs_save)

if __name__ == "__main__":
    args = parser.parse_args()
    main(args)