import React from "react";
import {Link} from "react-router-dom";

const OrderConfirmation = ({orderId}) => {
    return (
        <div>
            <h2>Order Placed Successfully!</h2>
            <p>your order is : {orderId}</p>
            <Link to={`orders/${orderId}`} > view Order Details</Link>

        </div>
    )
};

export default OrderConfirmation;