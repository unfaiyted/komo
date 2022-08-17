import KomoWorkspace from "./workspace.js";


export default class KomoMonitor {

    static total = 0;

    constructor(id, focused, workspaceCount = 3) {
        this.id = id;
        this.focused = focused;

        this.currentWorkspace = 0;
        this.name = "KomoMonitor " + id;
        this.workspaces = [];
        this.totalWorkspaces = workspaceCount;

        for(let i = 0; i < workspaceCount; i++) {
            this.workspaces.push(new KomoWorkspace(i, id));
        }

        KomoMonitor.total++;

        console.log("KomoMonitor created");
        console.log("id: ", id, "focused",focused,"name",this.name);
    }


    addWorkspace(id, monitorId) {
        this.workspaces.push(new Workspace(id, monitorId));
    }


    update(data){

    }

    setFocused(focused) {
        this.focused = focused;
    }


    getCurrentWorkspace() {
        return this.workspaces[this.currentWorkspace];
    }

    getWorkspaceById(id) {
        return this.workspaces[id];
    }


   setId(id) {
        this.id = id;
   }

}