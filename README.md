
> Open this page at [https://padraigfl.github.io/pomodoro/](https://padraigfl.github.io/pomodoro/)

# BBC MicroBit Pomodoro experiment

As the device has a very basic UI and a sound module I figured it had decent potential as a Pomodoro timer and posed an interesting UI challenge in terms of conveying information.

## Controls

### Currently:

- A button: begins timer
- B button: stops timer

### Planned:

Default Behaviour
- A button: begins/resumes timer
- B button: pauses timer
- B button + Button: stops timer
- A + B (for reverse functionality): opens config

Menu Behaviour (sets Work, Break, Long break and Cycle length in order)
- A button: add + 1 to current value (max 25 for first three, 9 for cycle)
- B button: confirm setting

## UI

Minutes are represented by one LED, 

Work periods are displayed from top of screen, eg.
```
#####
#####
####.
.....
.....
```

Breaks are displayed from the bottom of the screen, eg.
```
.....
.....
.....
....#
#####
```

Cycle stage is displayed via a number, eg
```
..#..
.##..
..#..
..#..
.###.
```

UI loops through the following screens every 4 seconds:
 - current minutes remaining
 - total minutes in current storage, dimmed LED
 - current part of cycle
 - total parts in cycle, dimmed LED

# Goals

- [x] Basic pomodoro functionality with representative within device constraint
- [x] Accurate timing (within a few seconds of accuracy via the `input.runningTime()` function)
- [x] Sound effects on state changes 
- [ ] Pause/Stop/Resume functionaly
- [ ] UI displays current settings on launch
- [ ] Ability to input specific times for work and breaks prior to starting
- [ ] ~ Ability to save inputted times ~
- [ ] ~ Ability to resume from current location (within a 1 minute range) in case of power failure~
- [ ] Work on MicroBit v1 without sound (needs testing)

# Issues encountered

Writing to the internal storage is not achievable via MakeCode so a rewrite in MicroPython is required. I will initially write the menu UIs in MakeCode and that can then be cross referenced with the MicroPython code which should be largely the same

The TypeScript compiler had some issues with some things I tried to do (in particular enum values) so I decided to work around it for now.



To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/padraigfl/pomodoro** and click import

## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/padraigfl/pomodoro/raw/master/.github/makecode/blocks.png)

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>