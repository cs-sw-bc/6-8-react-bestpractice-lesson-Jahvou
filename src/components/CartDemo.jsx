// 1. Import createContext and useContext (useState is already imported)
import { useState, createContext, useContext } from 'react'

// 2. Create CartContext here
const CartContext = createContext(null);
const movies = [
  { id: 1, title: 'Inception', price: 12.99 },
  { id: 2, title: 'Interstellar', price: 11.99 },
  { id: 3, title: 'The Dark Knight', price: 13.99 },
  { id: 4, title: 'Dune', price: 14.99 },
]

export default function CartDemo() {
  const [cart, setCart] = useState([])

  // 3. Define addItem — adds a movie to cart
  const addItem = (movie) => setCart(prev => [...prev, movie])

  // 4. Define removeItem — removes a movie from cart by id
  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id))

  // 5. Define calculateTax — returns subtotal * 0.13
  const calculateTax = () => cart.reduce((sum, item) => sum + item.price, 0) * 0.13

  return (
    // 6. Wrap the div below with CartContext and pass cart, addItem, removeItem, calculateTax as the value
    <div className="app-light">
      <CartContext value={{cart, addItem, removeItem, calculateTax}}>
      <MovieList />
      <CartSummary />
      </CartContext>
    </div>
  )
}

function MovieList() {
  // 7. Read cart and addItem from CartContext using useContext
  const {cart, addItem} = useContext(CartContext);          // replace this line

  return (
    <div className="panel-light">
      <h1>Now Showing</h1>
      {movies.map(movie => {
        const inCart = cart.some(item => item.id === movie.id)
        return (
          <div key={movie.id} className="movie-row">
            <span>{movie.title}</span>
            <span>${movie.price.toFixed(2)}</span>
            <button onClick={() => addItem(movie)} disabled={inCart}>
              {inCart ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

function CartSummary() {
  // 8. Read cart, removeItem, and calculateTax from CartContext using useContext
  const {cart, removeItem, calculateTax} = useContext(CartContext); 

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="panel-light">
      <h1>Your Cart</h1>
      {cart.length === 0 && <p>No items in cart.</p>}
      {cart.map(item => (
        <div key={item.id} className="movie-row">
          <span>{item.title}</span>
          <span>${item.price.toFixed(2)}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      {cart.length > 0 && (
        <div className="cart-totals">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax (13%): ${calculateTax().toFixed(2)}</p>
          <p><strong>Total: ${(subtotal + calculateTax()).toFixed(2)}</strong></p>
        </div>
      )}
    </div>
  )
}
