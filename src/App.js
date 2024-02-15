import './App.css';
import React,{ useState,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; //Import Bootstrap CSS
import ProductList from './components/ProductList'; // Import your component
import Cart  from './components/Cart';
import Login from './components/Login';
import {BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom';
import Registration  from './components/Registration';
import MainLayout from './components/MainLayout';
import { jwtDecode } from 'jwt-decode';
import CartService from './CartService';
import OrderService from  './OrderService';
import OrderConfirmation from './OrderConfirmation';
import OrderDetails from './OrderDetails';

  function App() {
    
  const[isAuthenticated, setIsAuthenticated] = useState(false); // added a state for isAuthenticated
  const[userName, setUserName] = useState('');
  const[cartItems, setCartItem] = useState([]); //Added a cart item state
  const[decodedToken, setDecodedToken] = useState(null);
  const[cartDetails, setCartDetails] = useState([]);
  const[orderId, setOrderId] = useState(null);
  const[showConfirmation, setShowConfirmation] = useState(false);

  const addToCart = async (product, quantity) => {
    const existingItem = cartItems.find(item => item.productId == product.id);
    let newCartItems;
    let updatedCartItem;
    if(existingItem) {
      newCartItems = cartItems.map(item => item.productId === product.id? {...item,qty: item.qty+1}:item);
      updatedCartItem = newCartItems.find(item => item.productId === product.id);
      setCartItem(newCartItems);
    } else {
      updatedCartItem =  {
        productId : product.id,
        name : product.name,
        price: product.price,
        qty: quantity

      };
      newCartItems = [...cartItems, updatedCartItem];
      setCartItem(newCartItems);
    }

    //Prepare the cart data  for the API call
    const cartItemDTO = {
      cartId: 0,
      id: 0,
      productId: updatedCartItem.productId,
      quantity: updatedCartItem.qty

    };

    if(!decodedToken) {
      console.error('Decoded token is not available');
      return;
    }

    //call the cartService to update the backend
    try {
      console.log('Sending cartItems to backend:', cartItemDTO);
      await CartService.saveCartItem(decodedToken, cartItemDTO);
      await fetchCartDetails(); //Add this line to update cart details
    } catch(error) {
      console.log('Error updating cart:', error);
    }
    };


    const fetchCartDetails = async () => {
      try {
        if(decodedToken) {
          const userId = Number(decodedToken);
          const cartItemsResponse = await fetch(`http://localhost:8082/carts/${userId}`);
          if(!cartItemsResponse) {
            throw new Error('Failed to fetch cart items');
          }
          const cartItems = await cartItemsResponse.json();
          const cartItemsWithDetails = await Promise.all(cartItems.map(async (item) => {
            const productResponse = await fetch(`http://localhost:8080/products/${item.productId}`);
            if(!productResponse) {
              throw new Error('Failed to fetch product details');
            }
            const productDetails = await productResponse.json();
            return {...item, name:productDetails.name, price: productDetails.price}

          }));

          setCartDetails(cartItemsWithDetails);
        }
      } catch(error) {
        console.error('Error fetching cart details:', error);
      }
    }

    
    useEffect(()=> {
        const token = localStorage.getItem('token');
        if(token) {
          const decodedToken = jwtDecode(token);
          console.log('token:', token)
          console.log('decodedToken:', decodedToken.sub);
          setDecodedToken(decodedToken.sub);
          setIsAuthenticated(true);
        }
        fetchCartDetails();
      },[decodedToken]);



     
      const handleLoginSuccess = (token,username) => {
      localStorage.setItem('token',token) // store the token in local storage
      const decodedToken = jwtDecode(token);
      console.log('token:', token)
      console.log('decodedToken:', decodedToken.sub);
      setDecodedToken(decodedToken.sub);
      setIsAuthenticated(true); //update the authenticated state
      setUserName(username);
    }

    const handleCheckout = async () => {
      const totalprice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
      const orderDetails = {
        id:0,
        status: "PENDING",
        totalPrice : totalprice,
        userId: Number(decodedToken),
      };
      console.log(orderDetails)
    

    try {
      const response = await OrderService.placeOrder(orderDetails);
      const data = await response.json();
      if(response.ok) {
        setOrderId(data.id);
        setShowConfirmation(true);
      } 
    
     } catch(error) {
     console.error('Error placing order', error);
        
  }
};

    const handleLogout = () => {
      localStorage.removeItem('token');//Remove the token from local storage
      setIsAuthenticated(false); // Update the authenticated state
      window.location.reload();
    }
    
 

  return (
    <Router>
      <Routes>
        <Route path='/' element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> :
         <Navigate to = "/dashboard" replace /> } />  
       
       <Route path="/dashboard" element = {isAuthenticated ? <MainLayout addToCart={addToCart} cartItems={cartDetails} onLogout={handleLogout} userName={decodedToken} onCheckout={handleCheckout} setCartItem={setCartItem}  /> :
        <Navigate to = '/' replace/>} />
        <Route path="/order-confirmation" element={<OrderConfirmation orderId={orderId}/>}/>
        <Route path="/orders/:orderId" element={<OrderDetails/>}/>
      </Routes>
    </Router>

  );

  }
  export default App;

