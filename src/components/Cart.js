import React , {useState, useEffect} from "react";
import "./Cart.css";
import PaymentService from "../PaymentService";
import OrderService from "../OrderService";


const Cart = ({cartItems, setCartItem , userName })=> {
    const[checkoutStarted, setCheckoutStarted] = useState(false);
    const[paymentMethod, setPaymentMethod] = useState('COD'); // by default cash on delivery
    const[paymentStatus, setPaymentStatus] = useState({success: false, message: ''});
    const[orderStatus, setOrderStatus] = useState({message:''});
    const[orderedItems, setOrderedItems] = useState([]);

    const handleOrder = async () => {
        const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const orderDetails = {
            userId: userName,
            status: 'PENDING',
            totalPrice: totalPrice

        };

        try {
            const orderResponse = await OrderService.placeOrder(orderDetails);
            console.log(orderResponse.status);
            if(orderResponse.status == 'PENDING') {
                setOrderStatus({message:'order successfully placed'});
            }

            else {
                setOrderStatus({message:'order failed'});
            }
        } catch(error) {
            console.error('Error placing order:', error);
            setOrderStatus({message:'order failed'});

        }

    };


    const displayOrder = async ()=> {
        handleOrder();

        try  {
            if(userName) {
                const userId = Number(userName);
                const orderedItemsResponse = await fetch(`http://localhost:8084/orders/${userId}`);
                if(!orderedItemsResponse) {
                    throw new Error('Failed to fetch orderedItems');
                }
                const orders = await orderedItemsResponse.json();
                console.log('retrieved orderedItems', orders);

               let newOrder = {
                    userId: userName,
                    status: orders.status,
                    totalPrice: orders.totalPrice
                };

                console.log(newOrder);

                let displayOrderedItems = [...orderedItems,newOrder];
                setOrderedItems(displayOrderedItems);
                console.log(orderedItems);
            }
        } catch(error) {
            console.error('Error fetching order details', error);
        }
        
    };





   

    const handlePayOrder = async () => {
        const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    

        const orderDetails = {
            orderId: 1,
            userId: 1,
            amount : totalPrice,
            status: 'SUCCESS',
            paymentMethod: paymentMethod
        };
    

    try {
        const paymentResponse = await PaymentService.processPayment(orderDetails);
        console.log(paymentResponse);
        if(paymentResponse && paymentResponse.status == 'SUCCESS') {
           setCartItem([]);
            setPaymentStatus({success: true, message: 'Payment successfully added'});
            
        } else {
            setPaymentStatus({success:false , message: "Payment failed, please try again!"});

        } 
        }catch(error) {
            console.error('Error during payment:', error);
            setPaymentStatus({success:false , message: "Payment failed, please try again!"});
    }

    };

    return (
        <div>
            <h3>Shopping Cart</h3>
            {cartItems.length == 0 ?(<div>Cart is empty</div>):(
                <div className="cart-container">
            {cartItems.map((item,index ) =>
                    (<div className="cart-item" key={index}>
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                    <p>Quantity:{item.quantity}</p>
                   
                </div>
            ))}

           
            <button onClick={displayOrder}>Place Order</button>
           
                {orderedItems.map((item,index ) =>
                   (<div className= "hello" key={index}>
                      <h5>Order Summary</h5>
                      <p>{orderStatus.message}</p> 
                      <p>TotalPrice: ${item.totalPrice}</p>
                      
                    </div>    
             ))}

            {!checkoutStarted ? (
                <button onClick={() => setCheckoutStarted(true)} disabled={cartItems.length ==0}> checkout </button> 
            ): (
                <>
                 <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="COD">COD</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Paypal">Paypal</option>
                    <option value="Other">Other</option>
                </select>
                <button onClick={handlePayOrder}>Pay Order</button>

                {paymentStatus.message && (
                    <div className={`message ${paymentStatus.success ? 'success' : 'error'}`}>
                       {paymentStatus.message}
                    </div>
                )}
                
                </>
               

        
            )}
         </div>
            )}
     </div>
    );
};

export default Cart;