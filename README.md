# us-tax-estimator
Estimate US federal income tax by providing basic income information.

This tool is not meant to provide tax advice. This tool is for informational purposes only, and is 
not intended to provide, and should not be relied on for tax advice. You should consult your own 
tax advisors before engaging in any transaction.

## Usage

```js
var estimator = require("./us-tax-estimator.js");

var year = "2017";  // 2017 or 2016
var filingStatus = "single"; // "single" or "marriedFilingJointly"
var grossIncome = 300000;
var exemptions = 1;
var deductions = estimator.constants.standardDeduction[year][filingStatus];

var tax = estimator.calculate(year, filingStatus, grossIncome, exemptions, deductions);

/** Returns an object with 4 properties that looks like this:
 * { 
 *    exemptionAmount: 2754,                                                                                                                             
 *    taxableIncome: 290896,                                                                                                                             
 *    tax: 79388,                                                                                                                                        
 *    effectiveTaxRate: 0.2646266666666667 
 * } 
 */
```


View a simple demo here: https://jdifebo.github.io/us-tax-estimator/