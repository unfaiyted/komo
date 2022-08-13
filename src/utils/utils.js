import {exec} from 'child_process';
import chalk from 'chalk';

// File tools
import path from "path"
import {fileURLToPath} from "url";
import {layouts} from "./constants.js";



export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * It executes a string in the terminal
 * @param string - The command to execute
 * @param [cwd=./] - The current working directory. This is where the command will be executed.
 */
export const execute = async (string, cwd = "./") => {
    console.log(chalk.green(`Executing: ${string} at ${cwd}`));
    try {
        exec(string, {cwd, stdio: 'inherit'})
        await sleep(200);
    } catch (err) {
        console.log(chalk.red(`Failed to execute: ${string} at ${cwd}`));
    }
}

/**
 * It executes a series of commands in the terminal.
 * @param array
 * @param cwd
 * @returns {Promise<void>}
 */
export const executeInOrder = async (array, cwd = "./") => {
    for (let i = 0; i < array.length; i++) {
        await execute(array[i], cwd);
        console.log(chalk.green(`Executed: ${array[i]}`));
        
    }
}


export const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', data => {
        const byteArray = [...data]
        if (byteArray.length > 0 && byteArray[0] === 3) {
            console.log('^C')
            process.exit(1)
        }
        process.stdin.setRawMode(false)
        resolve()
    }))
}


/**
 * It returns the root directory of the current file.
 * @returns The directory of the file that is being imported.
 */
export const getRoot = (url) => {
    const __filename = fileURLToPath(url);
    return path.dirname(__filename);
}


/**
 * This functioon should take in the current number and figure out
 * what the new value will be after the change. If the number goes over
 * the max it will return the value wrapping back at zero. Otherwise if it goes below
 * zero it will return the highest value.
 *
 *
 *todo: this function would break if the number exceeds the max number by a large amount
 * @param number
 * @param max
 * @param change
 */
export function wrapNumber(number, max, change) {
                            // 11, 11, 1
    number = number+change;
    // 11 + 1 < 0 = false
    if (number < 0) number = max-(number);
    // 11 +1 = 12 > 11 = true ; number = (12)-12) = 0
    if (number > max) number = (number)-max;

    return number;
}