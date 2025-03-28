import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { SetAvatarRoute } from '../utils/APIRoutes';

function SetAvatar() {
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

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    }
  }, [navigate]);

  // Generate letter avatars
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('chat-app-user'));
    const username = user.username || 'U'; // Fallback to 'U' if no username
    const firstLetter = username.charAt(0).toUpperCase();

    // Colors for avatar backgrounds (you can customize these)
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F5'];

    // Generate 4 avatars with different colors
    const generatedAvatars = Array.from({ length: 4 }, (_, i) => ({
      letter: firstLetter,
      color: colors[i % colors.length],
    }));

    setAvatars(generatedAvatars);
    setIsLoading(false);
  }, []);

  const setProfilePicture = async () => {
    if (selectAvatar === undefined) {
      toast.error('Please select an avatar', toastOptions);
      return;
    }

    const user = JSON.parse(localStorage.getItem('chat-app-user'));
    const selectedAvatar = avatars[selectAvatar];

    // Convert the selected avatar to a base64 image (simplified)
    const avatarData = {
      letter: selectedAvatar.letter,
      color: selectedAvatar.color,
    };

    const { data } = await axios.post(`${SetAvatarRoute}/${user._id}`, {
      image: JSON.stringify(avatarData), // Store as string
    });

    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem('chat-app-user', JSON.stringify(user));
      navigate('/');
    } else {
      toast.error('Error setting avatar. Please try again.', toastOptions);
    }
  };

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
                style={{ backgroundColor: avatar.color }}
              >
                <span className="avatar-letter">{avatar.letter}</span>
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
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
    font-size: 2rem;
  }

  .title-container h1 {
    color: white;
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      width: 6rem;
      height: 6rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3rem;
      font-weight: bold;
      color: white;
      cursor: pointer;
      transition: 0.3s ease-in-out;
      border: 0.4rem solid transparent;

      &.selected {
        border: 0.4rem solid #4e0eff;
      }
    }
  }

  .submit-btn {
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