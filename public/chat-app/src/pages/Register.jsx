import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css"; // Ensure the correct path is used
import { registerRoute } from '../utils/APIRoutes';

function Register() {

    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
      if (localStorage.getItem('chat-app-user')) {
        navigate('/');
      }
    }, [navigate]); // Fixed dependency array
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!handleValidation()) return;
    
      try {
        const { password, username, email } = values;
        console.log('Attempting registration with:', { username, email });
        
        const response = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
        
        const { data } = response;
        console.log('Registration response:', data);
    
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
          return;
        }
    
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        toast.success("Registration successful!", toastOptions);
        navigate("/");
      } catch (error) {
        console.error('Registration error details:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.msg || "Registration failed. Please try again.";
        toast.error(errorMessage, toastOptions);
      }
    };
  

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;

        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password should be the same.", toastOptions);
            return false;
        } else if (username.length <= 3) {
            toast.error("Username should be greater than 3 characters", toastOptions);
            return false;
        } else if (password.length < 8) {
            toast.error("Password should be equal or greater than 8 characters", toastOptions);
            return false;
        } else if (email === "") {
            toast.error("Email is required", toastOptions);
            return false;
        }
        return true;
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

return (
        <>
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>Snappy</h1>
                    </div>
                    <input 
                        type="text" 
                        placeholder='Username' 
                        name='username'
                        value={values.username}
                        onChange={handleChange}
                    />
                    <input 
                        type="email" 
                        placeholder='Email' 
                        name='email'
                        value={values.email}
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        placeholder='Password' 
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        placeholder='Confirm Password' 
                        name='confirmPassword'
                        value={values.confirmPassword}
                        onChange={handleChange}
                    />
                    <button type='submit'>Create User</button>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
 
  };

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;

    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;  // Fixed typo here
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }

    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }

    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Register;
