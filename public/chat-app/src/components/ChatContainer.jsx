import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import { v4 as uuidv4 } from 'uuid';

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat && currentUser) {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf:true , message : msg});
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      const handleMessageReceive = (msg) => {
        console.log({msg});
        setArrivalMessage({ fromSelf: false, message: msg });
      };

      socket.current.on("msg-recieve", handleMessageReceive);
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {currentChat && (
         <Container>
         <div className="chat-header">
           <div className="user-details">
             <div className="avatar">
               <img
                 src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                 alt=""
               />
             </div>
             <div className="username">
               <h3>{currentChat.username}</h3>
             </div>
           </div>
           <Logout />
         </div>
         <div className="chat-messages">
           {messages.map((message) => {
             return (
               <div ref={scrollRef} key={uuidv4()}>
                 <div
                   className={`message ${
                     message.fromSelf ? "sended" : "recieved"
                   }`}
                 >
                   <div className="content ">
                     <p>{message.message}</p>
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
         <ChatInput handleSendMsg={handleSendMsg} />
       </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1e1e2f; /* Dark background color */
  border-radius: 8px;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #4e00ff; /* Header background color */
    color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
        }
      }

      .username {
        h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
        }
      }
    }
  }

  .chat-messages {
    flex: 1;
    padding: 1rem;
    background-color: #080420; /* Dark background color */
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #2e2e3e; /* Scrollbar color */
      border-radius: 1rem;
    }

    .message {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      .content {
        max-width: 60%;
        background-color: #2e2e3e; /* Message background color */
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        color: #d1d1e0; /* Message text color */
      }

      &.sended {
        justify-content: flex-end;

        .content {
          background-color: #4f04ff21; /* Sent message background color with opacity */
          color: white;
        }
      }

      &.received {
        justify-content: flex-start;
      }
    }
  }

  .chat-input {
    padding: 1rem;
    background-color: #2e2e3e; /* Input area background color */
    border-top: 1px solid #3e3e4e; /* Top border color */
  }
`;

export default ChatContainer;
