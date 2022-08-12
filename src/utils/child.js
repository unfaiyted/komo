import {spawn} from 'child_process';
import chalk from 'chalk';
import net from 'net';

export const spawnChild = (appName) => {

    const child = spawn(appName, ['start','--await-configuration'] , {
        cwd: __approot,
    })

    child.stdout.on('data', function(data) {
        console.log(chalk.yellow('Komo: ' + data));

        data=data.toString();
        //scriptOutput+=data;
    });

    child.stderr.on('data', function(data) {
        console.log(chalk.red('Komo: ' + data));

        data=data.toString();
        //scriptOutput+=data;
    });


    // const net = require('net');





}
