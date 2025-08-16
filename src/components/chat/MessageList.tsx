import { Box, Typography } from "@mui/material";
import { useMessages } from "../../api/query/messages";
import type { Message as ChatMessage } from "../../types";

interface MessageListProps {
  chatId: string; // either roomId or connectionId
}

export default function MessageList({ chatId }: MessageListProps) {
  const { data: messages } = useMessages(chatId);

  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {messages?.map((msg: ChatMessage) => (
        <Box
          key={msg.id}
          sx={{
            alignSelf: msg.sender.id === "me" ? "flex-end" : "flex-start",
            bgcolor: msg.sender.id === "me" ? "primary.main" : "grey.300",
            color: msg.sender.id === "me" ? "white" : "black",
            px: 2,
            py: 1,
            borderRadius: 2,
            maxWidth: "70%",
            wordBreak: "break-word",
          }}
        >
          <Typography>{msg.ciphertext}</Typography>
        </Box>
      ))}
    </Box>
  );
}
