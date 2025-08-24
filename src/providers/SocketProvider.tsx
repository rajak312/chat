import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useCrypto } from "./CryptoProvider";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { deviceInfo } = useCrypto();

  useEffect(() => {
    if (!deviceInfo) return;

    const s = io(import.meta.env.VITE_CHAT_WS_URL || "http://localhost:5000", {
      transports: ["websocket"],
      auth: {
        session_id: document.cookie.replace(
          /(?:(?:^|.*;\s*)session_id\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        ),
        device_id: deviceInfo.id,
      },
    });

    s.on("connect", () => {
      console.log("✅ WebSocket connected", s.id);
      setIsConnected(true);

      if (deviceInfo?.id) {
        s.emit("register_device", { deviceId: deviceInfo.id });
        console.log("✅ Device connected", deviceInfo.id);
      }
    });

    s.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
      setIsConnected(false);
    });

    s.on("connect_error", (err) => {
      console.error("⚠️ Connect error:", err.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setIsConnected(false);
    };
  }, [deviceInfo]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}
