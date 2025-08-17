import { Box } from "@mui/material";
import { useMessages } from "../../api/query/messages";
import type { Message as ChatMessage, Device } from "../../types";
import { Message } from "./Message";
import { useCrypto } from "../../providers/CryptoProvider";

interface MessageListProps {
  chatId: string;
  devices?: Device[];
}

export default function MessageList({ chatId, devices }: MessageListProps) {
  const { deviceId } = useCrypto();
  const { data: messages } = useMessages(chatId, deviceId);

  console.log("Deviceid", deviceId);

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
        <Message message={msg} devices={devices} />
      ))}
    </Box>
  );
}
