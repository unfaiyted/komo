import {Hotkey, KomoHotkey, KomoHotkeyAction} from "../components/Hotkey";

const sampleHotkeys = [

     {
         keys: ["Ctrl","Alt","Delete"],
         action: {
             name: "delete",
             callback: () => {}
         }
     } as KomoHotkey

] as Array<KomoHotkey>;

const Hotkeys = () => {

    // Menu to change the hotkeys in the application
    return <div>
            <h2>Hotkeys</h2>

            <div className="menu">

            {/*
            Create components that will represent a given hotkey
            */}

                {sampleHotkeys.map((key: KomoHotkey) => {
                return <Hotkey hotkey={key} />
                })}



            </div>)
}