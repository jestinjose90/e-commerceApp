const PaymentService = {
    processPayment: async (OrderDetails) => {
        console.log(OrderDetails);
        try {

            const response = await fetch('http://localhost:8085/payment/process',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                } ,
                body: JSON.stringify(OrderDetails),
            });

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
          

        } catch(error) {
            console.error('Error processing payment:', error);
            throw error; // rethrowing the error for the caller to handle
        }
    },
};

export default PaymentService;