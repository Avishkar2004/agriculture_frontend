import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import { FaTimes } from "react-icons/fa";

const Messages = ({ onClose, username, room }) => {
  const socket = useSocket(room);
  const [messages, setMessages] = useState([]); // State to hold all messages
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Listen for welcome messages
    socket.on("message", (data) => {
      console.log("Message received:", data); // Log to verify
      setMessages((prev) => {
        console.log("Updating messages:", [...prev, { text: data.text, sender: data.sender }]);
        return [...prev, { text: data.text, sender: data.sender }];
      });
    });
    // Listen for server broadcasts
    socket.on("server-message", (data) => {
      console.log("Server message received:", data); // Log to verify
      setMessages((prev) => {
        console.log("Updating messages:", [...prev, { text: data.text, sender: data.sender }]);
        return [...prev, { text: data.text, sender: data.sender }];
      });
    });
    return () => {
      // Clean up socket listeners on component unmount
      socket.off("message");
      socket.off("server-message");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    console.log("Joining room with:", { username, room });
    socket.emit("joinRoom", { username, room });
  }, [socket, username, room]);

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      const userMessage = { text: inputMessage, sender: username, room };
      setMessages((prev) => [...prev, userMessage]); // Display user message immediately
      socket.emit("chatMessage", userMessage); // Send to server
      setInputMessage(""); // Clear input
    }
  };

  return (
    <div className="fixed right-5 h-[calc(80vh-100px)] bg-white shadow-lg border border-gray-300 rounded-lg z-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-500 text-white flex justify-between items-center p-4 rounded-t-lg">
        <h2 className="font-semibold text-lg">Chat Room: {room}</h2>
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
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`px-4 py-2 rounded-lg ${msg.sender === username
                  ? "bg-blue-100 text-blue-800 self-end"
                  : "bg-gray-200 text-gray-800 self-start"
                  }`}
              >
                <strong>{msg.sender}: </strong>
                {msg.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input Field */}
      <div className="p-4 flex gap-2 border-t border-gray-200">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-grow px-4 py-2 border rounded-lg focus:ring focus:ring-green-200 outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;