import {uIOhook as v, UiohookKey as keyPressed} from "uiohook-napi";
import chalk from "chalk";
import {getRoot, executeInOrder, keypress, sleep} from "./src/utils/utils.js"
import Komo from "./src/utils/komo.js"
import {exec, spawn} from "child_process";
import {spawnChild} from "./src/utils/child.js";
import net from "net";
import {setupAction} from "./src/utils/config.js";
import path from "path";
/* This is setting the global variable `__approot` to the root of the project. */
global.__approot = getRoot(import.meta.url);


//TODO: Check my IP and choose a monitor count....


console.log(chalk.magentaBright("Komo?"));
console.log("Welcome. " + chalk.green("https://komo.com") + ".");

//Log every key that's pressed.
const pressedList = [];


const disableKomoReload = false;

const isKeyReleased = (key) => {
    // remove element from pressed list
    if (pressedList.includes(key)) {
        pressedList.splice(pressedList.indexOf(key), 1);
    }

    return pressedList.includes(key);
}

const isKeyPressed = (key) => {
    pressedList.push(key)
}



v.on("keyup", function (e) {
    isKeyReleased(e.keycode)
})

// Capture windows keypress events and dont let them do stupid default windows things.
v.on('keydown', async function (e) {
    isKeyPressed(e.keycode)

    // Reload
    if (e.keycode === keyPressed.R && e.metaKey) {
        await executeInOrder(setupActions, __approot);
    }

    function isPressed(e, key, modifiers, action) {
        let isDown = true;

        // loop over the modifiers and check that all of them are pressed
        for (let i = 0; i < modifiers.length; i++) {
            if (pressedList.indexOf(modifiers[i]) === -1) isDown = false;
        }

        if (e.keycode === key && (isDown)) {
            console.log("ActionTriggered", modifiers, key);
            action();
            return true;
        }

        return false;
    }

    function move(direction) {
        app.exec(app.move(direction))
    }

    const moveWindowModifiers = [keyPressed.Ctrl, keyPressed.Alt]
    isPressed(e, keyPressed.H, moveWindowModifiers, () => move("left"));
    isPressed(e, keyPressed.L, moveWindowModifiers, () => move("right"));
    isPressed(e, keyPressed.K, moveWindowModifiers, () => move("up"));
    isPressed(e, keyPressed.J, moveWindowModifiers, () => move("down"));

    // Focus Window
    const focusWindowModifiers = [keyPressed.Ctrl, keyPressed.Shift]
    isPressed(e, keyPressed.H, focusWindowModifiers, () => app.exec(app.focus("left")));
    isPressed(e, keyPressed.L, focusWindowModifiers, () => app.exec(app.focus("right")));
    isPressed(e, keyPressed.K, focusWindowModifiers, () => app.exec(app.focus("up")));
    isPressed(e, keyPressed.J, focusWindowModifiers, () => app.exec(app.focus("down")));


    const cycleLayoutModifiers = [keyPressed.CtrlRight, keyPressed.AltRight, keyPressed.ShiftRight] ;
    isPressed(e, keyPressed.H, cycleLayoutModifiers, () => app.exec(app.nextLayout()));
    isPressed(e, keyPressed.L, cycleLayoutModifiers, () => app.exec(app.previousLayout()));


    // todo: figure out this???
    //isPressed(e, "Q", cycleLayoutModifiers, () => app.exec(app.query("")));


    // focus specific workspace by number
    isPressed(e, keyPressed["1"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(0)));
    isPressed(e, keyPressed["2"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(1)));
    isPressed(e, keyPressed["3"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(2)));
    isPressed(e, keyPressed["4"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(3)));
    isPressed(e, keyPressed["5"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(4)));

    isPressed(e, keyPressed.Tab, cycleLayoutModifiers, () => app.exec(app.cycleWorkspace("next")))
    // isPressed(e, keyPressed.Tab, ["RIGHT ALT", "RIGHT SHIFT"], () => app.exec(app.cycleWorkspace("previous")))

    isPressed(e, keyPressed.F1, cycleLayoutModifiers, () => app.exec(app.restart(setup)));


})
const app = new Komo();

console.log("Running...")

if(!disableKomoReload) {
    (app.stop(), {__approot, stdio: [0, 1, 2]});

    await sleep(1000)
    spawnChild(app.getName());

//console.log(app.exec(app.query()))

// child.unref();
    await sleep(4000)
}

const pipeName = 'komo';

let server = net.createServer(function (client) {
    client.on('data', function (data) {
        console.log("data: " + data.toString());
    });
});

server.listen(path.join('\\\\.\\pipe', pipeName), function() {
    console.log("connected");
});



const setup = async () => {
    await executeInOrder(setupAction(app), __approot);
}


if (!disableKomoReload) await setup();


v.start();
await keypress();


console.log("Done.");