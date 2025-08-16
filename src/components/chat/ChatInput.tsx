import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

interface ChatInputProps {
  connection: string;
}

export default function ChatInput({ connection }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    console.log(`Send to ${connection}:`, text);
    setText("");
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
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
