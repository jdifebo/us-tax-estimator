(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
    "2016": 4050,
    "2017": 4050
}
},{}],2:[function(require,module,exports){
var taxEstimator = require("../us-tax-estimator");

function calculateTax(){
    var year = document.getElementById("year").value;
    var filingStatus = document.getElementById("filing-status").value;
    var grossIncome = document.getElementById("gross").value;
    var exemptions = document.getElementById("exemptions").value;
    var deductions = document.getElementById("deductions").value;
    
    // Calculate stuff
    var taxInfo = taxEstimator.calculate(year, filingStatus, grossIncome, exemptions, deductions);
    
    // Display stuff
    document.getElementById("exemption-multiplier-value").innerHTML = "$" + taxInfo.exemptionAmount.toLocaleString();
    document.getElementById("taxable").innerHTML = "$" + taxInfo.taxableIncome.toLocaleString();
    document.getElementById("tax").innerHTML = "$" + taxInfo.tax.toLocaleString();
    document.getElementById("effective-tax-rate").innerHTML = (taxInfo.effectiveTaxRate * 100).toFixed(2) + "%";
}

/**
 * When filing status is changed, we should also update deductions and exemptions to
 * reasonable default values for single vs joint
 */
function updateFieldsAndTax(){
    var year = document.getElementById("year").value;
    var filingStatus = document.getElementById("filing-status").value;
    document.getElementById("deductions").value = taxEstimator.constants.standardDeduction[year][filingStatus];
    if (filingStatus == "marriedFilingJointly"){
        document.getElementById("exemptions").value = 2;
    }
    else {
        document.getElementById("exemptions").value = 1;
    }
    calculateTax();
}

document.getElementById("gross").addEventListener("keyup", calculateTax);
document.getElementById("exemptions").addEventListener("keyup", calculateTax);
document.getElementById("deductions").addEventListener("keyup", calculateTax);
document.getElementById("filing-status").addEventListener("change", updateFieldsAndTax);
document.getElementById("year").addEventListener("change", updateFieldsAndTax);
updateFieldsAndTax();
},{"../us-tax-estimator":6}],3:[function(require,module,exports){
module.exports={
    "2016": {
        "single" : 259400,
        "marriedFilingJointly" : 311300,
        "headOfHousehold" : 285350
    },
    "2017": {
        "single" : 261500,
        "marriedFilingJointly" : 313800,
        "headOfHousehold" : 287650
    }
}


},{}],4:[function(require,module,exports){
module.exports={
    "2016": {
        "single": 6300,
        "marriedFilingJointly": 12600,
        "headOfHousehold": 9300
    },
    "2017": {
        "single": 6350,
        "marriedFilingJointly": 12700,
        "headOfHousehold": 9350
    }
}


},{}],5:[function(require,module,exports){
module.exports={
    "2016": {
        "single": [
            {"rate": 0.1, "upTo": 9275},
            {"rate": 0.15, "upTo": 37650},
            {"rate": 0.25, "upTo": 91150},
            {"rate": 0.28, "upTo": 190150},
            {"rate": 0.33, "upTo": 413350},
            {"rate": 0.35, "upTo": 415050},
            {"rate": 0.396}
        ],
        "marriedFilingJointly": [
            {"rate": 0.1, "upTo": 18550},
            {"rate": 0.15, "upTo": 75300},
            {"rate": 0.25, "upTo": 151900},
            {"rate": 0.28, "upTo": 231450},
            {"rate": 0.33, "upTo": 413350},
            {"rate": 0.35, "upTo": 466950},
            {"rate": 0.396}
        ],
        "headOfHousehold": [
            {"rate": 0.1, "upTo": 13250},
            {"rate": 0.15, "upTo": 50400},
            {"rate": 0.25, "upTo": 130150},
            {"rate": 0.28, "upTo": 210800},
            {"rate": 0.33, "upTo": 413350},
            {"rate": 0.35, "upTo": 441000},
            {"rate": 0.396}
        ]
    },
    "2017": {
        "single": [
            {"rate": 0.1, "upTo": 9325},
            {"rate": 0.15, "upTo": 37950},
            {"rate": 0.25, "upTo": 91900},
            {"rate": 0.28, "upTo": 191650},
            {"rate": 0.33, "upTo": 416700},
            {"rate": 0.35, "upTo": 418400},
            {"rate": 0.396}
        ],
        "marriedFilingJointly": [
            {"rate": 0.1, "upTo": 18650},
            {"rate": 0.15, "upTo": 75900},
            {"rate": 0.25, "upTo": 153100},
            {"rate": 0.28, "upTo": 233350},
            {"rate": 0.33, "upTo": 416700},
            {"rate": 0.35, "upTo": 470700},
            {"rate": 0.396}
        ],
        "headOfHousehold": [
            {"rate": 0.1, "upTo": 13350},
            {"rate": 0.15, "upTo": 50800},
            {"rate": 0.25, "upTo": 131200},
            {"rate": 0.28, "upTo": 212500},
            {"rate": 0.33, "upTo": 416700},
            {"rate": 0.35, "upTo": 444500},
            {"rate": 0.396}
        ]
    }
}

},{}],6:[function(require,module,exports){
'use strict';

var taxBrackets = require("./tax-brackets.json");



var exemptionPhaseoutStart = require("./exemption-phaseout-start.json")

var standardDeduction = require("./standard-deduction.json");

var defaultExemptionAmount = require("./default-exemption-amount.json");

function calculate(year, filingStatus, grossIncome, exemptions, deductions){
    var exemptionAmount = calculateExemptionAmount(year, filingStatus, grossIncome);
    var taxableIncome = Math.max(0, grossIncome - deductions - exemptions * exemptionAmount);
    var tax = calculateTaxFromTaxableIncome(year, filingStatus, taxableIncome);
    return {
        exemptionAmount : exemptionAmount,
        taxableIncome : taxableIncome,
        tax : tax,
        effectiveTaxRate : tax / grossIncome
    };
}

function calculateTaxFromTaxableIncome(year, filingStatus, taxableIncome){
    taxableIncome = roundIncome(taxableIncome);
    var taxBracketsToUse = taxBrackets[year][filingStatus];
    var tax = calculateTaxForFirstBracket(taxableIncome, taxBracketsToUse[0]);
    for (var i = 1; i < taxBracketsToUse.length - 1; i++){
        tax += calculateTaxForBracket(taxableIncome, taxBracketsToUse[i-1], taxBracketsToUse[i]);
    }
    tax += calculateTaxForLastBracket(taxableIncome, taxBracketsToUse[taxBracketsToUse.length - 2], taxBracketsToUse[taxBracketsToUse.length - 1]);
    return Math.round(tax); // tax is rounded to the nearest dollar after calculations are performed

    // Some helper functions
    function calculateTaxForFirstBracket(income, bracket){
        var incomeInBracket = Math.min(income, bracket.upTo);
        return incomeInBracket * bracket.rate;
    }
    function calculateTaxForBracket(income, previousBracket, bracket){
        var incomeInBracket = Math.max(0, Math.min(income, bracket.upTo) - previousBracket.upTo);
        return incomeInBracket * bracket.rate;
    }
    function calculateTaxForLastBracket(income, previousBracket, bracket){
        var incomeInBracket = Math.max(0, income - previousBracket.upTo);
        return incomeInBracket * bracket.rate;
    }
}



/**
 * Looking at the 2015 tax tables, income is divided up into $50 ranges, and then the center
 * of that range is used.  For example, if you make in between $60,000 and $60,050, you will
 * be taxed as if you made $60,025.
 * 
 * However, if you make less than $3,000, the taxes are divided into $25 ranges.  And if you
 * make less than $25, the ranges are even smaller.  What a pain!
 */
function roundIncome(num){
    if (num >= 3000){
        return Math.floor(num/50)*50 + 25;
    }
    else if (num >= 25) {
        return Math.floor(num/25)*25 + 12.5;
    }
    else {
        return Math.max(0, Math.round(num/10)*10);
    }
}

/**
 * Accounts for the exemption phase-out at high incomes.  It should return the defaultExemptionAmount
 * at lower incomes and 0 for very high incomes, while returning a value in between the two if income
 * is in the phase-out range.
 */
function calculateExemptionAmount(year, filingStatus, income){
    var incomeAbovePhaseoutStart = Math.max(0, income - exemptionPhaseoutStart[year][filingStatus]);
    var stepsAbovePhaseoutStart = Math.ceil(incomeAbovePhaseoutStart / 2500);
    var exemptionPercent = Math.max(0, 1 - (stepsAbovePhaseoutStart * .02));
    return Math.round(exemptionPercent * defaultExemptionAmount[year]);
}

module.exports = {
    calculate : calculate,
    constants : {
        taxBrackets : taxBrackets,
        standardDeduction: standardDeduction,
        defaultExemptionAmount: defaultExemptionAmount
    }
};
},{"./default-exemption-amount.json":1,"./exemption-phaseout-start.json":3,"./standard-deduction.json":4,"./tax-brackets.json":5}]},{},[2]);
