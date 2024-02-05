//Registration.js
import React, { useState } from "react";

const Registration = () => {
    const[formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //API call to register the user 
        fetch('http://localhost:8081/users/register', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response=> {
            if(!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Success:", data);
            //Handle success, possibly redirect to login or dashboard
        })
        .catch((error)=> {
            console.error("Error",error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input type="text" name= "username" placeholder="Username" value={formData.username} onChange={handleChange}></input>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}></input>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}></input>
            <button type="submit">Register</button>

            
        </form>
    );
};

export default Registration;