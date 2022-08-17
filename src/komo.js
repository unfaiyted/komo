import chalk from "chalk"
import KomoWorkspace from "./workspace.js";
import {exec} from "child_process";
import { APP_NAME}   from "./utils/constants.js"
import {sleep, wrapNumber} from "./utils/utils.js"
import {registerShortcuts} from "./utils/keyboard-shortcuts.js";
import {uIOhook as v, UiohookKey as keyPressed} from "uiohook-napi";
import {isKeyReleased} from "./utils/keys.js";
import net from "net";
import path from "path";
import {setupAction} from "./utils/config.js";
import KomoMonitor from "./monitor.js";

//TODO? builder?
export default class Komo {

    constructor(workspaceCount = 5) {

        this.currentMonitor = 0;
        this.monitors = [];
        this.appHistory = [];

        // for(let i = 0; i < this.workspaceCount; i++) {

        this.monitors.push(new KomoMonitor(0, true))

        // }
        //
        // console.log(chalk.green(KomoWorkspace.totalWorkspaces + ' workspaces created'))



    }

    getName() {
        return APP_NAME;
    }

    start(ffm = "") {
        return APP_NAME + ` start  --ffm ${ffm}`;
    }

    stop() {
        return APP_NAME + ` stop`;
    }

    async restart() {
        this.exec(this.stop())
        await sleep(1000);
        this.exec(this.start())
        await sleep(2000);
        setupAction(this);
    }

    state() {
        return APP_NAME + ` state`;
    }

    query(state_query) {
        return APP_NAME + ` query ${state_query}`;
    }

    subscribe(named_pipe) {
        // Creates a named pipe before telling komorebi to subscribe to it.
        const pipeName = 'komo';

        let server = net.createServer( (client) => {
            client.on('data',  (data) => {
                // TODO: need to process the data events
                // returns buffer object
                //console.log('data: ',typeof data, data);
                data = data.toString().replace((/  |\r\n|\n|\r/gm),"").replaceAll(" ","");
                if(data) this.onData(data);
            });
        });
        server.listen(path.join('\\\\.\\pipe', pipeName), () => {
            console.log("connected to pipe");
        });


        return APP_NAME + ` subscribe ${named_pipe}`;
    }

    // What to do with the data collected
    onData(data) {
    const original = data;


        try {
            data = JSON.parse(data);
        } catch(e) {
            console.log("Error parsing data: ", e);
            console.log("data:", original)
            return;
        }
        this.appHistory.push(data)
        //console.log("data: " + JSON.parse( data));

        // do something with the data collected
        const { event, state } = data;

        // console.log(event,data)


        const { monitors } = state;

        // console.log(monitors)

        this.currentMonitor = monitors.focused;
            console.log('current-monitor', this.currentMonitor)

        for(let i = KomoMonitor.total-1; KomoMonitor.total < monitors.elements.length; i++) {
            console.log("Found monitors!")
            const focused = (i === monitors.focused)


            // todo: update valid monitor id from zero default

            let existingMonitor = this.monitors.find((monitor)=> monitor.id === monitors.elements?.[i]?.id)

            // dont add an existing monitor
            if(existingMonitor || i === 0) {
                if(i === 0) existingMonitor = this.monitors[i];
                console.log("'Monitor already exists':", 'Monitor already exists')
                existingMonitor.setFocused(focused)
                existingMonitor.setId(monitors.elements[i].id);
                continue;
            }


            this.monitors.push(new KomoMonitor(monitors.elements[i].id, focused))

        }


    }

    getHistory() {
        return this.appHistory;
    }

    unsubscribe(named_pipe) {
        return APP_NAME + ` unsubscribe ${named_pipe}`;
    }

    log() {
        return APP_NAME + ` log`;
    }

    quickSaveResize() {
        return APP_NAME + ` quick-save-resize`;
    }

    quickLoadResize() {
        return APP_NAME + ` quick-load-resize`;
    }

    saveResize(path) {
        return APP_NAME + ` save-resize ${path}`;
    }

    loadResize(path) {
        return APP_NAME + ` load-resize ${path}`;
    }

    focus(operationDirection) {
        return APP_NAME + ` focus ${operationDirection}`;
    }

    move(operationDirection) {
        return APP_NAME + ` move ${operationDirection}`;
    }

    cycleFocus(cycleDirection) {
        return APP_NAME + ` cycle-focus ${cycleDirection}`;
    }

    cycleMove(cycleDirection) {
        return APP_NAME + ` cycle-move ${cycleDirection}`;
    }

    stack(operationDirection) {
        return APP_NAME + ` stack ${operationDirection}`;
    }

    resize(edge, sizing) {
        return APP_NAME + ` resize ${edge} ${sizing}`;
    }

    resizeAxis(axis, sizing) {
        return APP_NAME + ` resize-axis ${axis} ${sizing}`;
    }

    unstack() {
        return APP_NAME + ` unstack`;
    }

    cycleStack(cycleDirection) {
        return APP_NAME + ` cycle-stack ${cycleDirection}`;
    }

    moveToMonitor(target) {
        return APP_NAME + ` move-to-monitor ${target}`;
    }

    moveToWorkspace(target) {
        return APP_NAME + ` move-to-workspace ${target}`;
    }

    sendToMonitor(target) {
        return APP_NAME + ` send-to-monitor ${target}`;
    }

    sendToWorkspace(target) {
        return APP_NAME + ` send-to-workspace ${target}`;
    }

    sendToMonitorWorkspace(target_monitor, target_workspace) {
        return APP_NAME + ` send-to-monitor-workspace ${target_monitor} ${target_workspace}`;
    }

    focusMonitor(target) {
        return APP_NAME + ` focus-monitor ${target}`;
    }

    focusWorkspace(target) {
        this.currentWorkspace = target;
        console.log(chalk.blue(`Focus workspace: ${target+1}`));
        return APP_NAME + ` focus-workspace ${target}`;
    }

    focusMonitorWorkspace(target_monitor, target_workspace) {
        return APP_NAME + ` focus-monitor-workspace ${target_monitor} ${target_workspace}`;
    }

    cycleMonitor(cycleDirection) {
        return APP_NAME + ` cycle-monitor ${cycleDirection}`;
    }

    cycleWorkspace(cycleDirection) {
        const change =- (cycleDirection === 'left' ) ? -1 : 1;
         this.currentWorkspace =
            wrapNumber(this.currentWorkspace, this.workspaceCount - 1, change);
        console.log(chalk.blue("Loading workspace...: " +  this.currentWorkspace));
        return APP_NAME + ` cycle-workspace ${cycleDirection}`;
    }

    moveWorkspaceToMonitor(target) {
        return APP_NAME + ` move-workspace-to-monitor ${target}`;
    }

    newWorkspace() {
        return APP_NAME + ` new-workspace`;
    }

    resizeDelta(pixels) {
        return APP_NAME + ` resize-delta ${pixels}`;
    }

    invisibleBorders(left, top, right, bottom) {
        return APP_NAME + ` invisible-borders ${left} ${top} ${right} ${bottom}`;
    }

    workAreaOffset(left, top, right, bottom) {
        return APP_NAME + ` work-area-offset ${left} ${top} ${right} ${bottom}`;
    }

    adjustContainerPadding(sizing, adjustment) {
        return APP_NAME + ` adjust-container-padding ${sizing} ${adjustment}`;
    }

    adjustWorkspacePadding(sizing, adjustment) {
        return APP_NAME + ` adjust-workspace-padding ${sizing} ${adjustment}`;
    }

    changeLayout(default_layout) {
        return APP_NAME + ` change-layout ${default_layout}`;
    }

    loadCustomLayout(path) {
        return APP_NAME + ` load-custom-layout ${path}`;
    }

    flipLayout(axis) {
        return APP_NAME + ` flip-layout ${axis}`;
    }

    promote() {
        return APP_NAME + ` promote`;
    }

    retile() {
        return APP_NAME + ` retile`;
    }

    ensureWorkspaces(monitor, workspace_count) {
        return APP_NAME + ` ensure-workspaces ${monitor} ${workspace_count}`;
    }

    containerPadding(monitor, workspace, size) {
        return APP_NAME + ` container-padding ${monitor} ${workspace} ${size}`;
    }

    workspacePadding(monitor, workspace, size) {
        return APP_NAME + ` workspace-padding ${monitor} ${workspace} ${size}`;
    }

    workspaceLayout(monitor, workspace, value) {
        return APP_NAME + ` workspace-layout ${monitor} ${workspace} ${value}`;
    }

    workspaceCustomLayout(monitor, workspace, path) {
        return APP_NAME + ` workspace-custom-layout ${monitor} ${workspace} ${path}`;
    }

    workspaceLayoutRule(monitor, workspace, at_container_count, layout) {
        return APP_NAME + ` workspace-layout-rule ${monitor} ${workspace} ${at_container_count} ${layout}`;
    }

    workspaceCustomLayoutRule(monitor, workspace, at_container_count, path) {
        return APP_NAME + ` workspace-custom-layout-rule ${monitor} ${workspace} ${at_container_count} ${path}`;
    }

    clearWorkspaceLayoutRules(monitor, workspace) {
        return APP_NAME + ` clear-workspace-layout-rules ${monitor} ${workspace}`;
    }

    workspaceTiling(monitor, workspace, value) {
        return APP_NAME + ` workspace-tiling ${monitor} ${workspace} ${value}`;
    }

    workspaceName(monitor, workspace, value) {

        let space = null;
        let currMonitor = this.monitors[monitor];
        // check if workspace exists and if not create it
        try {
            space = currMonitor.getWorkspaceById(workspace);
        } catch (e) {
            // create it if it isnt there
            currMonitor.addWorkspace(workspace, currMonitor.id)
        }

        return APP_NAME + ` workspace-name ${monitor} ${workspace} ${value}`;
    }

    toggleWindowContainerBehaviour() {
        return APP_NAME + ` toggle-window-container-behaviour`;
    }

    togglePause() {
        return APP_NAME + ` toggle-pause`;
    }

    toggleTiling() {
        return APP_NAME + ` toggle-tiling`;
    }

    toggleFloat() {
        return APP_NAME + ` toggle-float`;
    }

    toggleMonocle() {
        return APP_NAME + ` toggle-monocle`;
    }

    toggleMaximize() {
        return APP_NAME + ` toggle-maximize`;
    }

    restoreWindows() {
        return APP_NAME + ` restore-windows`;
    }

    manage() {
        return APP_NAME + ` manage`;
    }

    unmanage() {
        return APP_NAME + ` unmanage`;
    }

    reloadConfiguration() {
        return APP_NAME + ` reload-configuration`;
    }

    watchConfiguration(boolean_state) {
        return APP_NAME + ` watch-configuration ${boolean_state}`;
    }

    windowHidingBehaviour(hiding_behaviour) {
        return APP_NAME + ` window-hiding-behaviour ${hiding_behaviour}`;
    }

    crossMonitorMoveBehaviour(move_behaviour) {
        return APP_NAME + ` cross-monitor-move-behaviour ${move_behaviour}`;
    }

    toggleCrossMonitorMoveBehaviour() {
        return APP_NAME + ` toggle-cross-monitor-move-behaviour`;
    }

    unmanagedWindowOperationBehaviour(operation_behaviour) {
        return APP_NAME + ` unmanaged-window-operation-behaviour ${operation_behaviour}`;
    }

    floatRule(identifier, id) {
        return APP_NAME + ` float-rule ${identifier} "${id}"`;
    }

    manageRule(identifier, id) {
        return APP_NAME + ` manage-rule ${identifier} ${id}`;
    }

    workspaceRule(monitor, workspace, identifier, id) {
        return APP_NAME + ` workspace-rule ${identifier} ${id} ${monitor} ${workspace}`;
    }

    identifyObjectNameChangeApplication(identifier, id) {
        return APP_NAME + ` identify-object-name-change-application ${identifier} ${id}`;
    }

    identifyTrayApplication(identifier, id) {
        return APP_NAME + ` identify-tray-application ${identifier} ${id}`;
    }

    identifyLayeredApplication(identifier, id) {
        return APP_NAME + ` identify-layered-application ${identifier} ${id}`;
    }

    identifyBorderOverflowApplication(identifier, id) {
        return APP_NAME + ` identify-border-overflow-application ${identifier} ${id}`;
    }

    focusFollowsMouse(boolean_state, implementation) {
        return APP_NAME + ` focus-follows-mouse ${boolean_state} --implementation ${implementation}`;
    }

    toggleFocusFollowsMouse(implementation) {
        return APP_NAME + ` toggle-focus-follows-mouse  --implementation ${implementation}`;
    }

    mouseFollowsFocus(boolean_state) {
        return APP_NAME + ` mouse-follows-focus ${boolean_state}`
    }

    toggleMouseFollowsFocus() {
        return APP_NAME + ` toggle-mouse-follows-focus`;
    }

    ahkLibrary() {
        return APP_NAME + ` ahk-library`
    }

    ahkAppSpecificConfiguration(path, override_path) {
        return APP_NAME + ` ahk-app-specific-configuration ${path} ${override_path}`;
    }

    formatAppSpecificConfiguration(path) {
        return APP_NAME + ` format-app-specific-configuration ${path}`;
    }

    notificationSchema() {
        return APP_NAME + ` notification-schema`;
    }

    completeConfiguration() {

        // get history up until now.
        //TODO: remove this
        console.log(this.getHistory());
        return APP_NAME + ` complete-configuration`;
    }

    exec(string) {
        exec(string, {__approot, stdio: [0, 1, 2]})
    }


    getCurrentWorkspace() {

        const monitor = this.monitors[this.currentMonitor];
        console.log('grabbing workspace', this.currentMonitor,"monitor", monitor)

        return monitor.getCurrentWorkspace();
    }

    getCurrentMonitor() {
        return this.monitors[this.currentMonitor];
    }


    nextLayout(monitor = false) {

        const layout = this.getCurrentWorkspace().cycleLayout("next");
        if(layout.isCustom) return this.workspaceCustomLayout(this.currentMonitor, this.currentWorkspace,`./config/${layout.name}.json`)

        return this.workspaceLayout(this.currentMonitor, this.currentWorkspace, layout.name)
    }

    previousLayout(monitor = false) {

        const layout = this.getCurrentWorkspace().cycleLayout("previous");
        if(layout.isCustom) return this.workspaceCustomLayout(this.currentMonitor, this.currentWorkspace,`./config/${layout.name}.json`)

        return this.workspaceLayout(this.currentMonitor, this.currentWorkspace, layout.name)
    }

    registerShortcuts() {
        // tracks pressed shortcuts
        v.on("keyup", (e)=> isKeyReleased(e.keycode));
        v.on("keydown", registerShortcuts);
        v.start();
    }m




}

