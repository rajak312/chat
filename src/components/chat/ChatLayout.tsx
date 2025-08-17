import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useGetUserDevices } from "../../api";
import type { Chat, Device } from "../../types";
import { useSocket } from "../../providers/SocketProvider";
import { useCrypto } from "../../providers/CryptoProvider";

export default function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { socket } = useSocket();
  const { encryptAndPrepareMessage } = useCrypto();
  const { data: devices } = useGetUserDevices(
    selectedChat?.participant.id || ""
  );

  const handleSendMessage = async (text: string) => {
    if (!selectedChat || !devices?.length || !socket) return;

    // Encrypt once per device and send
    const payloads = await Promise.all(
      devices.map(async (device: Device) => {
        const { ciphertext, iv, senderEphemeralPublic } =
          await encryptAndPrepareMessage(device.id, text);

        return {
          id: selectedChat.id,
          recipientUserId: selectedChat.participant.id,
          recipientDeviceId: device.id,
          ciphertext,
          iv,
          senderEphemeralPublic,
        };
      })
    );

    // Emit each payload individually
    console.log("Sending messag");
    payloads.forEach((payload) => socket.emit("send_message", payload));
  };

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      bgcolor="background.default"
    >
      {/* Sidebar */}
      {(!isMobile || !selectedChat) && (
        <Sidebar
          selectedConnection={selectedChat?.id}
          onSelectConnection={setSelectedChat}
        />
      )}

      {/* Chat Window */}
      {selectedChat && (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          borderLeft={{ xs: 0, sm: 1 }}
          borderColor="divider"
          width={{ xs: "100%", sm: "auto" }}
        >
          {/* Mobile Header */}
          {isMobile && (
            <Box
              display="flex"
              alignItems="center"
              p={1}
              borderBottom={1}
              borderColor="divider"
              bgcolor="background.paper"
            >
              <IconButton onClick={() => setSelectedChat(null)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" ml={1}>
                {selectedChat.id}
              </Typography>
            </Box>
          )}

          {/* Messages */}
          <MessageList chatId={selectedChat.id} devices={devices} />

          {/* Input */}
          <ChatInput
            connectionId={selectedChat.id}
            onSend={handleSendMessage}
          />
        </Box>
      )}
    </Box>
  );
}
