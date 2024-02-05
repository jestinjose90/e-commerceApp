import React from "react";
import "./Cart.css";


const Cart = ({cartItems , onCheckout})=> {
    console.log(cartItems);
    return (
        <div>
            <h2>Shopping Cart</h2>
            {cartItems.length == 0 ?(<div>Cart is empty</div>):(
                <div className="cart-container">
            {cartItems.map((item,index ) =>
                    (<div className="cart-item" key={index}>
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                    <p>Quantity:{item.quantity}</p>
                </div>
            ))}
            <button onClick={onCheckout} disabled={cartItems.length ==0} >checkout</button>
     </div>
            )}
     </div>
    );
};

export default Cart;