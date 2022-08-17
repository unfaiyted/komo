
//Log every key that's currently pressed.
export const pressedList = [];

export const isKeyReleased = (key) => {
    // remove element from pressed list
    if (pressedList.includes(key)) {
        pressedList.splice(pressedList.indexOf(key), 1);
    }

    return pressedList.includes(key);
}

export const isKeyPressed = (key) => {
    console.log('isKeyPressed', key)
    pressedList.push(key)

}

export const getKeysPressed = () => {
    return pressedList;
}


