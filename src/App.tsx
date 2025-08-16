import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useSocket } from "./providers/SocketProvider";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import OnlineUsers from "./components/OnlineUsers";
import ChatRoomList from "./components/ChatRoomList";
import type { Message, Room } from "./types/chat";
import ChatLayout from "./components/chat/ChatLayout";

export default function Chat() {
  return <ChatLayout />;
}
