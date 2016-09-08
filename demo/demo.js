var taxEstimator = require("../us-tax-estimator");

function calculateTax(){
    var filingStatus = document.getElementById("filing-status").value;
    var grossIncome = document.getElementById("gross").value;
    var exemptions = document.getElementById("exemptions").value;
    var deductions = document.getElementById("deductions").value;

    // Calculate and display the value of exemptions accounting for phase-out
    var exemptionAmount = taxEstimator.calculateExemptionAmount(grossIncome, filingStatus);
    document.getElementById("exemption-multiplier-value").innerHTML = "$" + exemptionAmount.toLocaleString();
    
    // Calculate and display taxable income by doing subtraction
    var taxableIncome = Math.max(0, grossIncome - exemptions * exemptionAmount - deductions);
    document.getElementById("taxable").innerHTML = "$" + taxableIncome.toLocaleString();

    // Finally calculate and display the actual tax owed
    var tax = taxEstimator.calculateTaxFromGrossIncome(filingStatus, grossIncome, exemptions, deductions);
    document.getElementById("tax").innerHTML = "$" + tax.toLocaleString();

    // Calculate and display the effective tax rate
    var effectiveTaxRate = tax / grossIncome * 100;
    document.getElementById("effective-tax-rate").innerHTML = effectiveTaxRate.toFixed(2) + "%";
}

/**
 * When filing status is changed, we should also update deductions and exemptions to
 * reasonable default values for single vs joint
 */
function updateFieldsAndTax(){
    var filingStatus = document.getElementById("filing-status").value;
    document.getElementById("deductions").value = taxEstimator.constants.standardDeduction[filingStatus];
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
updateFieldsAndTax();