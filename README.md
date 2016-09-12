# us-tax-estimator
Estimate US federal income tax by providing basic income information.

This tool is not meant to provide tax advice. This tool is for informational purposes only, and is 
not intended to provide, and should not be relied on for tax advice. You should consult your own 
tax advisors before engaging in any transaction.

## Usage

```js
var estimator = require("us-tax-estimator.js");

var filingStatus = "single"; // "single", "marriedFilingJointly", or "headOfHousehold"
var grossIncome = 300000;
var exemptions = 1;
var deductions = estimator.constants.standardDeduction[filingStatus];

estimator.calculate(filingStatus, grossIncome, exemptions, deductions);

/** Returns an object with 4 properties that looks like this:
 * { 
 *    exemptionAmount: 2673,      // This is how much each exemption is worth accounting for phase-out                                                                                                                       
 *    taxableIncome: 291027,                                                                                                                             
 *    tax: 79568,                                                                                                                                        
 *    effectiveTaxRate: 0.26522666666666667 
 * } 
 */
```


View a simple demo here: https://jdifebo.github.io/us-tax-estimator/