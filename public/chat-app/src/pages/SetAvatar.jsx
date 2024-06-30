import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { SetAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';

function SetAvatar() {
    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectAvatar, setSelectAvatar] = useState(undefined);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(()=> {
        if(!localStorage.getItem('chat-app-user')) {
          navigate('/login')
        }
      },[])

    const setProfilePicture = async () => {
        if (selectAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
            return;
        }
        const user = await JSON.parse(localStorage.getItem("chat-app-user"));
        const { data } = await axios.post(`${SetAvatarRoute}/${user._id}`, {
            image: avatars[selectAvatar],
        });

        if (data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem("chat-app-user", JSON.stringify(user));
            navigate("/");
        } else {
            toast.error("Error setting avatar. Please try again.", toastOptions);
        }
    };

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const data = [];
                for (let i = 0; i < 4; i++) {
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                    const buffer = Buffer.from(image.data);
                    data.push(buffer.toString('base64'));
                }
                setAvatars(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching avatars:', error);
                toast.error('Failed to load avatars', toastOptions);
            }
        };

        fetchAvatars();
    }, []);

    return (
        <>
            {isLoading ? (
                <Container>
                    <h1 className="loading">Loading...</h1>
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => (
                            <div
                                key={index}
                                className={`avatar ${selectAvatar === index ? 'selected' : ''}`}
                                onClick={() => setSelectAvatar(index)}
                            >
                                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
                            </div>
                        ))}
                    </div>
                    <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
                </Container>
            )}
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    height: 100vh;
    justify-content: center;
    background-color: #131324;

    .loading {
        color: white;
        font-size: 2rem; /* Adjust this value to make it larger or smaller */
    }

    .title-container {
        h1 {
            color: white;
        }
    }

    .avatars {
        display: flex;
        gap: 2rem;

        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;

            img {
                height: 6rem;
                transition: 0.5s ease-in-out;
            }

            &.selected {
                border: 0.4rem solid #4e0eff;
            }
        }
        
    }
    .submit-btn{
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
`;

export default SetAvatar;
