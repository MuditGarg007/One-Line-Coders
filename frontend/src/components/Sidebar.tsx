import React, { useState } from 'react';
import '../styles/Sidebar.css';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
    };
    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="toggle-button" onClick={onToggle}>
          {isOpen ? '✕' : '≡'}
        </button>
        {isOpen && (
          <button className="new-chat-button" onClick={createNewChat}>
            New Chat
          </button>
        )}
      </div>

      {isOpen && (
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat === chat.id ? 'selected' : ''}`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <span className="chat-title">{chat.title}</span>
              <span className="chat-timestamp">
                {chat.timestamp.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;