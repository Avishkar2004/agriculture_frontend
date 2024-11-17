import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      withCredentials: true,
    });

    setSocket(newSocket);

    //Cleanup when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;