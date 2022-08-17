import {wrapNumber} from "./utils.js";
import {layouts} from "./constants.js";
import chalk from "chalk";


export default class KomoWorkspace {

    static totalWorkspaces = 0;

    constructor(id, name = 'Workspace') {
        this.id = id;
        this.name = name;
        this.layoutIndex = 0;

        KomoWorkspace.totalWorkspaces++;

    }

    cycleLayout(direction) {

        const change = (direction === 'previous') ? -1 : 1;

        this.layoutIndex = wrapNumber(this.layoutIndex, layouts.length - 1, change);
        this.layout = layouts[this.layoutIndex];

        console.log(chalk.blue("Loading previous layout: ", this.layout.name, this.toString()));

        return this.layout;

    }


    toString() {
        return `Id: ${this.id}, 
        Name:${this.name}, 
        layoutIndex:${this.layoutIndex}, 
        TotalWorkspaces: ${KomoWorkspace.totalWorkspaces}`;
    }

}