import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';

function Contacts({ contacts, currentUser , changeChat}) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
      
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact)
        // Handle chat change
    };

    return (
        <>
            {currentUserImage && currentUserName && (
                <Container>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h3>Snappy</h3>
                    </div>
                    <div className="contacts">
                        {contacts.map((contact, index) => (
                            <div
                                className={`contact ${index === currentSelected ? "selected" : ""}`}
                                key={index}
                                onClick={() => changeCurrentChat(index, contact)}
                            >
                                <div className="avatar">
                                    <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                </div>
                                <div className="username">
                                    <h3>{contact.username}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                        </div>
                        <div className="username">
                            <h2>{currentUserName}</h2>
                        </div>
                    </div>
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 85vh;
    background-color: #080420;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        img {
            height: 2rem;
        }

        h3 {
            color: white;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 0.1rem;
        }
    }

    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        padding: 1rem 0;
        overflow-y: auto;
        flex-grow: 1;
        width: 100%;
        
        &::-webkit-scrollbar {
            width: 0.2rem;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }

        .contact {
            background-color: rgba(255, 255, 255, 0.1);
            min-height: 5rem;
            cursor: pointer;
            width: 90%;
            border-radius: 0.5rem;
            padding: 0.5rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: background-color 0.3s ease-in-out;

            &:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .avatar {
                img {
                    height: 3rem;
                    border-radius: 50%;
                }
            }

            .username {
                h3 {
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 500;
                }
            }

            &.selected {
                background-color: #9186f3;
            }
        }
    }

    .current-user {
        background-color: #0d0d30;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);

        .avatar {
            img {
                height: 4rem;
                max-inline-size: 100%;
                border-radius: 50%;
            }
        }

        .username {
            h2 {
                color: white;
                font-size: 1.5rem;
                font-weight: 700;
            }
        }

        @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 1rem;

            .username {
                h2 {
                    font-size: 1.2rem;
                }
            }
        }
    }
`;

export default Contacts;