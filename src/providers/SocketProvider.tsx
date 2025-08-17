import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_CHAT_WS_URL || "http://localhost:5000", {
      transports: ["websocket"],
      // autoConnect: true,
      // withCredentials: true,
      auth: {
        session_id: document.cookie.replace(
          /(?:(?:^|.*;\s*)session_id\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        ),
      },
    });

    s.on("connect", () => {
      console.log("WebSocket connected", s.id);
    });

    s.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });
    s.on("connect_error", (err) => {
      console.error("Connect error:", err.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}
