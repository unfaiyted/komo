import KomoWorkspace from "./workspace.js";

const appName = "komorebic.exe"
import {exec, spawn} from "child_process";
import { layouts}   from "./constants.js"
import {sleep, wrapNumber} from "./utils.js"
import chalk from "chalk"

//TODO? builder?
export default class Komo {

    constructor(workspaceCount = 5) {

        this.workspaceCount = workspaceCount; // could be configurable sometime
        this.currentWorkspace = 0;
        this.currentMonitor = 0;

        this.workspace = [];

        for(let i = 0; i < this.workspaceCount; i++) {
            this.workspace.push(new KomoWorkspace(i))
        }


        console.log(chalk.green(KomoWorkspace.totalWorkspaces + ' workspaces created'))


    }

    getName() {
        return appName;
    }

    start(ffm = "") {
        return appName + ` start  --ffm ${ffm}`;
    }

    stop() {
        return appName + ` stop`;
    }

    async restart(setup) {
        this.exec(this.stop())
        await sleep(1000);
        this.exec(this.start())
        await sleep(2000);
        setup();
    }

    state() {
        return appName + ` state`;
    }

    query(state_query) {
        return appName + ` query ${state_query}`;
    }

    subscribe(named_pipe) {
        return appName + ` subscribe ${named_pipe}`;
    }

    unsubscribe(named_pipe) {
        return appName + ` unsubscribe ${named_pipe}`;
    }

    log() {
        return appName + ` log`;
    }

    quickSaveResize() {
        return appName + ` quick-save-resize`;
    }

    quickLoadResize() {
        return appName + ` quick-load-resize`;
    }

    saveResize(path) {
        return appName + ` save-resize ${path}`;
    }

    loadResize(path) {
        return appName + ` load-resize ${path}`;
    }

    focus(operationDirection) {
        return appName + ` focus ${operationDirection}`;
    }

    move(operationDirection) {
        return appName + ` move ${operationDirection}`;
    }

    cycleFocus(cycleDirection) {
        return appName + ` cycle-focus ${cycleDirection}`;
    }

    cycleMove(cycleDirection) {
        return appName + ` cycle-move ${cycleDirection}`;
    }

    stack(operationDirection) {
        return appName + ` stack ${operationDirection}`;
    }

    resize(edge, sizing) {
        return appName + ` resize ${edge} ${sizing}`;
    }

    resizeAxis(axis, sizing) {
        return appName + ` resize-axis ${axis} ${sizing}`;
    }

    unstack() {
        return appName + ` unstack`;
    }

    cycleStack(cycleDirection) {
        return appName + ` cycle-stack ${cycleDirection}`;
    }

    moveToMonitor(target) {
        return appName + ` move-to-monitor ${target}`;
    }

    moveToWorkspace(target) {
        return appName + ` move-to-workspace ${target}`;
    }

    sendToMonitor(target) {
        return appName + ` send-to-monitor ${target}`;
    }

    sendToWorkspace(target) {
        return appName + ` send-to-workspace ${target}`;
    }

    sendToMonitorWorkspace(target_monitor, target_workspace) {
        return appName + ` send-to-monitor-workspace ${target_monitor} ${target_workspace}`;
    }

    focusMonitor(target) {
        return appName + ` focus-monitor ${target}`;
    }

    focusWorkspace(target) {
        this.currentWorkspace = target;
        console.log(chalk.blue(`Focus workspace: ${target+1}`));
        return appName + ` focus-workspace ${target}`;
    }

    focusMonitorWorkspace(target_monitor, target_workspace) {
        return appName + ` focus-monitor-workspace ${target_monitor} ${target_workspace}`;
    }

    cycleMonitor(cycleDirection) {
        return appName + ` cycle-monitor ${cycleDirection}`;
    }

    cycleWorkspace(cycleDirection) {
        const change =- (cycleDirection === 'left' ) ? -1 : 1;
         this.currentWorkspace =
            wrapNumber(this.currentWorkspace, this.workspaceCount - 1, change);
        console.log(chalk.blue("Loading workspace...: " +  this.currentWorkspace));
        return appName + ` cycle-workspace ${cycleDirection}`;
    }

    moveWorkspaceToMonitor(target) {
        return appName + ` move-workspace-to-monitor ${target}`;
    }

    newWorkspace() {
        return appName + ` new-workspace`;
    }

    resizeDelta(pixels) {
        return appName + ` resize-delta ${pixels}`;
    }

    invisibleBorders(left, top, right, bottom) {
        return appName + ` invisible-borders ${left} ${top} ${right} ${bottom}`;
    }

    workAreaOffset(left, top, right, bottom) {
        return appName + ` work-area-offset ${left} ${top} ${right} ${bottom}`;
    }

    adjustContainerPadding(sizing, adjustment) {
        return appName + ` adjust-container-padding ${sizing} ${adjustment}`;
    }

    adjustWorkspacePadding(sizing, adjustment) {
        return appName + ` adjust-workspace-padding ${sizing} ${adjustment}`;
    }

    changeLayout(default_layout) {
        return appName + ` change-layout ${default_layout}`;
    }

    loadCustomLayout(path) {
        return appName + ` load-custom-layout ${path}`;
    }

    flipLayout(axis) {
        return appName + ` flip-layout ${axis}`;
    }

    promote() {
        return appName + ` promote`;
    }

    retile() {
        return appName + ` retile`;
    }

    ensureWorkspaces(monitor, workspace_count) {
        return appName + ` ensure-workspaces ${monitor} ${workspace_count}`;
    }

    containerPadding(monitor, workspace, size) {
        return appName + ` container-padding ${monitor} ${workspace} ${size}`;
    }

    workspacePadding(monitor, workspace, size) {
        return appName + ` workspace-padding ${monitor} ${workspace} ${size}`;
    }

    workspaceLayout(monitor, workspace, value) {
        return appName + ` workspace-layout ${monitor} ${workspace} ${value}`;
    }

    workspaceCustomLayout(monitor, workspace, path) {
        return appName + ` workspace-custom-layout ${monitor} ${workspace} ${path}`;
    }

    workspaceLayoutRule(monitor, workspace, at_container_count, layout) {
        return appName + ` workspace-layout-rule ${monitor} ${workspace} ${at_container_count} ${layout}`;
    }

    workspaceCustomLayoutRule(monitor, workspace, at_container_count, path) {
        return appName + ` workspace-custom-layout-rule ${monitor} ${workspace} ${at_container_count} ${path}`;
    }

    clearWorkspaceLayoutRules(monitor, workspace) {
        return appName + ` clear-workspace-layout-rules ${monitor} ${workspace}`;
    }

    workspaceTiling(monitor, workspace, value) {
        return appName + ` workspace-tiling ${monitor} ${workspace} ${value}`;
    }

    workspaceName(monitor, workspace, value) {
        this.workspace[workspace].name = value;
        return appName + ` workspace-name ${monitor} ${workspace} ${value}`;
    }

    toggleWindowContainerBehaviour() {
        return appName + ` toggle-window-container-behaviour`;
    }

    togglePause() {
        return appName + ` toggle-pause`;
    }

    toggleTiling() {
        return appName + ` toggle-tiling`;
    }

    toggleFloat() {
        return appName + ` toggle-float`;
    }

    toggleMonocle() {
        return appName + ` toggle-monocle`;
    }

    toggleMaximize() {
        return appName + ` toggle-maximize`;
    }

    restoreWindows() {
        return appName + ` restore-windows`;
    }

    manage() {
        return appName + ` manage`;
    }

    unmanage() {
        return appName + ` unmanage`;
    }

    reloadConfiguration() {
        return appName + ` reload-configuration`;
    }

    watchConfiguration(boolean_state) {
        return appName + ` watch-configuration ${boolean_state}`;
    }

    windowHidingBehaviour(hiding_behaviour) {
        return appName + ` window-hiding-behaviour ${hiding_behaviour}`;
    }

    crossMonitorMoveBehaviour(move_behaviour) {
        return appName + ` cross-monitor-move-behaviour ${move_behaviour}`;
    }

    toggleCrossMonitorMoveBehaviour() {
        return appName + ` toggle-cross-monitor-move-behaviour`;
    }

    unmanagedWindowOperationBehaviour(operation_behaviour) {
        return appName + ` unmanaged-window-operation-behaviour ${operation_behaviour}`;
    }

    floatRule(identifier, id) {
        return appName + ` float-rule ${identifier} "${id}"`;
    }

    manageRule(identifier, id) {
        return appName + ` manage-rule ${identifier} ${id}`;
    }

    workspaceRule(monitor, workspace, identifier, id) {
        return appName + ` workspace-rule ${identifier} ${id} ${monitor} ${workspace}`;
    }

    identifyObjectNameChangeApplication(identifier, id) {
        return appName + ` identify-object-name-change-application ${identifier} ${id}`;
    }

    identifyTrayApplication(identifier, id) {
        return appName + ` identify-tray-application ${identifier} ${id}`;
    }

    identifyLayeredApplication(identifier, id) {
        return appName + ` identify-layered-application ${identifier} ${id}`;
    }

    identifyBorderOverflowApplication(identifier, id) {
        return appName + ` identify-border-overflow-application ${identifier} ${id}`;
    }

    focusFollowsMouse(boolean_state, implementation) {
        return appName + ` focus-follows-mouse ${boolean_state} --implementation ${implementation}`;
    }

    toggleFocusFollowsMouse(implementation) {
        return appName + ` toggle-focus-follows-mouse  --implementation ${implementation}`;
    }

    mouseFollowsFocus(boolean_state) {
        return appName + ` mouse-follows-focus ${boolean_state}`
    }

    toggleMouseFollowsFocus() {
        return appName + ` toggle-mouse-follows-focus`;
    }

    ahkLibrary() {
        return appName + ` ahk-library`
    }

    ahkAppSpecificConfiguration(path, override_path) {
        return appName + ` ahk-app-specific-configuration ${path} ${override_path}`;
    }

    formatAppSpecificConfiguration(path) {
        return appName + ` format-app-specific-configuration ${path}`;
    }

    notificationSchema() {
        return appName + ` notification-schema`;
    }

    completeConfiguration() {
        return appName + ` complete-configuration`;
    }

    exec(string) {
        exec(string, {__approot, stdio: [0, 1, 2]})
    }


    getCurrentWorkspace() {
        return this.workspace[this.currentWorkspace];
    }


    nextLayout() {
        const layout = this.getCurrentWorkspace().cycleLayout("next");
        return this.workspaceCustomLayout(0, this.currentWorkspace,`./config/${layout}.json`)
    }

    previousLayout() {
        const layout = this.getCurrentWorkspace().cycleLayout("previous");
        return this.workspaceCustomLayout(0, this.currentWorkspace,`./config/${layout}.json`)
    }




}

