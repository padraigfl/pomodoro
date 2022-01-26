/**
 * sets a time in runningTime for buttons to be disabled until
 */
function startTimer () {
    if (pomoTimeSpent == -1) {
        startTime = input.runningTime()
        pomoTimeSpent = 0
    }
}
function stopTimer () {
    if (pomoTimeSpent != 1) {
        pomoTimeSpent = -1
        basic.showLeds(`
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            . . . . .
            `)
    }
    return
}
function areButtonsEnabled () {
    // const runningTime = input.runningTime();
    // if (runningTime < disableButtonsUntil) {
    // basic.showIcon(IconNames.Sad)
    // music.playTone(Note.Eb3, 500);
    // basic.clearScreen();
    // return false;
    // }
    // disableButtonsUntil = runningTime + 1000;
    return true
}
let timeNow = 0
let pomoTimeSpent = 0
let startTime = 0
let disableButtonsUntil = 0
let MESSAGE_SPEED = 80
const pomoSettings = {
    work: 20,
    short: 4,
    long: 12,
    cycleLength: 4,
};
const updatePomoTime = Stage.getPomoStageDeterminer(pomoSettings);
// point in device lifecycle when timer was started
startTime = -1
// amount of time in current timer run
pomoTimeSpent = -1
// basic.showString("pomodoro | < START < | > STOP >", MESSAGE_SPEED);
let interval = 1000
function onButtonPressed(button: Button, func: any) {
    input.onButtonPressed(button, () => {
        if (areButtonsEnabled()) {
            func()
        }
    })
}

loops.everyInterval(interval, function () {
    timeNow = input.runningTime()
    if (pomoTimeSpent != -1) {
        pomoTimeSpent = timeNow - startTime
        updatePomoTime(pomoTimeSpent);
    }
})

basic.forever(function () {
    input.onButtonPressed(Button.A, startTimer);
    input.onButtonPressed(Button.B, stopTimer);
})
