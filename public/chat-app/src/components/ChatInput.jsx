import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';

function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (message.length > 0) {
      handleSendMsg(message);
      setMessage('');
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <BsEmojiSmileFill />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #1e1e2f;
  border-top: 1px solid #2e2e3e;

  .button-container {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;

    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        cursor: pointer;
        color: #b8b8d1;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px; /* Adjust based on your requirement */
        background-color: #1e1e2f;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9186f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9186f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0.8);
            background-color: #2e2e3e;
          }
        }
        .emoji-search {
          background-color: transparent ;
          border-color: #9186f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    flex-grow: 1;
    input {
      flex-grow: 1;
      padding: 0.75rem;
      border: 1px solid #3e3e4e;
      border-radius: 4px;
      outline: none;
      background-color: #2e2e3e;
      color: #d1d1e0;

      &::selection {
        background-color: #9186f3;
      }
      &:focus {
        outline: none;
        border-color: #9186f3;
      }
    }
    button {
      padding: 0.75rem;
      background-color: #4e00ff;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;
      svg {
        font-size: 1.5rem;
      }
      &:hover {
        background-color: #3e00cc;
      }
    }
  }
`;

export default ChatInput;
