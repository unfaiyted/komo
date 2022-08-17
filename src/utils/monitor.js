import KomoWorkspace from "./workspace.js";


export default class KomoMonitor {

    static totalMonitors = 0;

    constructor(id, name="Monitor") {
        this.id = id;
        this.name = name;
        this.workspaces = [new KomoWorkspace(0,"Workspace")];
        KomoMonitor.totalMonitors++;
    }


    addWorkspace(workspace) {
        this.workspaces.push(workspace);
    }



}