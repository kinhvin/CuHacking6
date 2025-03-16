import React, { useState, useEffect, useRef } from 'react';
import './messages.css';
import { Link } from 'react-router-dom';

// Define interfaces for TypeScript
interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isOwnMessage: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Messages = () => {
  const [activeContact, setActiveContact] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'John Doe',
      content: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 3600000),
      isOwnMessage: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'I\'m good, thanks!',
      timestamp: new Date(Date.now() - 1800000),
      isOwnMessage: true
    }
  ]);
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'John Doe',
      avatar: '',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '2:30 PM',
      unreadCount: 0
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: '',
      lastMessage: 'See you tomorrow!',
      lastMessageTime: '11:20 AM',
      unreadCount: 3
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: '',
      lastMessage: 'Thanks for the playlist!',
      lastMessageTime: 'Yesterday',
      unreadCount: 0
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'You',
      content: messageText,
      timestamp: new Date(),
      isOwnMessage: true
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="messages-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <button className="new-message-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
            </svg>
          </button>
        </div>
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search messages" 
          />
        </div>
        <div className="contacts-list">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className={`contact-item ${activeContact === contact.id ? 'active' : ''}`}
              onClick={() => setActiveContact(contact.id)}
            >
              <div className="contact-avatar">
                {contact.avatar || contact.name.charAt(0)}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="last-message">{contact.lastMessage}</div>
              </div>
              <div className="contact-meta">
                <div className="last-message-time">{contact.lastMessageTime}</div>
                {contact.unreadCount > 0 && (
                  <div className="unread-count">{contact.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="messages-nav">
          <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
      </div>

      <div className="chat-container">
        {activeContact ? (
          <>
            <div className="chat-header">
              <div className="contact-avatar">
                {contacts.find(c => c.id === activeContact)?.name.charAt(0)}
              </div>
              <div className="contact-name">
                {contacts.find(c => c.id === activeContact)?.name}
              </div>
              <div className="chat-actions">
                <button className="action-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
                  </svg>
                </button>
                <button className="action-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
                  </svg>
                </button>
                <button className="action-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="messages-list">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`message ${message.isOwnMessage ? 'own-message' : 'other-message'}`}
                >
                  {!message.isOwnMessage && (
                    <div className="message-sender">{message.sender}</div>
                  )}
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form className="message-input-container" onSubmit={handleSendMessage}>
              <button type="button" className="attachment-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                </svg>
              </button>
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" className="send-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
            </div>
            <h3>Select a conversation</h3>
            <p>Choose a contact from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;