
export const APP_NAME = 'komorebic.exe'


const layout = (name, isCustom) => {
    return {
        name: name,
        isCustom: isCustom,
    }
}
export const layouts = [
    layout("two-wide",true),
    layout("three-wide",true),
    layout("three-wide-no-left-split",true),
    layout("three-wide-no-left-split-equal",true),
    layout("four-wide",true),
    layout("four-wide-equal",true),
    layout("columns",false),
    layout("rows",false),
    layout("horizontal-stack", false),
    layout("vertical-stack",false),
    layout("ultrawide-vertical-stack",false),

]


