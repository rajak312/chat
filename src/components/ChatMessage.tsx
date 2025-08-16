import { Box, Paper, Typography } from "@mui/material";
import type { Message } from "../types/chat";

interface ChatMessageProps {
  message: Message;
  isOwn?: boolean;
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <Box
      display="flex"
      justifyContent={isOwn ? "flex-end" : "flex-start"}
      my={0.5}
    >
      <Paper
        sx={{
          p: 1,
          maxWidth: "70%",
          bgcolor: isOwn ? "primary.main" : "grey.300",
          color: isOwn ? "white" : "black",
        }}
      >
        {!isOwn && (
          <Typography variant="subtitle2">{message.senderName}</Typography>
        )}
        <Typography>{message.ciphertext}</Typography>
      </Paper>
    </Box>
  );
}
