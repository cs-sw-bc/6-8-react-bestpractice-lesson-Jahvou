import { useState } from 'react'
import ThemeDemoProps from './components/ThemeDemoProps'
import ThemeDemo from './components/ThemeDemo'
import UserDemo from './components/UserDemo'
import CartDemo from './components/CartDemo'
import ProfilerDemo from './components/ProfilerDemo'


export default function App() {
  const [version, setVersion] = useState('props')

  return (
    <>
      <div className="version-switcher">
        <button className={version === 'props' ? 'active' : ''} onClick={() => setVersion('props')}>
          Theme — Props
        </button>
        <button className={version === 'context' ? 'active' : ''} onClick={() => setVersion('context')}>
          Theme — Context
        </button>
        <button className={version === 'user' ? 'active' : ''} onClick={() => setVersion('user')}>
          User — Context
        </button>
        <button className={version === 'cart' ? 'active' : ''} onClick={() => setVersion('cart')}>
          Cart — Context
        </button>
        <button className={version === 'profiler' ? 'active' : ''} onClick={() => setVersion('profiler')}>
          Profiler
        </button>
      </div>

      {version === 'props' && <ThemeDemoProps />}
      {version === 'context' && <ThemeDemo />}
      {version === 'user' && <UserDemo />}
      {version === 'cart' && <CartDemo />}
      {version === 'profiler' && <ProfilerDemo />}
    </>
  )
}