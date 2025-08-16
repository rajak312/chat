import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { useSendMessage } from "../../api/query/messages";
import type { Message } from "../../types";

interface ChatInputProps {
  connectionId: string;
  onSend?: (msg: Message) => void;
}

export default function ChatInput({ connectionId, onSend }: ChatInputProps) {
  const [text, setText] = useState("");
  const { mutateAsync } = useSendMessage();

  const handleSend = async () => {
    if (!text.trim()) return;

    const newMessage = await mutateAsync({
      roomId: undefined,
      connectionId,
      ciphertext: text,
    });

    setText("");
    onSend?.(newMessage);
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
