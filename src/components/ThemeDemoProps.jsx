import { useState, createContext, useContext } from 'react'

// 2. create themeContect here
const ThemeContext = createContext(null);

export default function ThemeDemoProps() {
  const [theme, setTheme] = useState('light')
  const [page, setPage] = useState('form')

  return (
    <ThemeContext value={{theme}}>
    <div className={'app-' + theme}>

      <nav className={'nav-' + theme}>
        <button onClick={() => setPage('form')}>Form</button>
        <button onClick={() => setPage('about')}>About</button>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </nav>

      {page === 'form' && <FormPage theme={theme} />}
      {page === 'about' && <AboutPage theme={theme} />}

    </div>
    </ThemeContext>
  )
}

// FormPage doesn't use theme itself — just passes it down
function FormPage({ theme }) {
  return (
    <Panel title="Welcome" theme={theme}>
      <Button theme={theme}>Sign up</Button>
      <Button theme={theme}>Log in</Button>
    </Panel>
  )
}

// AboutPage doesn't use theme itself — just passes it down
function AboutPage({ theme }) {
  return (
    <Panel title="About Us" theme={theme}>
      <p>We are a team of developers building cool things.</p>
      <p>Every component here receives theme as a prop, even if it doesn't need it.</p>
      <Button theme={theme}>Contact Us</Button>
    </Panel>
  )
}

function Panel({ title, children }) {
  const {theme} = useContext(ThemeContext)
  return (
    <section className={'panel-' + theme}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {

  const {theme} = useContext(ThemeContext)
  return (
    <button className={'button-' + theme}>
      {children}
    </button>
  )
}
