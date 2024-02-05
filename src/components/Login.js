//Login.js
import React, { useState } from "react";
import './styles.css';

const Login = ({onLoginSuccess}) => {
    const[formData, setFormData] = useState({
        email:'',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //API call to login the user
        fetch('http://localhost:8081/users/login', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(formData),
        })
        .then(response=> {
            if(!response.ok) {
                throw new Error('Login failed. Please check your credentials and try again');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:',data);
            console.log('Welcome',data.username);
            //Store the token in local storage or context
            localStorage.setItem('token',data.token);
            onLoginSuccess(data.token,data.username);
        })
        .catch((error) => {
            console.error('Error:',error);

        });
    };

    return(
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}required></input>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;