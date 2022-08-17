import {isKeyPressed} from "./keys.js";
import {UiohookKey as keyPressed} from "uiohook-napi";
import {executeInOrder} from "./utils.js";
import {app} from "../../setup.js";
import {setupAction} from "./config.js";
import {pressedList} from "./keys.js"





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


export const registerShortcuts = async (e) => {
    console.log('Trigger Shortcut Matching')

    isKeyPressed(e.keycode)

    // Reload
    if (e.keycode === keyPressed.R && e.metaKey) {
        await executeInOrder(setupAction(app), __approot);
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
    isPressed(e, keyPressed["0"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(0)));
    isPressed(e, keyPressed["1"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(1)));
    isPressed(e, keyPressed["2"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(2)));
    isPressed(e, keyPressed["3"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(3)));
    isPressed(e, keyPressed["4"], cycleLayoutModifiers, () => app.exec(app.focusWorkspace(4)));

    isPressed(e, keyPressed.Tab, cycleLayoutModifiers, () => app.exec(app.cycleWorkspace("next")))
    // isPressed(e, keyPressed.Tab, ["RIGHT ALT", "RIGHT SHIFT"], () => app.exec(app.cycleWorkspace("previous")))

    isPressed(e, keyPressed.F1, cycleLayoutModifiers, () => app.exec(app.restart()));


}