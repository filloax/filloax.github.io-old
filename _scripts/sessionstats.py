import os, sys
import argparse
import re
import datetime
# import pandas as pd
import copy
import random

PATTERN_PLAYERS = r'^Partecipano: '
PATTERN_GUEST = r'^Ospite: '
PATTERN_PLAYER = r'([^\()]+?)\s*\(([^\)]+)\)'

shared_parser = argparse.ArgumentParser(add_help=False)
shared_parser.add_argument("-o", "--out", default=None, help="Output plot image")
shared_parser.add_argument("--debug", action="store_true", help="Print debug info")
parser = argparse.ArgumentParser(parents=[shared_parser])
subparsers = parser.add_subparsers(dest='mode', help='Program mode')
# add in subparsers to have proper order
path_arg = (("path",), {'help': "Path to folder containing session recaps"})

plot_parser = subparsers.add_parser("plot", parents=[shared_parser])
plot_parser.add_argument(*path_arg[0], **path_arg[1])
plot_parser.add_argument("-m", "--pmode", choices=['att', 'a', 'levelup', 'l'], default="att", help="Kind of graph")
plot_parser.add_argument("--dpi", type=int, default=None, help="Output image DPI")
plot_parser.add_argument("-s", "--silent", action="store_true", help="Avoid rendering plot to window")
plot_parser.add_argument("--colorseed", type=int, help="Seed for random colors")
plot_parser.add_argument("--cmap", type=str, help="Color map to use (from matplotlib)")

stats_parser = subparsers.add_parser("stats", parents=[shared_parser])
stats_parser.add_argument(*path_arg[0], **path_arg[1])

debug = False

def get_data(filepath):
    data = {}
    players = []
    data["players"] = players
    with open(filepath, 'r') as f:
        lines = f.readlines()
        reading_yaml = False
        read_yaml = False
        for line in lines:
            if line.strip() == '---':
                if not reading_yaml and not read_yaml:
                    reading_yaml = True
                elif reading_yaml:
                    reading_yaml = False
                    read_yaml = True
                continue
            
            if reading_yaml:
                split = re.split(r'\s*:\s*', line)
                if len(split) > 1:
                    id, value = split[0].strip(), split[1].strip()
                    if id == 'title':
                        split = re.split(r'\s*-\s*', value, maxsplit=1)
                        title = split[1].strip()
                        number = int(re.sub(r'Sessione', '', split[0]).strip())
                        data["title"] = title
                        data["number"] = number
                    elif id == 'date':
                        data["date"] = datetime.datetime.strptime(value, "%d/%m/%Y")
                    elif re.match(r'\d+', value):
                        data[id] = int(value)
                    elif value.isnumeric():
                        data[id] = float(value)
                    else:
                        data[id] = value

            
            players_match = re.search(PATTERN_PLAYERS, line)
            guest_match = re.search(PATTERN_GUEST, line)
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
                        
    return data

def get_folder_data(dir) -> "list[dict]": 
    session_data = []
    for file in os.listdir(dir):
        data = get_data(os.path.join(dir, file))
        session_data.append(data)

    session_data.sort(key=lambda data: data["number"])

    return session_data

# def get_simplified_data_df(session_data: list[dict]) -> pd.DataFrame:
#     simplified_data = copy.deepcopy(session_data)

#     for data in simplified_data:
#         for player in data["players"]:
#             data[player["player"]] = player["name"]
#         del data["players"]

#     return pd.DataFrame(simplified_data).set_index("number")

def get_simplified_data_cols(session_data: list[dict]) -> list[dict]:
    simplified_data = copy.deepcopy(session_data)
    players = []

    for data in simplified_data:
        for player in data["players"]:
            data[player["player"]] = player["name"]
            if player["player"] not in players:
                players.append(player["player"])
        del data["players"]

    return simplified_data, players

def draw_attendance_plot(sim_data: list[dict], columns: list[str], drawseps = True, seed = 845, char_colors: dict = {}, show=True, figsize=(10, 6)):
    global debug
    
    # Plot colored table
    fig, ax = plt.subplots(figsize=figsize)

    sepcol = [*ax.get_facecolor()]
    sepcol[3] = 0.33

    rand = random.Random(seed)
    char_col_offset = rand.randrange(0, 360)
    char_colors = char_colors.copy()

    counts = {name: 0 for name in columns}
    char_counts = {}

    for i, col in enumerate(columns):           
        last = None
        for j, ses_data in enumerate(sim_data):
            if debug:
                print("[DEBUG]", "{:10}".format(col) ,"| Doing session {:2d}".format(ses_data["number"]), ses_data["title"])
            value = ses_data.get(col, None)
            is_diff = value != last
            last = value
            if value:
                counts[col] += 1
                char_counts[value] = char_counts.get(value, 0) + 1
                # color = string_to_colour(value, saturation=1, value=0.6, shift=545)
                color = None
                if value in char_colors:
                    color = char_colors[value]
                else:
                    color = colors.hsv_to_rgb(np.array([char_col_offset / 360., 0.75, 0.6]))
                    char_col_offset = (char_col_offset + rand.randrange(90, 180)) % 360
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
    ax.set_xticks(np.arange(len(columns))+0.5)
    ax.set_xticklabels(columns)
    ax.set_yticks(np.arange(len(sim_data))+0.5)
    ax.set_yticklabels(np.arange(len(sim_data), dtype=int) + 1)
    ax.set_title('Gente e PG a sessione')
    ax.margins(0.01)

    ax.set_yticks(ax.get_yticks() + 0.5)
    ax.set_yticklabels('')
    # Customize minor tick labels
    plt.yticks(
        [x + 0.5 for x in range(len(sim_data))], 
        labels=[x + 1 for x in range(len(sim_data))],
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

    print("Drawn graph, counts:")
    print("Players:", counts)
    print("Characters:", char_counts)

    return ax, fig

def draw_levelup_plot(session_data: list[dict], cmap='plasma', show=True, figsize=(10, 6)):
    global debug
    
    numbers = [x['number'] for x in session_data]
    plot_y = [1 if 'levelup' in x else 0 for x in session_data]
    fig, ax = plt.subplots(figsize=figsize)
    plt.bar(numbers, plot_y)

    ax.set_xlabel("Numero sessione")
    ax.set_title("Level-up")
    ax.set_yticklabels([])
    xticks = [1, max(numbers)]
    for i in np.arange(5, max(numbers), 5.0):
        xticks.append(i)
    for i, data in enumerate(session_data):
        if 'levelup' in data and not i in xticks:
            xticks.append(data['number'])
    xticks.sort()
    plt.xticks(xticks)
    ax.tick_params(axis='y', length=0)

    cmap_obj = plt.get_cmap(cmap)

    for i, p in enumerate(ax.patches):
        ses_num = i
        if p.get_height() > 0:
            val = session_data[ses_num]['levelup']
            val_str = str(val)
            date = session_data[ses_num]['date']
            date_str = date.strftime("%d/%m/%y")
            ax.annotate(val_str, (p.get_x() + p.get_width() + 0.15, p.get_height() * 0.75), ha='left', size=15)
            ax.annotate(date_str, (p.get_x() + p.get_width() + 0.15, p.get_height() * 0.25), rotation=45, ha='left')
            p.set(color=cmap_obj(ses_num / numbers[-1]))
            
    if show:
        plt.show()
    

def plot(args, simple_data: list[dict], cols: list):
    extraargs = {}
    if 'colorseed' in args and args.colorseed:
        extraargs["seed"] = args.colorseed
    if 'cmap' in args and args.cmap:
        extraargs["cmap"] = args.cmap
    extraargs["show"] = not args.silent
    
    plt.style.use('dark_background')
    
    if args.pmode in ['a', 'att']:
        draw_attendance_plot(simple_data, cols, **extraargs)
    elif args.pmode in ['l', 'levelup']:
        draw_levelup_plot(simple_data, **extraargs)
    else:
        print("Unknown mode", args.pmode, file=sys.stderr)
        sys.exit(-3)

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

def stats(args, all_data: "list[dict]"):
    global debug
    
    attcount = {}
    ptotals = {}
    total = len(all_data)
    
    for data in all_data:
        for pname in ptotals:
            ptotals[pname] += 1
        for player in data["players"]:
            pname = player["player"]
            # first player session
            if pname not in attcount:
                ptotals[pname] = 1
            attcount[pname] = attcount.get(pname, 0) + 1
    
    file = sys.stdout
    if args.out:
        file = open(args.out, "w")
    
    try:
        print(",".join(["pname", "count", "total", "pct", "pcttotal"]), file=file)
        if debug:
            print(f"Total sessions: {total}")
        for pname in attcount:
            pct = round(100 * attcount[pname] / ptotals[pname], 2)
            pct_total = round(100 * attcount[pname] / total, 2)
            print(",".join([pname, f"{attcount[pname]}", f"{ptotals[pname]}", f"{pct}", f"{pct_total}"]), file=file)
            
            if debug:
                print((f"P {pname:10s}: {attcount[pname]:2d}/{ptotals[pname]:2d}, "
                        f"{pct:>6.2f}%, {pct_total:>6.2f}% total"
                    ),  file=sys.stderr)    
    finally:
        file.close()

def main(args):
    global debug
    if args.debug:
        debug = True

    all_data = get_folder_data(os.path.abspath(args.path))
    # df = get_simplified_data_df(all_data)
    simple_data, cols = get_simplified_data_cols(all_data)
    
    if args.mode == 'stats':
        stats(args, all_data)
    elif args.mode == 'plot':
        plot(args, simple_data, cols)
    else:
        print("Unkown mode or no mode set!", file=sys.stderr)
        sys.exit(-1)

if __name__ == "__main__":
    args = parser.parse_args()
    
    if args.mode == 'plot':
        import matplotlib
        from matplotlib import pyplot as plt
        from matplotlib import colors
        import numpy as np
        
    if 'mode' not in args:
        print("No mode set!", file=sys.stderr)
        sys.exit(-1)

    main(args)