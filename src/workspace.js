import {wrapNumber} from "./utils/utils.js";
import {layouts} from "./utils/constants.js";
import chalk from "chalk";


export default class KomoWorkspace {

    static totals = {

    }

    constructor(id, monitorId) {
        this.id = id;
        this.monitorId = monitorId;
        this.name = 'Workspace '+ id ;
        this.layoutIndex = 0;


        KomoWorkspace.totals[id]++;

    }

    getMonitorTotal() {
        return KomoWorkspace.totals[this.id];
    }

    static listTotalsByMonitor() {
        console.log("Totals by Monitor");
        console.log(KomoWorkspace.totals)
    }

    cycleLayout(direction) {

        const change = (direction === 'previous') ? -1 : 1;

        this.layoutIndex = wrapNumber(this.layoutIndex, layouts.length - 1, change);
        this.layout = layouts[this.layoutIndex];

        console.log(chalk.blue("Loading previous layout: ", this.layout.name, this.toString()));

        return this.layout;

    }

    sync() {
        // sync data from komorebi
    }

    toString() {
        return `Id: ${this.id}, 
        Name:${this.name}, 
        layoutIndex:${this.layoutIndex}, 
        TotalWorkspaces: ${this.getMonitorTotal()}`;
    }




}