import React from 'react';
import styled from 'styled-components';

function Messages() {
  return (
    <Container>
      {/* Placeholder for chat messages */}
      <Message>
        <p>Hello, this is a test message!</p>
        <span>10:30 AM</span>
      </Message>
      <Message isOwnMessage>
        <p>Hi there! This is a reply.</p>
        <span>10:32 AM</span>
      </Message>
      {/* Add more messages as needed */}
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: white;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cccccc;
    border-radius: 1rem;
  }
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOwnMessage ? 'flex-end' : 'flex-start')};
  margin-bottom: 1rem;

  p {
    background-color: ${(props) => (props.isOwnMessage ? '#4e00ff' : '#f1f1f1')};
    color: ${(props) => (props.isOwnMessage ? 'white' : 'black')};
    padding: 0.75rem;
    border-radius: 8px;
    max-width: 60%;
    word-wrap: break-word;
  }

  span {
    font-size: 0.75rem;
    color: #999;
    margin-top: 0.5rem;
  }
`;

export default Messages;
