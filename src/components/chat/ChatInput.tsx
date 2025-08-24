import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

interface ChatInputProps {
  onSend?: (msg: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;
    setText("");
    onSend?.(text);
  };

  return (
    <Box
      display="flex"
      p={1}
      borderTop={1}
      borderColor="divider"
      bgcolor="background.paper"
    >
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        fullWidth
        size="small"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
