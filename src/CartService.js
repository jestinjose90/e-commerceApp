const CartService = {
    saveCartItem: async (decodedToken , cartItem) => {
        console.log('before stringify JSON', cartItem);
        console.log('stringify JSON', JSON.stringify(cartItem));
        console.log('decodedToken--->', decodedToken);

        try {
            const userID = Number(decodedToken);
            const url = `http://localhost:8082/carts/${userID}/items`; // include userID in the URL
            console.log(url);
            const response  = await fetch(url, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
    
                },
                body: JSON.stringify(cartItem)
            });
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Item saved successfully', data);
        } catch(error) {
            console.error('There was an error saving the cart item', error);
        }
    }

};

export default CartService;