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
var currentResults = [];
var savageRerolled = false;

addEventListener("load", function() {
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
        savageRerolled = false;

        /** @type {Array<DamageEntry>} */
        const results = [];
        const numAttacks = parseInt(sel(".damage #attacknum").val());
        const dmgBonus = parseInt(sel(".damage #dmgbonus").val());
        const extraFormula = getExtraDamageFormula();
        const useHalfOrcCrits = isUsingHalforcCrits();

        for (let i = 0; i < numAttacks; i++  ) {
            const crit = sel(`#crit-box-${i}`)?.is(":checked")
            const [mainDmg, extraDmg, bonusDmg] = rollDamage(DEFAULT_WEAPON, crit, dmgBonus, 
                {bonusFormula: extraFormula, halfOrcCrit: useHalfOrcCrits},
                );
            results.push({
                id: `Attacco ${i+1}`,
                dmg: mainDmg,
                bonusDmg: bonusDmg,
                extraDmg: extraDmg,
                crit: crit,
            })
        }

        if (sel(".damage #polebonus").is(":checked")) {
            const crit = sel(".damage #polebonus-crit").is(":checked")
            const [mainDmg, extraDmg, bonusDmg] = rollDamage("polearm-bonus", crit, dmgBonus, 
            {bonusFormula: extraFormula, halfOrcCrit: useHalfOrcCrits},
            );
            results.push({
                id: "Attacco bonus",
                dmg: mainDmg,
                bonusDmg: bonusDmg,
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

    setupExtraDamageButtons();
});

/**
 * @typedef {{
*  value: number, 
*  formula: string, 
*  results: number[], 
*  gwrerolled: number,
*  isWeaponDamage: boolean,
* }} SingleDamage
* @typedef {{
*  id: string, 
*  dmg: Object<string, SingleDamage>,
*  bonusDmg: Object<string, SingleDamage>,
*  extraDmg: Object<string, SingleDamage>,
*  crit: boolean,
*  savageChoiceId: number,
*  isSavageReroll: boolean,
* }} DamageEntry
*/

const numberInputWidthByLength = {
    1: -3,
    2: -2.7,
}

//#region Styling

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

function styleDmgHeaders() {
    const commonClass = "ra"
    sel("td.dmg-head.slashing").addClass(commonClass + " ra-sword")
    sel("td.dmg-head.piercing").addClass(commonClass + " ra-broadhead-arrow ")
    sel("td.dmg-head.bludgeoning").addClass(commonClass + " ra-flat-hammer")

    sel("td.dmg-head.lightning").addClass(commonClass + " ra-lightning-bolt")
    sel("td.dmg-head.fire").addClass(commonClass + " ra-fire")
}

//#endregion

//#region [rgba(175, 125, 255, 0.03)] BaseDamage
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

const baseWeaponDamageTypes = ["piercing", "slashing", "bludgeoning"];

/**
 * 
 * @param {string} weapon 
 * @param {boolean} critical 
 * @param {number} bonus
 * @param {{bonusFormula: string, halfOrcCrit: boolean}} options 
 * @returns 
 */
function rollDamage(weapon, critical, bonus, options = {}) {
    if (weapon in weaponFormulas) {
        const formulas = weaponFormulas[weapon]

        let firstValidBonusType = undefined;

        const dmgOutput = map(formulas, function(formula, dtype) {
            const isExtra = dtype.startsWith("extra-")

            let extraCritDice = 0;

            if (!firstValidBonusType && !isExtra && baseWeaponDamageTypes.indexOf(dtype) >= 0) {
                firstValidBonusType = dtype;
                if (options.halfOrcCrit) {
                    extraCritDice++;
                }
            }

            const formulaWithCrit = (critical && !isExtra) 
                ? convertFormulaToCrit(formula, extraCritDice)
                : formula;
            const formulaWithBonus = formulaWithCrit.replace("BONUS", bonus)
            const [result, singleRolls] = roll(formulaWithBonus, true)
            return {
                "value": Math.max(result, 1), 
                "formula": formulaWithBonus, 
                "results": singleRolls,
                "gwrerolled": 0,
            }
        })

        const dmg = {}, extraDmg = {}, bonusDmg = {}
        Object.keys(dmgOutput).forEach(dmgType => {
            if (dmgType.startsWith("extra-")) {
                const actualDmgType = dmgType.replace("extra-", "")
                extraDmg[actualDmgType] = dmgOutput[dmgType]
            } else {
                dmg[dmgType] = dmgOutput[dmgType]
                dmg[dmgType].isWeaponDamage = true
            }
        })

        if (options.bonusFormula && options.bonusFormula !== "") {
            const bonusFormulaWithCrit = critical
                ? convertFormulaToCrit(options.bonusFormula)
                : options.bonusFormula;
            const bonusFormulaWithBonus = bonusFormulaWithCrit.replace("BONUS", bonus)

            const [result, singleRolls] = roll(bonusFormulaWithBonus, true)

            bonusDmg[firstValidBonusType] = {
                "value": Math.max(result, 1), 
                "formula": bonusFormulaWithBonus, 
                "results": singleRolls,
                "gwrerolled": 0,
                "isWeaponDamage": false,
            }
        }

        return [dmg, extraDmg, bonusDmg]
    } else {
        console.error(`rollDamage: "${weapon}" not a valid weapon!`)
    }
}

/**
 * 
 * @param {string} formula 
 * @returns 
 */
function convertFormulaToCrit(formula, extraDice = 0) {
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
        const newNumStr = `${(num * 2 + extraDice)}d`
        formulaArr.splice(pair[0], pair[1] - pair[0], newNumStr)
        indexPairs.forEach(pair => [
            pair[0] + newNumStr.length - numStr.length,
            pair[1] + newNumStr.length - numStr.length,
        ]);
    }

    return formulaArr.join("")
}
//#endregion

//#region [rgba(255, 125, 125, 0.03)] ExtraDamage

function setupExtraDamageButtons() {
    const enlargeBox = sel("#enlarge")
    const enlargeSuperBox = sel("#enlarge-super")
    const extraFormulaInput = sel("#bonus-formula")

    enlargeBox.on("click", ev => {
        enlargeSuperBox.prop("checked", false);
    });
    enlargeSuperBox.on("click", ev => {
        enlargeBox.prop("checked", false);
    });
    extraFormulaInput.on("change", ev => {
        const valid = DICE_EXPR_REGEX.test(extraFormulaInput.val()) 
            || parseInt(extraFormulaInput.val()) 
            || extraFormulaInput.val() === ""
        sel(".invalid-formula-warn").css({display: valid ? "none" : "block"})
    });
}

function getExtraDamageFormula() {
    const enlargeBox = sel("#enlarge")
    const enlargeSuperBox = sel("#enlarge-super")
    const extraFormulaInput = sel("#bonus-formula")

    const parts = []

    if (enlargeSuperBox.is(":checked")) {
        parts.push("2d4")
    } else if (enlargeBox.is(":checked")) {
        parts.push("1d4")
    }

    const extraVal = extraFormulaInput.val()
    if (DICE_EXPR_REGEX.test(extraVal) || parseInt(extraVal)) {
        parts.push(extraVal)
    }

    return parts.join("+")
}

//#endregion

//#region TableRender

/**
 * 
 * @param {Array<DamageEntry>} damageDataList 
 */
function updateDamageTable(damageDataList) {
    /** @type {JQuery<HTMLTableElement} */
    const table = sel("#dmgresults");
    table.empty();

    const total = {}
    const bonusTotal = {}
    const extraTotal = {}
    const minWidth = 1.5;
    const dmgWidth = {"total": minWidth}
    const dmgWidthBonus = {"total": minWidth}
    const dmgWidthExtra = {"total": minWidth}

    damageDataList.forEach((val, index) => {
        [
            [val.dmg, total, dmgWidth], 
            [val.bonusDmg, bonusTotal, dmgWidthBonus],
            [val.extraDmg, extraTotal, dmgWidthExtra],
        ].forEach(tuple => {
            const dmgTable = tuple[0]; 
            const dmgTotal = tuple[1];
            const dmgMaxWidth = tuple[2];
            let sum = 0;
            for (const [dmgType, dmg] of Object.entries(dmgTable)) {
                if (!(dmgType in dmgTotal)) {
                    dmgTotal[dmgType] = 0;
                    dmgMaxWidth[dmgType] = minWidth;
                }
                dmgTotal[dmgType] += dmg.value
                dmgMaxWidth[dmgType] = Math.max((dmg.value + "").length, dmgMaxWidth[dmgType])
                sum += dmg.value;
            }
            dmgMaxWidth["total"] = Math.max(dmgMaxWidth["total"], (sum + "").length)
        });
    });

    const damageTypes = Object.keys(total)
    const bonusDamageTypes = Object.keys(bonusTotal)
    const extraDamageTypes = Object.keys(extraTotal)

    const thead = $(document.createElement("thead"))
    const theadRow = $(document.createElement("tr"))
    thead.append(theadRow)
    table.append(thead)
    theadRow.append("<td><strong>Attacco</strong></td>")

    damageTypes.forEach(key => theadRow.append(`<td class="dmg-head ${key}" style="max-width: ${dmgWidth[key] + 1}em"></td>`));
    bonusDamageTypes.forEach(key => theadRow.append(`<td class="dmg-head ${key} bonus" style="max-width: ${dmgWidthBonus[key] + 1}em"></td>`));
    theadRow.append(`<td class="dmg-head total"></td>`)
    extraDamageTypes.forEach(key => theadRow.append(`<td class="dmg-head ${key}" style="max-width: ${dmgWidthExtra[key] + 1}em"></td>`));
    const extraSepPos = damageTypes.length + bonusDamageTypes.length + 3;
    theadRow.find(`:nth-child(${extraSepPos})`).toggleClass("vert-sep") // add vert sep to first extra cell

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

        let hasRerollButton = false;
        let alreadyRerolled = false;

        const addDamageColumns = function(dmgTable, rerollCheck, dmgWidth, noCrits, extraClass) {
            return dtype => {
                if (dtype in dmgTable) {
                    /** @type {SingleDamage} */
                    const dmgEntry = dmgTable[dtype]
                    const numResults = occurrences(dmgEntry.results)
                    const hasOnes = numResults[1] >= dmgEntry.results.length / 2
                    const hasLowRolls = numResults[1] + numResults[2] >= dmgEntry.results.length / 2
                    const el = $(`<td class="tooltip dmg ${dtype}}">
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
                    if (extraClass) el.toggleClass(extraClass);
                    el.css("width", (dmgWidth[dtype] + 1) + "em")

                    if (rerollCheck) {
                        hasRerollButton = hasRerollButton || dmgEntry.gwrerolled > 0 
                            || dmgEntry.results.some(n => n === 1 || n === 2);
                        alreadyRerolled = alreadyRerolled || dmgEntry.gwrerolled > 0;
                    }
                    row.append(el);
                } else {
                    row.append("<td></td>");
                }
            };
        };

        damageTypes.forEach(addDamageColumns(entry.dmg, true, dmgWidth));
        bonusDamageTypes.forEach(addDamageColumns(entry.bonusDmg, false, dmgWidthBonus, false, "bonus"));

        const dmgToSum = [entry.dmg, entry.bonusDmg];   
        const sum = dmgToSum.map(v => Object.keys(v).reduce((previousValue, current) => previousValue + v[current].value, 0))
            .reduce((a, b) => a + b);
        const sumFormula = dmgToSum.map(v => Object.keys(v).map(dmgType => v[dmgType].formula).join(" + "))
            .join(" + ");
        const sumResults = dmgToSum.map(v => Object.keys(v).reduce((previousValue, current) => previousValue.concat(v[current].results), []))
            .reduce((a, b) => a.concat(b));
        row.append(`<td class="tooltip dmg total${(entry.crit) ? " crit" : ""}"
            style="max-width: ${dmgWidth["total"] + 1}em"
        >
            <em>${sum}</em>
            <div class="tooltiptext">${sumFormula}<br>${sumResults}</div>
        </td>`);


        extraDamageTypes.forEach(addDamageColumns(entry.extraDmg, false, dmgWidthExtra, true));

        row.find(`:nth-child(${extraSepPos})`).toggleClass("vert-sep"); // add vert sep to first extra cell

        if (hasRerollButton) {
            const btn = makeRerollButton(entry.id, alreadyRerolled)
            rowName.append(btn)
            // const curMargin = rowName.css("margin-right")
            // rowName.css("margin-right", `calc(${curMargin} - ${btn.width()}px)`)
        }

        addSavageAttacker(rowName, entry);
    });

    // Do total
    const totalRow = $(document.createElement("tr"))
    tbody.append(totalRow)
    totalRow.append("<td><strong>Totale</strong></td>")

    for (const [dmgType, dmg] of Object.entries(total)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
    for (const [dmgType, dmg] of Object.entries(bonusTotal)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
    const totalAll =[...Object.values(total), ...Object.values(bonusTotal)].reduce((a, b) => a + b)
    totalRow.append(`<td><strong><em>${totalAll}</em></strong></td>`)
    for (const [dmgType, dmg] of Object.entries(extraTotal)) {
        totalRow.append(`<td><strong>${dmg}</strong></td>`)
    }
    totalRow.find(`:nth-child(${extraSepPos})`).toggleClass("vert-sep") // add vert sep to first extra cell
    
    // Tooltip

    sel('.tooltiptext').get().forEach(el => {
        const jel = $(el)
        const leftPos = jel.width() / 2 + 25
        const topPos = -jel.height() / 2
        jel.css({
            left: leftPos + "px", 
        })
    });

    styleDmgHeaders();
}

//#endregion

//#region Rerolls

function reroll(damageId) {
    const targ = currentResults.find(entry => entry.id == damageId);
    console.log("Rerolling", damageId)
    Object.keys(targ.dmg).forEach((dmgType) => {
        const dmg = targ.dmg[dmgType]
        if (dmg.isWeaponDamage) {
            const formula = dmg.formula
            const [newResult, singleDiceRolls] = roll(formula, true)
            dmg.gwrerolled++
            dmg.value = newResult
            dmg.results = singleDiceRolls
        }
    });

    updateDamageTable(currentResults);
}

function makeRerollButton(id, alreadyUsed) {
    const el = $(document.createElement("span"))
    el.addClass("reroll-button")
    el.append(`<i class="fa-solid fa-arrow-rotate-left"></i>`)

    if (!alreadyUsed) {
        el.on("click", ev => reroll(id));
    } else {
        el.addClass("reroll-used")
    }

    return el
}

function savageRerollChoice(damageId) {
    const targIndex = currentResults.findIndex(entry => entry.id == damageId);
    const targ = currentResults[targIndex]
    console.log("Savage rerolling", damageId)

    const numChoices = 2;

    const maxRerollId = currentResults.map(e => e.savageChoiceId).filter(e => e).find((val, index, arr) => arr.every(val2 => val >= val2))
    const rerollId = maxRerollId ? maxRerollId + 1 : 0;
    targ.savageChoiceId = rerollId;

    for (let i = 1; i < numChoices; i++) {
        /** @type {DamageEntry} */
        const newEntry = deepcopy(targ)
        newEntry.id = `${damageId} (${i + 1})`

        newEntry.savageChoiceId = rerollId;
        newEntry.isSavageReroll = true;

        Object.keys(newEntry.dmg).forEach((dmgType) => {
            const dmg = newEntry.dmg[dmgType]
            if (dmg.isWeaponDamage) {
                const formula = dmg.formula
                const [newResult, singleDiceRolls] = roll(formula, true)
                dmg.value = newResult
                dmg.results = singleDiceRolls
            }
        });

        currentResults.splice(targIndex + i, 0, newEntry);
    }

    savageRerolled = true;

    updateDamageTable(currentResults);
}

function savageChoose(damageId) {
    const targIndex = currentResults.findIndex(entry => entry.id == damageId);
    const targ = currentResults[targIndex];
    const others = currentResults.filter(entry => targ.id !== entry.id && targ.savageChoiceId === entry.savageChoiceId)

    targ.savageChoiceId = undefined;
    targ.isSavageReroll = undefined;

    others.forEach(other => {
        const otherIndex = currentResults.findIndex(e => e.id === other.id);
        currentResults.splice(otherIndex, 1);
    });
    updateDamageTable(currentResults);
}

/**
 * @param {JQuery} element 
 * @param {DamageEntry} dmgEntry
 */
function addSavageAttacker(element, dmgEntry) {
    const button = $(`<span class="savage-button">
        </span>`)
    element.prepend(button)

    if (dmgEntry.savageChoiceId !== undefined) {
        if (dmgEntry.isSavageReroll) {
            button.append(`<i class="fa-solid fa-arrow-turn-up fa-rotate-90"></i>`)
        } else {
            button.append(`<i class="fa-solid fa-arrow-right-long"></i>`)
        }

        button.on("click", ev => savageChoose(dmgEntry.id))
    } else {
        button.append(`<i class="ra ra-axe-swing"></i>
                       <i class="fa-solid fa-arrow-rotate-left"></i>`)

        if (!savageRerolled) {
            button.on("click", ev => savageRerollChoice(dmgEntry.id));
        } else {
            button.addClass("reroll-used");
        }
    }

    return button;
}

//#endregion

//#region HalforcSavage

function isUsingHalforcCrits() {
    return sel("#orc-crits").is(":checked")
}

//#endregion

//#region Old
function resetAttacks() {
    sel("#atkresults").empty()
}

function doAttack(bonus) {
    const rand = rollDice(20)
    const roll = rand + bonus
    sel("#atkresults").append(`<div class="atkresult${(rand == 20) ? " crit" : ""}">${roll}</div>`);
}
//#endregion

// Generic functions

//#region Generic
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

function deepcopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}
//#endregion