import { useState } from 'react'
    import { WebviewWindow } from '@tauri-apps/api/window'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
    const createWindow = () => {
    const webview = new WebviewWindow('theUniqueLabel'+count, {
        url: 'path/to/page.html',
    })
        setCount((count) => count+1)
// since the webview window is created asynchronously,
// Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
    webview.once('tauri://created', function () {
        // webview window successfully created
        console.log("we did it")
    })
    webview.once('tauri://error', function (e) {
        // an error happened creating the webview window
    })


    }


  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/*<button className="btn" onClick={() => setCount((count) => count + 1)}>*/}
        {/*/!*  count is {count}*!/*/}
        {/*/!*</button>*!/*/}
          <button onClick={() => createWindow()}></button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
