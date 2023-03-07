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
        const dmgBonus = parseInt(sel(".damage #dmgbonus").val());

        for (let i = 0; i < numAttacks; i++  ) {
            const crit = sel(`#crit-box-${i}`)?.is(":checked")
            const [singleDmg, extraDmg] = rollDamage(DEFAULT_WEAPON, crit, dmgBonus)
            results.push({
                id: `Attacco ${i+1}`,
                dmg: singleDmg,
                extraDmg: extraDmg,
                crit: crit,
            })
        }

        if (sel(".damage #polebonus").is(":checked")) {
            const crit = sel(".damage #polebonus-crit").is(":checked")
            const [singleDmg, extraDmg] = rollDamage("polearm-bonus", crit, dmgBonus);
            results.push({
                id: "Attacco bonus",
                dmg: singleDmg,
                extraDmg: extraDmg,
                crit: crit,
            });
        }

        updateDamageTable(results);

        currentResults = results;

        if (sel(".damage #reroll-auto").is(":checked")) {
            let buttonsLeftToCLick = sel(".reroll-button:not(.reroll-used)");
            while (buttonsLeftToCLick.length) {
                buttonsLeftToCLick.first().trigger("click");
                buttonsLeftToCLick = sel(".reroll-button:not(.reroll-used)");
            }
        }
    });

    styleNumberInputs();

    sel("#attacknum").on("change", function(e) {
        if ($(this).val() < 0) {
            $(this).val(0);
        }

        updateCritCheckboxes();
    });

    updateCritCheckboxes();
}

const numberInputWidthByLength = {
    1: -3,
    2: -2.7,
}

function styleNumberInputs() {
    const inputNumbers = sel(`input[type="number"]`);

    inputNumbers.get().forEach(el => {
        const div = $(`<div class="number-input"></div>`);
        div.insertBefore($(el));
        div.append(el);

        const minusButton = $(`<button class="minus" type="button"></button>`);
        minusButton.on("click", ev => {el.stepDown(); $(el).trigger("change")});
        const plusButton = $(`<button class="plus" type="button"></button>`);
        plusButton.on("click", ev => {el.stepUp(); $(el).trigger("change")});
        $(el).before(minusButton);
        $(el).after(plusButton);
    })

    inputNumbers.on("change", ev => {
        const el = $(ev.target);

        const width = numberInputWidthByLength[el.val().length] 
            ? numberInputWidthByLength[el.val().length] 
            : (el.val().length - 4);
        el.width(width + "em");
    });
    inputNumbers.trigger("change")


    // box each input number in a number-box div, pack a sign span with it if needed
    inputNumbers.get().forEach(el => {
        const div = $(`<div class="number-box"></div>`);
        div.insertBefore($(el));
        div.append(el);
    })

    sel(".bonus").before(`<span class="bonus-sign" style="padding-left: 5px">+</span>`)

    sel(".bonus").on("change", function(e) {
        const jthis = $(this)
        const signEl = jthis.prev(".bonus-sign")
        if (jthis.val() < 0) {
            signEl.css("visibility", "hidden")
        } else {
            signEl.css("visibility", "visible")
        }
    });
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
        container.append(`<div class="critbox">
            <label for="${id}">${i + 1}</label>
            <input type="checkbox" id="${id}" name="${id}"/>
        </div>`)
    }
}


function rollDamage(weapon, critical, bonus) {
    if (weapon in weaponFormulas) {
        const formulas = weaponFormulas[weapon]
        const dmgOutput = map(formulas, function(formula, dtype) {
            const isExtra = dtype.startsWith("extra-")
            const critFormula = (critical && !isExtra) 
                ? convertFormulaToCrit(formula)
                : formula;
            const bonusFormula = critFormula.replace("BONUS", bonus)
            const [result, singleRolls] = roll(bonusFormula, true)
            return {
                "value": Math.max(result, 1), 
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
                dmg[dmgType].isWeaponDamage = true
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
 * @typedef {{
 *  value: number, 
 *  formula: string, 
 *  results: number[], 
 *  rerolled: number,
 *  isWeaponDamage: boolean,
 * }} SingleDamage
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
    theadRow.append(`<td class="dmg-head total"></td>`)
    extraDamageTypes.forEach(key => theadRow.append(`<td class="dmg-head ${key}" style="width: ${dmgWidthExtra[key] + 1}em"></td>`));
    theadRow.find(`:nth-child(${damageTypes.length + 3})`).toggleClass("vert-sep") // add vert sep to first extra cell

    const tbody = $(document.createElement("tbody"))
    table.append(tbody)

    damageDataList.forEach((entry, index) => {
        const row = $(document.createElement("tr"));
        row.attr("id", `${slugify(entry.id)}-${index}`);
        tbody.append(row);
        const rowName = $(`<td>${entry.id}</td>`)
        if (entry.crit) {
            rowName.toggleClass("crit")
        }
        row.append(rowName);
        row.relatedDmgRow = entry;

        let hasRerollButton = false;
        let alreadyRerolled = false;

        const addDamageColumns = function(dmgTable, rerollCheck, dmgWidth, noCrits) {
            return dtype => {
                if (dtype in dmgTable) {
                    /** @type {SingleDamage} */
                    const dmgEntry = dmgTable[dtype]
                    const numResults = occurrences(dmgEntry.results)
                    const hasOnes = numResults[1] >= dmgEntry.results.length / 2
                    const hasLowRolls = numResults[1] + numResults[2] >= dmgEntry.results.length / 2
                    const el = $(`<td class="tooltip dmg ${dtype}">
                        ${dmgEntry.value}
                        <div class="tooltiptext">${dmgEntry.formula}<br>${dmgEntry.results}</div>
                    </td>`)
                    if (hasOnes) {
                        el.toggleClass("dmg-one")
                    } else if (hasLowRolls) {
                        el.toggleClass("dmg-low")
                    } else if (entry.crit && !noCrits) {
                        el.toggleClass("crit")
                    }
                    el.css("width", (dmgWidth[dtype] + 1) + "em")
                    el.relatedDmgEntry = dmgEntry
                    el.relatedDmgRow = entry
                    if (rerollCheck) {
                        hasRerollButton = hasRerollButton || dmgEntry.rerolled > 0 
                            || dmgEntry.results.some(n => n === 1 || n === 2);
                        alreadyRerolled = alreadyRerolled || dmgEntry.rerolled > 0;
                    }
                    row.append(el);
                } else {
                    row.append("<td></td>");
                }
            };
        };

        damageTypes.forEach(addDamageColumns(entry.dmg, true, dmgWidth));

        const sum = Object.keys(entry.dmg).reduce((previousValue, current) => previousValue + entry.dmg[current].value, 0);
        const sumFormula = flatmap(Object.keys(entry.dmg), dmgType => entry.dmg[dmgType].formula).join(" + ");
        const sumResults = Object.keys(entry.dmg).reduce((previousValue, current) => previousValue.concat(entry.dmg[current].results), []);
        row.append(`<td class="tooltip dmg total${(entry.crit && !noCrits) ? " crit" : ""}">
            <em>${sum}</em>
            <div class="tooltiptext">${sumFormula}<br>${sumResults}</div>
        </td>`);


        extraDamageTypes.forEach(addDamageColumns(entry.extraDmg, false, dmgWidthExtra, true));

        row.find(`:nth-child(${damageTypes.length + 3})`).toggleClass("vert-sep"); // add vert sep to first extra cell

        if (hasRerollButton) {
            if (alreadyRerolled) {
                rowName.append(makeRerollButton(entry.id, true))
            } else {
                rowName.append(makeRerollButton(entry.id, false))
            }
        }
    });

    // Do total
    const totalRow = $(document.createElement("tr"))
    tbody.append(totalRow)
    totalRow.append("<td><strong>Totale</strong></td>")

    for (const [dmgType, dmg] of Object.entries(total)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
    totalRow.append(`<td><strong><em>${Object.values(total).reduce((a, b) => a + b)}</em></strong></td>`)
    for (const [dmgType, dmg] of Object.entries(extraTotal)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
    totalRow.find(`:nth-child(${damageTypes.length + 3})`).toggleClass("vert-sep") // add vert sep to first extra cell
    
    // Tooltip

    sel('.tooltiptext').get().forEach(el => {
        const jel = $(el)
        const leftPos = jel.width() / 2 + 25
        const topPos = -jel.height() / 2
        jel.css({
            left: leftPos + "px", 
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
            console.log("Rerolling", id)
            Object.keys(targ.dmg).forEach((dmgType) => {
                const dmg = targ.dmg[dmgType]
                if (dmg.isWeaponDamage) {
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
    const out = {};
    Object.keys(obj).forEach(function(key, _) {
        out[key] = fun(obj[key], key, obj)
    });
    return out;
}

function flatmap(array, fun) {
    const out = [];
    array.forEach(function(val, index) {
        out.push(fun(val, index, array));
    });
    return out;
}

function occurrences(array, val) {
    if (val) {
        return array.reduce(function (acc, curr) {
            return (curr === val) ? ++acc : acc;
          }, 0);    
    } else {
        return array.reduce(function (acc, curr) {
            return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc;
        }, {});
    }
}