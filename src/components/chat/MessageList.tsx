import { Box } from "@mui/material";
import { useMessages } from "../../api/query/messages";
import type { Message as ChatMessage, Device } from "../../types";
import { Message } from "./Message";
import { useCrypto } from "../../providers/CryptoProvider";

interface MessageListProps {
  conversationId: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { deviceInfo } = useCrypto();
  const { data: messages } = useMessages(conversationId, deviceInfo?.id || "");

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
        <Message message={msg} />
      ))}
    </Box>
  );
}
