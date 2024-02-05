import React, {useState, useEffect} from "react";

const OrderDetails = ({orderId}) => {
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8084/orders/${orderId}`)
        .then(response => response.json())
        .then(data => setOrderDetails(data))
        .catch(error => console.error('Error fetching order details', error));
    },{orderId}); //orderId at end indicated the effect in useeffect depends on orderID , whenever its value changed it afffects this hook}

    if(!orderDetails) {
        return <div>Loading order details</div>
    }

    return (
        <div>
            <h2>OrderDetails</h2>
            <p>Order ID: {orderDetails.id}</p>
            <p>Order Status: {orderDetails.status}</p>
            <p>Total Price: ${orderDetails.totalPrice}</p>
        </div>
    );
};

export default OrderDetails;