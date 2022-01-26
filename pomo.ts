/*
  This file handles the logic for pomodoro timer stages including UI output

  To minimise code complexity there is a "STOPPED" state which runs when timer is disabled
*/

namespace Stage {
    export const SECOND = 1000;
    const MINUTE = 60 * SECOND;

    // using enums crashes makecode compiler
    const StageName = {
        SHORT_BREAK: "SHORT_BREAK",
        LONG_BREAK: "LONG_BREAK",
        WORK: "WORK",
        STOPPED: "STOPPED",
    };

    export interface Stage {
        type: string;
        remaining: number;
        cycleStage?: number;
    }

    type StageConfig<K = Stage> = {
        SHORT_BREAK: number;
        LONG_BREAK: number;
        WORK: number;
        workCycleLength: number;
        // required due to MakeCode enum issue
        [k: string]: number;
    };

    // returns fresh default stage object
    const getDefaultStage = () => ({
        type: StageName.STOPPED,
        remaining: Infinity,
    });

    // builds out configs in milliseconds
    const getStageConfigFromSettings = (config: any): StageConfig => ({
        SHORT_BREAK: config.short * MINUTE,
        LONG_BREAK: config.long * MINUTE,
        WORK: config.work * MINUTE,
        workCycleLength: config.cycleLength,
    });

    // for tracking state changes
    let internalStageTracker = getDefaultStage();

    let displayCounter = 0;

    const displayFunctions = [
        // minutes remaining ceil
        (val: Stage, config: StageConfig) => {
            led.setBrightness(192);
            counterDisplay(
                Math.ceil(val.remaining / MINUTE),
                val.type !== StageName.WORK
            );
        },
        // total minutes
        (val: Stage, config: StageConfig) => {
            led.setBrightness(32);
            counterDisplay(
                Math.ceil(config[val.type] / MINUTE),
                val.type !== StageName.WORK
            );
        },
        // current work step
        (val: Stage, config: StageConfig) => {
            led.setBrightness(192);
            basic.showNumber(val.cycleStage + 1);
        },
        // total steps in cycle
        (val: Stage, config: StageConfig) => {
            led.setBrightness(32);
            basic.showNumber(config.workCycleLength);
        },
    ];

    export const getPomoStageDeterminer = (settings: any) => {
        const config = getStageConfigFromSettings(settings);
        const twoStepSpan = config[StageName.WORK] + config[StageName.SHORT_BREAK];
        // N work stages plus N - 1 short breaks
        const longBreakStart =
            twoStepSpan * config.workCycleLength - config[StageName.SHORT_BREAK];
        // Loops back to initial step after long break
        const fullCycleLength = longBreakStart + config[StageName.LONG_BREAK];
        const updateState = getStateUpdater(config);
        return (pomoRunningTimeMS: number) => {
            if (pomoRunningTimeMS === -1) {
                updateState(getDefaultStage());
                return;
            }

            const currentCycleTime = pomoRunningTimeMS % fullCycleLength;

            // in time patch for a long break
            if (currentCycleTime > longBreakStart) {
                updateState({
                    type: StageName.LONG_BREAK,
                    remaining: fullCycleLength - currentCycleTime,
                    cycleStage: config.workCycleLength,
                });
                return;
            }
            const twoStepTime = currentCycleTime % twoStepSpan;
            // ignoring long break to ensure uniform stage lengths
            const cycleStage = Math.floor(currentCycleTime / twoStepSpan);
            if (twoStepTime > config[StageName.WORK]) {
                updateState({
                    cycleStage,
                    type: StageName.SHORT_BREAK,
                    remaining: twoStepSpan - twoStepTime,
                });
                return;
            }
            updateState({
                cycleStage,
                type: StageName.WORK,
                remaining: config[StageName.WORK] - twoStepTime,
            });
        };
    };

    const playStateChangeSound = (stageName: string) => {
        switch (stageName) {
            case StageName.SHORT_BREAK:
                music.playTone(Note.C, 200);
                music.playTone(Note.C3, 150);
                break;
            case StageName.LONG_BREAK:
                music.playTone(Note.C, 150);
                music.playTone(Note.C3, 150);
                music.playTone(Note.C4, 150);
                break;
            case StageName.WORK:
                music.playTone(Note.CSharp3, 150);
                music.playTone(Note.CSharp, 150);
            default:
                return;
        }
    };

    export const getStateUpdater =
        (config: StageConfig) => (stage: Stage.Stage) => {
            const hasStateChanged = stage.type !== internalStageTracker.type;
            internalStageTracker = stage;
            if (hasStateChanged) {
                // attempt to include v1 functionality
                try {
                    playStateChangeSound(stage.type);
                } catch(e){}
                basic.clearScreen();
            }
            if (internalStageTracker.type !== StageName.STOPPED) {
                displayFunctions[displayCounter](internalStageTracker, config);
                displayCounter = (displayCounter + 1) % 4;
            }
        };

    // determines how many of the 25 led to fill
    const counterDisplay = (count: number, invert?: boolean) => {
        if (count > 25) {
            // ERROR if over accepted length
            basic.showString("e");
        } else if (invert) {
            ledCountsInverted[count]();
            // basic.showNumber(count)
        } else {
            ledCounts[count]();
        }
    };
}
