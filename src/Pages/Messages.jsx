import React, { useState, useEffect, useRef } from "react";
import useSocket from "../hooks/useSocket";
import { FaTimes } from "react-icons/fa";

const Messages = ({ onClose, username, room }) => {
  const socket = useSocket(room);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([])
  const messagesEndRef = useRef(null)

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (!socket) return;

    // Listen for general chat messages
    socket.on("message", (data) => {
      setMessages((prev) => [
        ...prev,
        { text: data.text, sender: data.sender, timestamp: data.timestamp, system: false },
      ]);
    });

    // Listen for server messages like "user has joined"
    socket.on("server-message", (data) => {
      setMessages((prev) => [
        ...prev,
        { text: data.text, sender: "System", timestamp: data.timestamp, system: true }, // Mark as system message
      ]);
    });

    // Listen for typing events
    socket.on("typing", (user) => {
      if (user !== username && !typingUsers.includes(user)) {
        setTypingUsers((prev) => [...prev, user])
      }
    })
    socket.on("stop-typing", (user) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user))
    })

    return () => {
      // Clean up socket listeners on component unmount
      socket.off("message");
      socket.off("server-message");
      socket.off("typing")
      socket.off("stop-typing")
    };
  }, [socket, typingUsers, username]);

  useEffect(() => {
    if (!socket || !username || !room) return;
    socket.emit("joinRoom", { username, room });
  }, [socket, username, room]);

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      const userMessage = {
        text: inputMessage,
        sender: username,
        room,
        timestamp: new Date().toLocaleTimeString(),
        system: false
      };
      setMessages((prev) => [...prev, userMessage]);
      socket.emit("chatMessage", userMessage);
      setInputMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div className="fixed right-5 h-[calc(80vh-100px)] bg-white shadow-2xl rounded-lg z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white flex justify-between items-center p-4 rounded-t-lg shadow-md">
        <h2 className="font-semibold text-xl">Chat Room: {room}</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition"
          aria-label="Close Chat"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`px-4 py-3 rounded-lg transition-all ${msg.system
                  ? "bg-gray-300 text-gray-600 italic self-center" // Style for system messages
                  : msg.sender === username
                    ? "bg-blue-100 text-blue-800 self-end shadow-md"
                    : "bg-gray-200 text-gray-800 self-start shadow-sm"
                  }`}
              >
                {!msg.system && (
                  <div className="text-sm text-gray-500 mb-1">
                    <strong>{msg.sender}</strong> • {msg.timestamp}
                  </div>
                )}
                <p>{msg.text}</p>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        )}
      </div>

      {/* Input Field */}
      <div className="p-4 flex gap-4 border-t border-gray-200">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
