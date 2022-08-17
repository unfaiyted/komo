export const setupAction = (app) => {
    return [
        app.floatRule("exe", "ueli.exe"),
        app.identifyTrayApplication("exe", "ueli.exe"),
        app.floatRule("class", "SunAwtDialog"),
        app.floatRule("title", "Calculator"),
        app.identifyBorderOverflowApplication("exe", "Discord.exe"),
        app.identifyTrayApplication("exe", "Discord.exe"),
        app.identifyObjectNameChangeApplication("exe", "idea62.exe"),
        app.identifyTrayApplication("exe", "idea62.exe"),
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
        app.floatRule("exe", "Teams.exe"),
        app.identifyBorderOverflowApplication("exe", "ShareX.exe"),
        app.identifyTrayApplication("exe", "ShareX.exe"),
        app.loadCustomLayout("./config/three-wide.json"),
        app.identifyBorderOverflowApplication("class", "ZPFTEWndClass"),
        app.ensureWorkspaces(0, app.workspaceCount),
        app.invisibleBorders(4, 0, 10, 5),

        app.workspaceName(0, 0, "primary"),
        app.workspaceName(0, 1, "secondary"),
        app.workspaceName(0, 2, "notes"),
        app.workspaceName(0, 3, "communication"),
        app.workspaceName(0, 4, "disarray"),

        app.workspaceCustomLayout(0, 3, "./config/three-wide.json"),

        // Primary Workspace
        //app.workspaceRule(0, 0, "exe", "idea63.exe"),

        // Communication Workspace
        // app.workspaceRule(0, 3, "exe", "OUTLOOK.EXE"),
        // app.workspaceRule(0, 3, "exe", "Teams.exe"),
        // app.workspaceRule(0, 4, "exe", "vpnui.exe"),
        // app.workspaceRule(0, 3, "exe", "msedge.exe"),
        app.subscribe("komo"),
        app.completeConfiguration(),

    ];
}
