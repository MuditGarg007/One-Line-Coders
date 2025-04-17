import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Chat.css";
import NavBar from "../components/NavBar";
import ThreeScene from "../components/ThreeScene";
import Sidebar from "../components/Sidebar";

interface Message {
  id: string;
  content: string;
  type: "User" | "Assistant";
  isTyping?: boolean;
}

const API_URL = "https://nexflow-backend-mbuwxza9m-mudit-gargs-projects-e5653927.vercel.app/process";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initialMessageProcessed = useRef(false);
  const location = useLocation();

  const handleNewMessage = useCallback(async (messageText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: messageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      await simulateTyping(
        data.final_response ||
          "I apologize, but I'm currently unable to process your request."
      );
    } catch (error) {
      console.error("API Error:", error);
      await simulateTyping(
        "I apologize, but I'm currently unable to process your request."
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed as it only uses external functions and stable state setters

  // Process initial message from navigation if it exists
  useEffect(() => {
    const state = location.state as { initialMessage?: string } | null;
    if (state?.initialMessage && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true;
      const initialUserMessage: Message = {
        id: Date.now().toString(),
        type: "User",
        content: state.initialMessage,
      };
      setMessages([initialUserMessage]);
      handleNewMessage(state.initialMessage);
    }
  }, [location.state, handleNewMessage]); // Added missing dependencies

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (content: string) => {
    const newMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: newMessageId, type: "Assistant", content: "", isTyping: true },
    ]);

    let displayedContent = "";
    for (let i = 0; i < content.length; i++) {
      const currentContent = displayedContent + content[i];
      displayedContent = currentContent;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId ? { ...msg, content: currentContent } : msg
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === newMessageId ? { ...msg, isTyping: false } : msg
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "User",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      await simulateTyping(
        data.final_response ||
          "I apologize, but I'm currently unable to process your request."
      );
    } catch (error) {
      console.error("API Error:", error);
      await simulateTyping(
        "I apologize, but I'm currently unable to process your request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <ThreeScene />

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <NavBar
        isSidebarOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`chat-interface ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="chat-header">
          <h1>
            <span className="nex">Nex</span>
            <span className="flow">Flow</span>
            <span className="assistant"> Assistant</span>
          </h1>
        </div>

        <div className="messages-container" ref={chatContainerRef}>
          {messages.map((message) => (
            <div key={message.id} className={`message-wrapper ${message.type}`}>
              <div className={`message-bubble ${message.type}-bubble`}>
                <span className="message-type">{message.type}:</span>
                <div className={`message-content ${message.type}-content`}>
                  {message.content}
                  {message.isTyping && (
                    <span className="typing-indicator">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            {isLoading ? (
              <span className="loading-indicator">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "Send →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
