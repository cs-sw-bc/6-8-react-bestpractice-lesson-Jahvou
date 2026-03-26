// 1. Import createContext and useContext (useState is already imported)
import { useState } from 'react'

// 2. Create UserContext here
// const UserContext = ...

export default function UserDemo() {
  const [name, setName] = useState('')

  return (
    // 3. Wrap the div below with UserContext and pass name and setName as the value
    <div className="app-light">
      <NameInput />
      <Greeting />
    </div>
  )
}

function NameInput() {
  // 4. Read name and setName from UserContext using useContext
  const name = ''       // replace this line
  const setName = () => {} // replace this line

  return (
    <div className="panel-light">
      <h1>Set Your Name</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      {/* 5. Add a Reset button that sets name back to '' */}
      <button onClick={() => setName('')}>Reset</button>
    </div>
  )
}

function Greeting() {
  // 6. Read name from UserContext using useContext
  const name = '' // replace this line

  return (
    <div className="panel-light">
      <h1>Hello, {name || 'stranger'}!</h1>
    </div>
  )
}
