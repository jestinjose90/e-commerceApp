//src/components/MainLayout.js
import React, {useState} from 'react';
import './MainLayout.css';
import ProductList from './ProductList';
import Cart from './Cart';
import OrderService from '../OrderService';


const MainLayout = ({addToCart,cartItems,onLogout,userName}) => {
    const [orderPlaced, setOrderPlaced] = useState(false);
    console.log('cartItems are:', cartItems);

    const onCheckout = async () => {
        console.log()
        const totalPrice = cartItems.reduce((acc, item)=> acc + item.price * item.quantity,0);
            // Construct orderDetails object
            const orderDetails = {
                // Add other necessary order details like userId
                userId: userName,
                status: 'PENDING',
                totalPrice: totalPrice
            };
    
            // Call OrderService to place the order
            try {
                const response = await OrderService.placeOrder(orderDetails);
                if (response) {
                    setOrderPlaced(true); // Set orderPlaced to true if order is successful
                }
            } catch (error) {
                console.error('Error placing order:', error);
            }
        };
    


    return (
        <div className="App">
            <div className="header">
                <h1>E-cart</h1>
            </div>
            <button onClick={onLogout}>Logout</button> {/* Logout button */}
            <div className="welcome-message">
                {userName && <h2>Welcome, {userName}</h2>}
            </div>
            <div className="main-container">
                <div className="product-list-container">
                    <ProductList addToCart={addToCart} /> {/* Use the ProductList component */}
                </div>

                <div className="cart-container">
                    <Cart cartItems={cartItems} onCheckout={onCheckout} /> {/* Use the Cart component */}
                    {orderPlaced && (
                        <div>
                            <p>Order placed successfully!</p>
                            <a href="/orders">View Orders</a>
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;