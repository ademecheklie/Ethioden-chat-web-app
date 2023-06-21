import React from 'react';
import '../styles/chatList.css';
import '../components/chatTextField';
import '../components/activeMessageScreen';
import ChatSend from '../components/chatTextField';
import { ChatListContainer } from '../components/activeMessageScreen';
import { useState, useEffect } from 'react';
import { currentUser } from '../model/currentUserData';
import { v4 as uuid } from 'uuid';
import axiosConfig from '../config/axiosConfig';
import { StatusPopUp } from './StatusPopUp';

export function ChatUI(props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editedMessage, setEditedMessage] = useState(null);

  useEffect(() => {
    setMessages([]);
  }, [props.user]);

  const onMessageAdd = (message) => {
    const messageUUID = uuid();

    const newMessage = {
      messageId: messageUUID,
      text: message,
      reciverId: props.user,
      senderId: currentUser.userId,
      created_at: new Date(),
    };

    axiosConfig
      .post('/chat/', {
        text: message,
        inRoom: 0,
        roomId: null,
        reciverId: props.user,
        senderId: currentUser.userId,
      })
      .then((response) => {
        console.log(response.data);
       setMessages([...props.messages, newMessage]);
      })
      .catch((error) => {
        throw error;
      });
  };

  const onUpdateMessage = (messageID, updatedText) => {
    const body = {
      text: updatedText,
    };

    axiosConfig
      .patch(`/chat/${messageID}`, body)
      .then((response) => {
        console.log('Chat updated successfully:', response.data);
        const updatedMessages = messages.map((msg) => {
          if (msg.messageId === messageID) {
            return { ...msg, text: updatedText };
          }
          return msg;
        });
        setMessages(updatedMessages);
      })
      .catch((error) => {
        console.log('Error updating chat:', error);
      });
  };

  const onMessageSend = () => {
    if (message.trim() !== '') {
      if (editedMessage) {
        // Update existing message
        onUpdateMessage(editedMessage.messageID, message);
        setEditedMessage(null);
      } else {
        // Add new message
        onMessageAdd(message);
      }

      setMessage('');
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const onkeyPressHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onMessageSend();
    }
  };

  const handleEdit = (messageID, message) => {
    setEditedMessage({ messageID, message });
    setMessage(message); // Set the edited message as the initial value
  };

  return (
    <div className='ChatRoom'>
      <div className='profileNav'>
        {props.user.profileImg ? (
          <img alt='user profile' className='chatProfile' src={props.user.profileImg} />
        ) : (
          <img
            alt='user profile'
            className='chatProfile'
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBrq9rrEZy6VUsQmoeIPh6gYzS_2JqKe1i9A&usqp=CAU'
          />
        )}
        <p className='profilename'>{props.username}</p>
        <div className='recentSentAt1'>lastseen recently</div>
        <div className='setstatus'>
          <StatusPopUp />
        </div>
      </div>
      <ChatListContainer onEdit={handleEdit} messages={messages.length === 0 ? props.messages : messages} />
      <div>
        <div className='chatInputDiv'>
          <ChatSend onClick={onMessageSend} />
          <input
            type='text'
            className='chatInputField'
            value={message}
            placeholder='Type something here ...'
            onChange={handleInputChange}
            onKeyDown={onkeyPressHandler}
          />
        </div>
      </div>
    </div>
  );
}
