// 1. Import createContext and useContext (useState is already imported)
import { useState } from 'react'

// 2. Create ThemeContext here
// const ThemeContext = ...

export default function ThemeDemo() {
  const [theme, setTheme] = useState('light')
  const [page, setPage] = useState('form')

  return (
    // 3. Wrap the div below with ThemeContext and pass theme as the value
    <div className={'app-' + theme}>

      <nav className={'nav-' + theme}>
        <button onClick={() => setPage('form')}>Form</button>
        <button onClick={() => setPage('about')}>About</button>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </nav>

      {page === 'form' && <FormPage />}
      {page === 'about' && <AboutPage />}

    </div>
  )
}

function FormPage() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  )
}

function AboutPage() {
  return (
    <Panel title="About Us">
      <p>We are a team of developers building cool things.</p>
      <p>This page uses the same theme — no props passed.</p>
      <Button>Contact Us</Button>
    </Panel>
  )
}

function Panel({ title, children }) {
  // 4. Read theme from ThemeContext using useContext
  const theme = 'light' // replace this line

  return (
    <section className={'panel-' + theme}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  // 5. Read theme from ThemeContext using useContext
  const theme = 'light' // replace this line

  return (
    <button className={'button-' + theme}>
      {children}
    </button>
  )
}
