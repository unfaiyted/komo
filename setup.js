import {GlobalKeyboardListener} from "node-global-key-listener";
import chalk from "chalk";
import {getRoot, executeInOrder, keypress, sleep} from "./src/utils/utils.js"
import Komo from "./src/utils/komo.js"
import {exec, spawn} from "child_process";
import {spawnChild} from "./src/utils/child.js";
import net from "net";

/* This is setting the global variable `__approot` to the root of the project. */
global.__approot = getRoot(import.meta.url);


console.log(chalk.magentaBright("Komo?"));
console.log("Welcome. " + chalk.green("https://komo.com") + ".");

const v = new GlobalKeyboardListener();

//Log every key that's pressed.


v.addListener(function (e, down) {
    console.log(
        `${e.name} / ${e.state === "DOWN" ? "DOWN" : "UP  "} [${e.rawKey._nameRaw}]`
    )

}).then(() => console.log(chalk.green("Added keypress listener")))

// Capture windows keypress events and dont let them do stupid default windows things.
v.addListener(async function (e, down) {
    if (e.state === "DOWN" && (down["LEFT META"] || down["RIGHT META"])) {
        console.log("Preventing default windows keypress action.");
        return true;
    }

    // Reload
    if (e.state === "DOWN" && e.name === "R" && (down["RIGHT CTRL"])) {
        await executeInOrder(setupActions, __approot);
    }


    function isPressed(e, key, modifiers, action) {
        let isDown = true;

        // loop over the modifiers and check that all of them are pressed
        for (let i = 0; i < modifiers.length; i++) {
            if (!down[modifiers[i]]) isDown = false;
        }

        if (e.state === "DOWN" && e.name === key && (isDown)) {
            console.log("ActionTriggered", modifiers, key);
            action();
            return true;
        }

        return false;
    }

    function move(direction) {
        app.exec(app.move(direction))
    }

    const moveWindowModifiers = ["LEFT ALT", "LEFT CTRL"]
    isPressed(e, "H", moveWindowModifiers, () => move("left"));
    isPressed(e, "L", moveWindowModifiers, () => move("right"));
    isPressed(e, "K", moveWindowModifiers, () => move("up"));
    isPressed(e, "J", moveWindowModifiers, () => move("down"));

    // Focus Window
    const focusWindowModifiers = ["LEFT SHIFT", "LEFT CTRL"]
    isPressed(e, "H", focusWindowModifiers, () => app.exec(app.focus("left")));
    isPressed(e, "L", focusWindowModifiers, () => app.exec(app.focus("right")));
    isPressed(e, "K", focusWindowModifiers, () => app.exec(app.focus("up")));
    isPressed(e, "J", focusWindowModifiers, () => app.exec(app.focus("down")));


    const cycleLayoutModifiers = ["RIGHT ALT", "RIGHT CTRL"]
    isPressed(e, "H", cycleLayoutModifiers, () => app.exec(app.nextLayout()));
    isPressed(e, "L", cycleLayoutModifiers, () => app.exec(app.previousLayout()));


    // todo: figure out this???
    //isPressed(e, "Q", cycleLayoutModifiers, () => app.exec(app.query("")));


    // focus specific workspace by number
    isPressed(e, "1", cycleLayoutModifiers, () => app.exec(app.focusWorkspace(0)));
    isPressed(e, "2", cycleLayoutModifiers, () => app.exec(app.focusWorkspace(1)));
    isPressed(e, "3", cycleLayoutModifiers, () => app.exec(app.focusWorkspace(2)));
    isPressed(e, "4", cycleLayoutModifiers, () => app.exec(app.focusWorkspace(3)));
    isPressed(e, "5", cycleLayoutModifiers, () => app.exec(app.focusWorkspace(4)));

    isPressed(e, "TAB", cycleLayoutModifiers, () => app.exec(app.cycleWorkspace("next")))
    isPressed(e, "TAB", ["RIGHT ALT", "RIGHT SHIFT"], () => app.exec(app.cycleWorkspace("previous")))

    isPressed(e, "F1", cycleLayoutModifiers, () => app.exec(app.restart(setup)));


}).then(() => console.log(chalk.green("Added keypress listener")));
const app = new Komo();

console.log("Running...")

exec(app.stop(), {__approot, stdio: [0, 1, 2]});
await sleep(1000)
spawnChild(app.getName());

//console.log(app.exec(app.query()))


// child.unref();
await sleep(4000)

// const PIPE_NAME = 'komo';
// const PIPE_PATH = '\\\\.\\pipe\\';
//
// const client = net.createConnection(PIPE_PATH + PIPE_NAME, () => {
//     console.log('connected to server!');
// });
//
// client.on('data', (data) => {
//     console.log(data.toString());
// });
//
// client.on('end', () => {
//     console.log('disconnected from server');
// });

const setupActions = [
    //
    // app.stop(),
    // app.start(),
    app.floatRule("exe", "ueli.exe"),
    app.identifyTrayApplication("exe", "ueli.exe"),
    app.floatRule("class", "SunAwtDialog"),
    app.floatRule("title", "Calculator"),
    app.identifyBorderOverflowApplication("exe", "Discord.exe"),
    app.identifyTrayApplication("exe", "Discord.exe"),
    app.identifyObjectNameChangeApplication("exe", "idea63.exe"),
    app.identifyTrayApplication("exe", "idea63.exe"),
    app.identifyBorderOverflowApplication("exe", "EXCEL.EXE"),
    app.identifyLayeredApplication("exe", "EXCEL.EXE"),
    app.floatRule("class", "_WwB"),
    app.identifyBorderOverflowApplication("exe", "OUTLOOK.EXE"),
    app.identifyLayeredApplication("exe", "OUTLOOK.EXE"),
    app.identifyLayeredApplication("exe", "WINWORD.EXE"),
    app.identifyBorderOverflowApplication("exe", "WINWORD.EXE"),
    app.identifyTrayApplication("exe", "OUTLOOK.EXE"),
    app.identifyBorderOverflowApplication("exe", "POWERPNT.EXE"),
    app.identifyLayeredApplication("exe", "POWERPNT.EXE"),
    app.floatRule("title", "Microsoft Teams Notification"),
    app.identifyBorderOverflowApplication("exe", "ShareX.exe"),
    app.identifyTrayApplication("exe", "ShareX.exe"),
    app.loadCustomLayout("./config/three-wide.json"),
    app.identifyBorderOverflowApplication("class", "ZPFTEWndClass"),
    app.ensureWorkspaces(0, app.workspaceCount),
    app.invisibleBorders(5, 0, 10, 5),

    app.workspaceName(0, 0, "primary"),
    app.workspaceName(0, 1, "secondary"),
    app.workspaceName(0, 2, "notes"),
    app.workspaceName(0, 3, "communication"),
    app.workspaceName(0, 4, "disarray"),

    app.workspaceCustomLayout(0, 3, "./config/three-wide.json"),

    // Primary Workspace
    app.workspaceRule(0, 0, "exe", "idea63.exe"),

    // Communication Workspace
    app.workspaceRule(0, 3, "exe", "OUTLOOK.EXE"),
    app.workspaceRule(0, 3, "exe", "Teams.exe"),
    app.workspaceRule(0, 4, "exe", "vpnui.exe"),
    app.workspaceRule(0, 3, "exe", "msedge.exe"),
    app.subscribe("komo"),
    app.completeConfiguration()
];

const setup = async () => {
    await executeInOrder(setupActions, __approot);
}

await setup();



await keypress();


console.log("Done.");