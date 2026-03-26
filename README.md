# Lesson 8 – React Best Practices & Debugging

---

## 1. useEffect & the Component Lifecycle

React components go through three lifecycle stages: **mounting** (added to the DOM), **updating** (re-rendered due to state/prop changes), and **unmounting** (removed from the DOM). The `useEffect` hook lets you run code at each of these stages.

### Basic Syntax

```jsx
useEffect(() => {
  // runs after render
}, [dependencies]);
```

### Dependency Array Patterns

| Pattern | When it runs |
|---|---|
| `useEffect(() => { ... })` | After every render |
| `useEffect(() => { ... }, [])` | Once on mount only |
| `useEffect(() => { ... }, [value])` | On mount + whenever `value` changes |

### Cleanup

If your effect sets up a subscription, timer, or event listener, return a cleanup function to run on unmount:

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);

  return () => clearInterval(timer); // cleanup on unmount
}, []);
```

### Common Use Cases
- Fetching data from an API on mount
- Setting up/tearing down event listeners
- Syncing with external systems (timers, WebSockets)

---

## 2. useContext

### The Problem: Prop Drilling

When state needs to be shared across many components at different levels, passing it as props gets messy fast. Every component in between has to accept and forward props it doesn't even use:

```jsx
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Navbar theme={theme} setTheme={setTheme} />;  // just passing it along
}

function Navbar({ theme, setTheme }) {
  return <ThemeToggle theme={theme} setTheme={setTheme} />;  // finally used here
}
```

This is called **prop drilling** — passing props through components that don't need them just to get data to a deeply nested component.

### The Solution: useContext

`useContext` lets you share state across components without passing props through every level of the tree.

### The Three Steps

**1. Create the context**
```jsx
// ThemeContext.js
import { createContext } from 'react';

export const ThemeContext = createContext(null);
```

**2. Provide the context**

Wrap the part of your tree that needs access to the value:

```jsx
// App.jsx
import { useState } from 'react';
import { ThemeContext } from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext>
  );
}
```

**3. Consume the context**

Any component inside the context wrapper can read the value directly — no props needed:

```jsx
// ThemeToggle.jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

`Layout` and `Navbar` no longer need to know about theme at all.

> **Context doesn't only hold values — it can also hold functions.** Passing `setTheme` through context gives any component the ability to update the shared state, while keeping the actual state in one place.

### Multiple Contexts

A real app will often have several independent contexts. You can nest them — each is completely isolated, and components consume only what they need:

```jsx
<ThemeContext value={{ theme, setTheme }}>
  <UserContext value={{ name, setName }}>
    <CartContext value={{ cart, addItem, calculateTax }}>
      <App />
    </CartContext>
  </UserContext>
</ThemeContext>
```

You can also consume only what a component needs — just destructure the relevant value:

```jsx
const { calculateTax } = useContext(CartContext);
```

> **React 19:** You can also use the `use()` API to read context — `const { theme } = use(ThemeContext)`. Unlike `useContext`, `use()` can be called conditionally inside a component.

### When to Use useContext

| Situation | Recommendation |
|---|---|
| A few components need shared state | Pass props |
| Many components at different levels need the same state | useContext |
| Complex state logic with many actions | useReducer + useContext |
| Large app with frequent global updates | Consider a state library (Redux, Zustand) |

---

## 3. React Developer Tools

React DevTools is a browser extension that adds two tabs to your browser's developer tools: **Components** and **Profiler**.

### Installing

Search **"React Developer Tools"** in the Chrome Web Store or Firefox Add-ons and install the extension. Once installed, open any React app and you will see the Components and Profiler tabs inside browser DevTools (F12).

> The tabs only appear when the page is running a React app — they won't show up on regular websites.

---

### Components Tab

The Components tab gives you a live view of your entire component tree.

**What you can do:**
- Browse every component in your app and see how they are nested
- Click any component to inspect its current **props** and **state** in the right panel
- Edit state and props live to test different values without changing your code
- Use the search bar at the top to find a component by name

**What to look for:**
- State values that don't match what you expect
- Props being passed with the wrong value or missing entirely
- A component that exists in the tree when it shouldn't, or vice versa

---

## 4. Profiler

The Profiler tab records your app while you interact with it and shows you exactly which components rendered, how long each one took, and why.

### How to Use It

1. Open React DevTools → click the **Profiler** tab
2. Click the record button (⏺) to start recording
3. Interact with your app — click buttons, sort a table, open a menu
4. Click the record button again to stop
5. Browse the results using **Flamegraph** or **Ranked** view

**Flamegraph** shows the component hierarchy — wider bars took longer. **Ranked** sorts components from slowest to fastest, making the bottleneck immediately obvious.

### Record Why Each Component Rendered

In Profiler settings (⚙️), enable **"Record why each component rendered"**. After profiling, clicking a component will tell you whether it re-rendered because of a state change, a prop change, or because its parent re-rendered.

### Timeline View

The Timeline view gives a frame-by-frame breakdown of rendering steps. Useful for spotting jank or unexpected sequences of renders.

### CPU Throttling

> In the **Performance** tab of browser DevTools, you can throttle the CPU to simulate a slower device (e.g. 4x or 6x slowdown). This helps you catch performance issues that only show up on low-end devices before they affect real users.

### Key Insight

The Profiler only measures **React's rendering work**. If your app freezes but render times look fine, the bottleneck is likely in your own JavaScript — a slow function running *before* React renders. Move expensive work inside `useMemo` so React accounts for it and the Profiler can catch it.

### The `<Profiler>` Component

You can also measure render performance programmatically using the built-in `<Profiler>` component:

```jsx
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="MovieList" onRender={onRenderCallback}>
      <MovieList />
    </Profiler>
  );
}
```

### onRender Parameters

| Parameter | Description |
|---|---|
| `id` | The `id` prop you gave the `<Profiler>` |
| `phase` | `"mount"` or `"update"` |
| `actualDuration` | Time spent rendering in milliseconds |

> **Note:** Remove `<Profiler>` wrappers before deploying to production — they add a small overhead.

---

## 5. Performance Optimization Tips

### Avoid Unnecessary Re-renders

A component re-renders when its state or props change. If child components re-render when they don't need to, performance suffers.

### useMemo

Caches the result of an expensive calculation so it only re-runs when its dependencies change:

```jsx
const expensiveTotal = useMemo(() => {
  return cart.reduce((sum, item) => sum + item.price, 0);
}, [cart]);
```

### useCallback

Caches a function so it doesn't get recreated on every render. Useful when passing callbacks to child components:

```jsx
const handleAddToCart = useCallback((item) => {
  setCart(prev => [...prev, item]);
}, []);
```

### Other Tips

- Always provide a stable `key` prop when rendering lists — use a unique ID, not the array index
- Avoid creating objects or arrays inline in JSX (they are new references on every render)
- Keep components small — large components re-render more work

### useMemo vs useCallback

| Hook | Caches | Use when |
|---|---|---|
| `useMemo` | A **value** | A calculation is expensive |
| `useCallback` | A **function** | A callback is passed to a child component |

---

## Summary

| Tool / Hook | Purpose |
|---|---|
| `useEffect` | Run side effects and manage lifecycle |
| `useContext` | Share state globally without prop drilling |
| React DevTools (Components) | Inspect and debug component tree |
| React DevTools (Profiler) | Identify slow renders visually |
| `<Profiler>` component | Measure render performance in code |
| `useMemo` | Cache expensive computed values |
| `useCallback` | Cache functions passed to children |