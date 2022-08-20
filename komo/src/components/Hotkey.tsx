import React, {useEffect, useState} from "react";

export interface KomoHotkeyAction {
    name: string;
    callback: () => void;
}


export interface KomoHotkey {
    keys: Array<string>;
    action: KomoHotkeyAction;
}


export const Hotkey = ({ keys, action } : KomoHotkey) => {
    const [key, setKey] = useState<KomoHotkey>({keys, action})

    const updateKeys = (keys: Array<string>) => {

    }


    useEffect(() => {

    })


    const handleHotkey = (event: KeyboardEvent) => {
       // setKey(() => event.key);
    }


    return (
        <div className="hotkey-container">
            <div className="hotkey">
                <span className="hotkey-hotkey">{key.keys.map((key) => `${key}`).join(" + ")}</span>
            </div>
            <div className="hotkey-action">{key.action.name}</div>
            <div className="hotkey-settings">
                <button className="hotkey-settings">
                    <span className="hotkey-settings-icon">
                        <i className="fa fa-cog"/>
                    </span>
                    <span className="hotkey-settings-label">Edit</span>
                </button>
            </div>
        </div>
    ) as React.ReactElement<any>;

}
