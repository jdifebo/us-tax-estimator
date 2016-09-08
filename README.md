# us-tax-estimator
Estimate US federal income tax by providing basic income information.

This tool is not meant to provide tax advice. This tool is for informational purposes only, and is 
not intended to provide, and should not be relied on for tax advice. You should consult your own 
tax advisors before engaging in any transaction.

## Usage

```js
var taxEstimator = require("./us-tax-estimator");

taxEstimator.calculateTaxFromTaxableIncome("single", 100000);
// -> 21044

var filingStatus = "marriedFilingJointly"   // Choose between "single" and "marriedFilingJointly"
var grossIncome = 100000
var exemptions = 2;
var deductions = taxEstimator.constants.standardDeduction[filingStatus];
taxEstimator.calculateTaxFromGrossIncome(filingStatus, grossIncome, exemptions, deductions);
// -> 11374

// Calculate exemptions accounting for phase-out at high income
taxEstimator.calculateExemptionAmount("single", 300000);
// -> 2673
```

View a simple demo here: https://jdifebo.github.io/us-tax-estimator/