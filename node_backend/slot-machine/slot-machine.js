const chance = require('chance').Chance();
const min = 0;
const max = 22;

const slotsTypes = {
    'cherry': [
        2, 5, 10
    ],
    'orange': [
        0, 15, 30
    ],
    'prune': [
        0, 40, 50
    ],
    'bell': [
        0, 50, 80
    ],
    'bar1': [
        0, 0, 100
    ],
    'bar2': [
        0, 0, 150
    ],
    'bar3': [
        0, 0, 250
    ],
    'seven': [
        0, 0, 500
    ],
    'anybar': [0, 0, 80]
};

const slots = [
    [
        'orange',
        'bell',
        'orange',
        'bar2',
        'prune',
        'orange',
        'bar3',
        'prune',
        'orange',
        'bar1',
        'bell',
        'cherry',
        'orange',
        'prune',
        'bell',
        'bar1',
        'cherry',
        'seven',
        'orange',
        'prune',
        'orange',
        'bell',
        'orange'
    ],
    [
        'cherry',
        'prune',
        'orange',
        'bell',
        'bar1',
        'cherry',
        'prune',
        'bar3',
        'cherry',
        'bell',
        'orange',
        'bar1',
        'seven',
        'cherry',
        'bar2',
        'cherry',
        'bell',
        'prune',
        'cherry',
        'orange',
        'cherry',
        'prune',
        'orange'
    ],
    [
        'cherry',
        'orange',
        'bell',
        'prune',
        'bar2',
        'cherry',
        'prune',
        'orange',
        'bar3',
        'cherry',
        'bell',
        'orange',
        'cherry',
        'orange',
        'cherry',
        'prune',
        'bar1',
        'seven',
        'bell',
        'cherry',
        'cherry',
        'orange',
        'bell'
    ]
];


const slotMachine = {
    processBet : processBet
}

function processBet()
{
    let spins = [
        chance.integer({min,max}),
        chance.integer({min,max}),
        chance.integer({min,max})
    ]
    console.log(spins);
    let win = calculateWin(spins);

    return {
        win,
        spins
    }
}

function calculateWin(spin) {
    console.log(slots[0][spin[0]] + " " + slots[1][spin[1]] + " " + slots[2][spin[2]]);
    let slotType = slots[0][spin[0]],
        matches = 1,
        barMatch = /bar/.test(slotType)
            ? 1
            : 0,
        winnedCredits = 0,
        waitToSpin = 10;
    //console.log("slotType == slots[1][spin[1]] - " + slotType == slots[1][spin[1]]);
    if (slotType == slots[1][spin[1]]) {
        matches++;
        if (slotType == slots[2][spin[2]]) {
            //console.log("slotType == slots[2][spin[2]] - " + slotType == slots[2][spin[2]])
            matches++;
        } else if (barMatch != 0 && /bar/.test(slots[2][spin[2]])) {
            barMatch++;
        }
    } else if (barMatch != 0 && /bar/.test(slots[1][spin[1]])) {
        barMatch++;
        if (/bar/.test(slots[2][spin[2]])) {
            barMatch++;
        }
    }
    if (matches != 3 && barMatch == 3) {
        slotType = 'anybar';
        matches = 3;
    }

    winnedCredits = slotsTypes[slotType][matches - 1];
    console.log(matches + " " + barMatch + " " + winnedCredits);
    return winnedCredits;
}
module.exports = slotMachine;