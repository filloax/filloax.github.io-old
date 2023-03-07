const PARENT_CLASS = "xandra"
const DEFAULT_WEAPON = "covolt-scythe"

const weaponFormulas = {
    "covolt-scythe": {
        "slashing": "1d10+BONUS",
        "lightning": "1d8",
    },
    "polearm-bonus": {
        "bludgeoning": "1d4+BONUS",
    },
}

const rerollableDamage = [
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
            results.push({
                id: `Attacco ${i+1}`,
                dmg: rollDamage(DEFAULT_WEAPON, crit, 7),
                crit: crit,
            })
        }

        if (sel(".damage #polebonus").is(":checked")) {
            const crit = sel(".damage #polebonus-crit").is(":checked")
            results.push({
                id: "Attacco bonus",
                dmg: rollDamage("polearm-bonus", crit, 7),
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
        return map(formulas, function(formula) {
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
 * @typedef {{id: string, dmg: Object<string, SingleDamage>, crit: boolean}} DamageEntry
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

    damageDataList.forEach((val, index) => {
        for (const [dmgType, dmg] of Object.entries(val.dmg)) {
            if (!(dmgType in total)) {
                total[dmgType] = 0
            }
            total[dmgType] += dmg.value
        }
    });

    const damageTypes = Object.keys(total)

    const thead = $(document.createElement("thead"))
    const theadRow = $(document.createElement("tr"))
    thead.append(theadRow)
    table.append(thead)
    theadRow.append("<td><em>Attacco</em></td>")

    damageTypes.forEach((key) => {
        theadRow.append(`<td>${key}</td>`)
    });

    const tbody = $(document.createElement("tbody"))
    table.append(tbody)

    damageDataList.forEach((entry, index) => {
        const row = $(document.createElement("tr"));
        row.attr("id", `${slugify(entry.id)}-${index}`);
        tbody.append(row);
        row.append(`<td>${entry.id}</td>`);
        row.relatedDmgRow = entry

        damageTypes.forEach((dtype) => {
            if (dtype in entry.dmg) {
                /** @type {SingleDamage} */
                const dmgEntry = entry.dmg[dtype]
                const critPart = (entry.crit) ? " crit" : "";
                const el = $(`<td class="tooltip dmg-${dtype}${critPart}">
                    ${dmgEntry.value}
                    <div class="tooltiptext">${dmgEntry.formula}<br>${dmgEntry.results}</div>
                </td>`)
                el.relatedDmgEntry = dmgEntry
                el.relatedDmgRow = entry
                if (dmgEntry.rerolled > 0) {
                    el.append(makeRerollButton(entry.id, true))
                } else if (
                    rerollableDamage.indexOf(dtype) >= 0
                    && dmgEntry.results.some(n => n === 1 || n === 2)
                ) {
                    el.append(makeRerollButton(entry.id))
                }
                row.append(el);
            } else {
                row.append("<td></td>");
            }
        });
    });

    // Do total
    const totalRow = $(document.createElement("tr"))
    tbody.append(totalRow)
    totalRow.append("<td><strong>Totale</strong></td>")

    for (const [dmgType, dmg] of Object.entries(total)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
}

function makeRerollButton(id, alreadyUsed) {
    const el = $(document.createElement("span"))
    el.addClass("reroll-button")
    el.append(`<i class="fa-solid fa-arrow-rotate-left"></i>`)

    if (!alreadyUsed) {
        el.on("click", ev => {
            const targ = currentResults.filter(entry => entry.id == id)[0];
            Object.keys(targ.dmg).forEach((dmgType) => {
                const dmg = targ.dmg[dmgType]
                if (rerollableDamage.indexOf(dmgType) >= 0) {
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