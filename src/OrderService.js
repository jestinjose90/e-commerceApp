const OrderService = {
    placeOrder: async (orderDetails) => {
        console.log('before stringify JSON' , orderDetails); // orderDetails is an object called from App.js
        console.log('stringify JSON', JSON.stringify(orderDetails));

        try{
            const response = await fetch('http://localhost:8084/orders', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch(error) {
            console.log('Error placing order:', error);
        }
    },
};

export default OrderService;