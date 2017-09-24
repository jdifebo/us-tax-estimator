var json = {
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
    ], 
    headOfHousehold : [
        {rate: .1, upTo : 13250},
        {rate: .15, upTo : 50400},
        {rate: .25, upTo : 130150},
        {rate: .28, upTo : 210800},
        {rate: .33, upTo : 413350},
        {rate: .35, upTo : 441000},
        {rate: .396}
    ]
}

console.log(JSON.stringify(json));