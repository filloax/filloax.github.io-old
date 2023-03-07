const PARENT_CLASS = "xandra"
const DEFAULT_WEAPON = "covolt-scythe"

const weaponFormulas = {
    "covolt-scythe": {
        "slashing": "1d10+BONUS",
        "lightning": "1d8",
        "extra-lightning": "1d8",
    },
    "polearm-bonus": {
        "bludgeoning": "1d4+BONUS",
    },
}

// Rerollable, affected by enlarge, etc
const weaponDamage = [
    "bludgeoning",
    "slashing",
    "piercing",
]

/** @type {DamageEntry[]} */
var currentResults = []

window.onload = function() {
    sel("#rollattacks").on("click", function(e) {
        e.preventDefault();
        let numattacks = sel(".attack #attacknum").val();
        if (sel("#asurge").is(":checked")) {
            numattacks *= 2;
        }
        if (sel(".attack #polebonus").is(":checked")) {
            numattacks++;
        }
        const bonus = parseInt(sel("#attackbonus").val());

        console.log(`Rolling ${numattacks} attacks with +${bonus} bonus`);

        resetAttacks();

        for (let i = 0; i < numattacks; i++) {
            doAttack(bonus);
        }
    });

    sel("#rolldamage").on("click", function(e) {
        /** @type {Array<DamageEntry>} */
        const results = [];
        const numAttacks = parseInt(sel(".damage #attacknum").val());

        for (let i = 0; i < numAttacks; i++  ) {
            const crit = sel(`#crit-box-${i}`)?.is(":checked")
            const [singleDmg, extraDmg] = rollDamage(DEFAULT_WEAPON, crit, 7)
            results.push({
                id: `Attacco ${i+1}`,
                dmg: singleDmg,
                extraDmg: extraDmg,
                crit: crit,
            })
        }

        if (sel(".damage #polebonus").is(":checked")) {
            const crit = sel(".damage #polebonus-crit").is(":checked")
            const [singleDmg, extraDmg] = rollDamage("polearm-bonus", crit, 7);
            results.push({
                id: "Attacco bonus",
                dmg: singleDmg,
                extraDmg: extraDmg,
                crit: crit,
            });
        }

        updateDamageTable(results);

        currentResults = results;
    });

    sel(".damage #attacknum").on("change", function(e) {
        console.log("test", $(this).val())
        if ($(this).val() < 0) {
            $(this).val(0);
        }

        updateCritCheckboxes();
    });

    updateCritCheckboxes();
}

function resetAttacks() {
    sel("#atkresults").empty()
}

function doAttack(bonus) {
    const rand = rollDice(20)
    const roll = rand + bonus
    sel("#atkresults").append(`<div class="atkresult${(rand == 20) ? " crit" : ""}">${roll}</div>`);
}


function updateCritCheckboxes() {
    const atkNum = parseInt(sel(".damage #attacknum").val())
    const container = sel("#critcheckboxes")
    container.empty()

    for (let i = 0; i < atkNum; i++) {
        const id = "crit-box-" + i
        container.append(`
            <label for="${id}">${i + 1}</label>
            <input type="checkbox" id="${id}" name="${id}"/>
        `)
    }
}


function rollDamage(weapon, critical, bonus) {
    if (weapon in weaponFormulas) {
        const formulas = weaponFormulas[weapon]
        const dmgOutput = map(formulas, function(formula) {
            const critFormula = (critical) 
                ? convertFormulaToCrit(formula)
                : formula;
            const bonusFormula = critFormula.replace("BONUS", bonus)
            const [result, singleRolls] = roll(bonusFormula, true)
            return {
                "value": result, 
                "formula": bonusFormula, 
                "results": singleRolls,
                "rerolled": 0,
            }
        })

        const dmg = {}, extraDmg = {}
        Object.keys(dmgOutput).forEach(dmgType => {
            if (dmgType.startsWith("extra-")) {
                const actualDmgType = dmgType.replace("extra-", "")
                extraDmg[actualDmgType] = dmgOutput[dmgType]
            } else {
                dmg[dmgType] = dmgOutput[dmgType]
            }
        })
        return [dmg, extraDmg]
    } else {
        console.error(`rollDamage: "${weapon}" not a valid weapon!`)
    }
}

/**
 * 
 * @param {string} formula 
 * @returns 
 */
function convertFormulaToCrit(formula) {
    const diceRegex = /([1-9]\d*)?d/g;
    let match;
    const indexPairs = [];

    while (null !== (match = diceRegex.exec(formula))) {
        indexPairs.push([match.index, diceRegex.lastIndex]);
    }

    let formulaArr = formula.split("")

    while (indexPairs.length > 0) {
        pair = indexPairs.pop();
        const numStr = formulaArr.slice(pair[0], pair[1]);
        const num = (numStr === "d") ? 1 : parseInt(numStr.slice(0, -1))
        const newNumStr = `${(num * 2)}d`
        formulaArr.splice(pair[0], pair[1] - pair[0], newNumStr)
        indexPairs.forEach(pair => [
            pair[0] + newNumStr.length - numStr.length,
            pair[1] + newNumStr.length - numStr.length,
        ]);
    }

    return formulaArr.join("")
}

/**
 * @typedef {{value: number, formula: string, results: number[], rerolled: number}} SingleDamage
 * @typedef {{
 *  id: string, 
 *  dmg: Object<string, SingleDamage>,
 *  extraDmg: Object<string, SingleDamage>,
 *  crit: boolean,
 * }} DamageEntry
 */

/**
 * 
 * @param {Array<DamageEntry>} damageDataList 
 */
function updateDamageTable(damageDataList) {
    /** @type {JQuery<HTMLTableElement} */
    const table = sel("#dmgresults");
    table.empty();

    const total = {}
    const extraTotal = {}
    const dmgWidth = {}
    const dmgWidthExtra = {}

    damageDataList.forEach((val, index) => {
        [[val.dmg, total, dmgWidth], [val.extraDmg, extraTotal, dmgWidthExtra]].forEach(tuple => {
            const dmgTable = tuple[0]; const dmgTotal = tuple[1];
            const dmgMaxWidth = tuple[2];
            for (const [dmgType, dmg] of Object.entries(dmgTable)) {
                if (!(dmgType in dmgTotal)) {
                    dmgTotal[dmgType] = 0
                    dmgMaxWidth[dmgType] = 0
                }
                dmgTotal[dmgType] += dmg.value
                dmgMaxWidth[dmgType] = Math.max((dmg.value + "").length, dmgMaxWidth[dmgType])
            }
        });
    });

    const damageTypes = Object.keys(total)
    const extraDamageTypes = Object.keys(extraTotal)

    const thead = $(document.createElement("thead"))
    const theadRow = $(document.createElement("tr"))
    thead.append(theadRow)
    table.append(thead)
    theadRow.append("<td><strong>Attacco</strong></td>")

    damageTypes.forEach(key => theadRow.append(`<td class="dmg-head ${key}" style="width: ${dmgWidth[key] + 1}em"></td>`));
    theadRow.append(`<td class="vert-sep"><em>Extra</em></td>`)
    extraDamageTypes.forEach(key => theadRow.append(`<td class="dmg-head ${key}" style="width: ${dmgWidthExtra[key] + 1}em"></td>`));

    const tbody = $(document.createElement("tbody"))
    table.append(tbody)

    damageDataList.forEach((entry, index) => {
        const row = $(document.createElement("tr"));
        row.attr("id", `${slugify(entry.id)}-${index}`);
        tbody.append(row);
        row.append(`<td>${entry.id}</td>`);
        row.relatedDmgRow = entry

        const addDamageColumns = function(dmgTable, rerollCheck, dmgWidth) {
            return dtype => {
                if (dtype in dmgTable) {
                    /** @type {SingleDamage} */
                    const dmgEntry = dmgTable[dtype]
                    const critPart = (entry.crit) ? " crit" : "";
                    const el = $(`<td class="tooltip dmg ${dtype}${critPart}">
                        ${dmgEntry.value}
                        <div class="tooltiptext">${dmgEntry.formula}<br>${dmgEntry.results}</div>
                    </td>`)
                    el.css("width", (dmgWidth[dtype] + 1) + "em")
                    el.relatedDmgEntry = dmgEntry
                    el.relatedDmgRow = entry
                    if (rerollCheck) {
                        if (dmgEntry.rerolled > 0) {
                            el.append(makeRerollButton(entry.id, true))
                        } else if (
                            weaponDamage.indexOf(dtype) >= 0
                            && dmgEntry.results.some(n => n === 1 || n === 2)
                        ) {
                            el.append(makeRerollButton(entry.id))
                        }
                    }
                    row.append(el);
                } else {
                    row.append("<td></td>");
                }
            };
        };

        damageTypes.forEach(addDamageColumns(entry.dmg, true, dmgWidth));

        row.append(`<td class="vert-sep"></td>`);

        extraDamageTypes.forEach(addDamageColumns(entry.extraDmg, false, dmgWidthExtra));
    });

    // Do total
    const totalRow = $(document.createElement("tr"))
    tbody.append(totalRow)
    totalRow.append("<td><strong>Totale</strong></td>")

    for (const [dmgType, dmg] of Object.entries(total)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
    totalRow.append(`<td class="vert-sep"></td>`);
    for (const [dmgType, dmg] of Object.entries(extraTotal)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
    
    // Tooltip

    sel('.tooltiptext').get().forEach(el => {
        const jel = $(el)
        const leftPos = jel.width() / 2 + 25
        const topPos = -jel.height() / 2
        jel.css({
            left: leftPos + "px", 
            // top: topPos + "px",
        })
    });
}

function makeRerollButton(id, alreadyUsed) {
    const el = $(document.createElement("span"))
    el.addClass("reroll-button")
    el.append(`<i class="fa-solid fa-arrow-rotate-left"></i>`)

    if (!alreadyUsed) {
        el.on("click", ev => {
            const targ = currentResults.find(entry => entry.id == id);
            Object.keys(targ.dmg).forEach((dmgType) => {
                const dmg = targ.dmg[dmgType]
                if (weaponDamage.indexOf(dmgType) >= 0) {
                    const formula = dmg.formula
                    const [newResult, singleDiceRolls] = roll(formula, true)
                    dmg.rerolled++
                    dmg.value = newResult
                    dmg.results = singleDiceRolls
                }
            });

            updateDamageTable(currentResults);
        });
    } else {
        el.addClass("reroll-used")
    }

    return el
}

// Generic functions

function sel(str) {
    return $(`.${PARENT_CLASS} ${str}`)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}  

rollDice = (dicesize) => getRandomInt(1, dicesize + 1)

const DICE_EXPR_REGEX = /([1-9]\d*)?d([1-9]\d*)/
const DICE_FORMULA_REGEX = /((([1-9]\d*)?d([1-9]\d*)(\s*?[-+×x*÷\/]\s*?(\d,\d|\d)+(\.\d+)?)?))+?/

function rollSimple(diceFormula, getSingles) {
    const match = DICE_EXPR_REGEX.exec(diceFormula)
    if (match) {
        const num = (match[1] === "") ? 1 : parseInt(match[1])
        const dice = parseInt(match[2])
        let results = [];
        for (let i = 0; i < num; i++) 
            results.push(rollDice(dice));
        const tot = results.reduce((a, b) => a + b)
        return getSingles ? [tot, results] : tot
    } else {
        console.error(`roll: ${diceFormula} not a dice expression!`)
    }
}

function roll(diceFormula, getSingleRolls) {
    if (DICE_FORMULA_REGEX.test(diceFormula)) {
        let diceMatches = DICE_EXPR_REGEX.exec(diceFormula)
        const allRolls = []
        while (diceMatches) {
            const [result, singleRolls] = rollSimple(diceMatches[0], true)
            diceFormula = diceFormula.replace(diceMatches[0], result)
            diceMatches = DICE_EXPR_REGEX.exec(diceFormula)
            singleRolls.forEach(r => allRolls.push(r))
        }
        const res = eval(diceFormula)
        return getSingleRolls ? [res, allRolls] : res
    } else {
        console.error(`roll: ${diceFormula} not a dice formula!`)
    }
}

/**
 * 
 * @param {string} str 
 * @returns 
 */
function slugify(str) {
    return str.toLowerCase().replace(/\s+/, "-")
}

function map(obj, fun) {
    out = {};
    Object.keys(obj).forEach(function(key, _) {
        out[key] = fun(obj[key], key, obj)
    });
    return out;
}