'use strict';

var taxBrackets = {
    single : [
        {rate: .1, upTo : 9275},
        {rate: .15, upTo : 37650},
        {rate: .25, upTo : 91150},
        {rate: .28, upTo : 190150},
        {rate: .33, upTo : 413350},
        {rate: .35, upTo : 415050},
        {rate: .396}
    ], 
    marriedFilingJointly : [
        {rate: .1, upTo : 18550},
        {rate: .15, upTo : 75300},
        {rate: .25, upTo : 151900},
        {rate: .28, upTo : 231450},
        {rate: .33, upTo : 413350},
        {rate: .35, upTo : 466950},
        {rate: .396}
    ]
}

var exemptionPhaseoutStart = {
    single : 259400,
    marriedFilingJointly : 311300
}

var standardDeduction = {
    single: 6300,
    marriedFilingJointly: 12600,
    headOfHousehold: 9300
}

var defaultExemptionAmount = 4050;

function calculate(filingStatus, grossIncome, exemptions, deductions){
    var exemptionAmount = calculateExemptionAmount(filingStatus, grossIncome);
    var taxableIncome = grossIncome - deductions - exemptions * exemptionAmount;
    var tax = calculateTaxFromTaxableIncome(filingStatus, taxableIncome);
    return {
        exemptionAmount : exemptionAmount,
        taxableIncome : taxableIncome,
        tax : tax,
        effectiveTaxRate : tax / grossIncome
    };
}

function calculateTaxFromTaxableIncome(filingStatus, taxableIncome){
    taxableIncome = roundIncome(taxableIncome);
    var taxBracketsToUse = taxBrackets[filingStatus];
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
function calculateExemptionAmount(filingStatus, income){
    var incomeAbovePhaseoutStart = Math.max(0, income - exemptionPhaseoutStart[filingStatus]);
    var stepsAbovePhaseoutStart = Math.ceil(incomeAbovePhaseoutStart / 2500);
    var exemptionPercent = Math.max(0, 1 - (stepsAbovePhaseoutStart * .02));
    return Math.round(exemptionPercent * defaultExemptionAmount);
}

module.exports = {
    calculate : calculate,
    constants : {
        taxBrackets : taxBrackets,
        standardDeduction: standardDeduction,
        defaultExemptionAmount: defaultExemptionAmount
    }
};