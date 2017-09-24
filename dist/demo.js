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