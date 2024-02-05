import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import './ProductList.css';


const ProductList = ({addToCart}) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities , setQuantities] = useState({});

    useEffect(()=> {
        setIsLoading(true);
        fetch('http://localhost:8080/products') 
            .then(response =>
                {
                    if(response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                }) 
            .then(data => { setProducts(data);
                setIsLoading(false);
                const initialQuantities = {};
                data.forEach(product => {
                    initialQuantities[product.id] = 1; // initializa quantity for each product as 1
                });
                setQuantities(initialQuantities);
            })
                .catch(error => {
                    console.error('Fetch error:', error);
                    setError(error);
                    setIsLoading(false);
                });
    
    }, []);

    
   //handle the quantity change
   const handleQuantityChange = (productId, quantity) => {
    setQuantities({...quantities, [productId]: quantity});
   };

    if(error) {
        return <div>Error:{error.message}</div>;
    }

    if(isLoading) {
        return <div>Loading...</div>;
    }

    return (
            <div className="product-list-container">
                {products.map(product => (
                    <Card className="product-card" key={product.id}>
                        <Card.Body>
                            <Card.Title className='product-title'>{product.name}</Card.Title>
                            <Card.Text className='product-price'>${product.price}</Card.Text>
                            <Card.Text>{product.description}</Card.Text>

                            <Form.Control
                             type = "number"
                             value = {quantities[product.id]}
                             onChange = {e=> handleQuantityChange(product.id , parseInt(e.target.value))}
                             min = "1"
                             className = "quantity-selector" />

                            <Button className = "add-to-cart-btn" onClick={() => addToCart(product , quantities[product.id])}>Add To Cart</Button>
                            </Card.Body>
                            </Card>
                ))}
            </div>
    );  
};

export default ProductList;