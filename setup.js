import {getRoot, executeInOrder, keypress, sleep} from "./src/utils/utils.js"
import {spawnChild} from "./src/utils/child.js";
import {setupAction} from "./src/utils/config.js";
import {isKeyReleased, isKeyPressed} from "./src/utils/keys.js";
import chalk from "chalk";
import path from "path";
import net from "net";
import Komo from "./src/komo.js"
import {registerShortcuts} from "./src/utils/keyboard-shortcuts.js";
/* This is setting the global variable `__approot` to the root of the project. */
global.__approot = getRoot(import.meta.url);

// Debug setting
const disableKomoReload = false;

//TODO: Check my IP and choose a monitor count....

console.log(chalk.magentaBright("Komo?"));
console.log("Welcome. " + chalk.green("https://komo.com") + ".");


// Tracks when a key is released and removes it from the keys list

// Capture windows keypress events
export const app = new Komo();

const setup = async () => {
    await executeInOrder(setupAction(app), __approot);
}

if(!disableKomoReload) {
    app.exec(app.stop(), {__approot, stdio: [0, 1, 2]});
    await sleep(1000)
    spawnChild(app.getName());
    await sleep(4000)
    await setup();
    console.log("app.getHistory():", app.getHistory())

}

app.registerShortcuts();

await keypress();

console.log(chalk.green("Done with setup...."));