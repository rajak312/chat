import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, type KeyboardEvent } from "react";
import { useSocket } from "../providers/SocketProvider";

interface ChatInputProps {
  roomId: string;
}

export default function ChatInput({ roomId }: ChatInputProps) {
  const { socket } = useSocket();
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim() || !socket) return;
    socket.emit("send_message", {
      roomId,
      ciphertext: text,
    });
    setText("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box display="flex" p={1} gap={1}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <IconButton color="primary" onClick={sendMessage}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
