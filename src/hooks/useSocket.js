import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (username, room) => {
  const [socket, setSocket] = useState(null);

  
  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      withCredentials: true,
    });

    newSocket.emit("joinRoom", {  username,room }); // Join the specified room
    setSocket(newSocket);

    // Cleanup when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  return socket;
};

export default useSocket;
