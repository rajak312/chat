import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Conversation, Device } from "../../types";
import { useSocket } from "../../providers/SocketProvider";
import { useCrypto } from "../../providers/CryptoProvider";
import { useGetConversationsById } from "../../api/query/conversation";
import { useGetDevicesByUserId } from "../../api/query/devices";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { socket } = useSocket();
  const { data: devices } = useGetDevicesByUserId(
    selectedConversation?.participant?.id || ""
  );
  const { encryptWithServer, deviceInfo } = useCrypto();

  const handleSendMessage = async (text: string) => {
    console.log("Sending message", text, devices, socket, selectedConversation);
    if (!selectedConversation || !devices?.length || !socket) return;

    try {
      const payloads = await Promise.all(
        devices.map(async (device: Device) => {
          const ciphertext = await encryptWithServer(device.publicKey, text);

          return {
            id: selectedConversation.id,
            recipientUserId: selectedConversation.participant?.id,
            recipientDeviceId: device.id,
            senderDeviceId: deviceInfo?.id,
            ciphertext,
          };
        })
      );

      console.log("Encrypted payloads:", payloads);
      payloads.forEach((payload) => socket.emit("send_message", payload));
    } catch (err) {
      console.error("Failed to send encrypted message", err);
    }
  };

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      bgcolor="background.default"
    >
      {/* Sidebar */}
      {(!isMobile || !selectedConversation) && (
        <Sidebar
          selectedConnection={selectedConversation?.id}
          onSelectConnection={setSelectedConversation}
        />
      )}

      {/* Chat Window */}
      {selectedConversation && (
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
              <IconButton onClick={() => setSelectedConversation(null)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" ml={1}>
                {selectedConversation.participant?.username ||
                  selectedConversation.id}
              </Typography>
            </Box>
          )}

          <MessageList conversationId={selectedConversation.id} />

          <ChatInput
            connectionId={selectedConversation.id}
            onSend={handleSendMessage}
          />
        </Box>
      )}
    </Box>
  );
}
