// src/components/ChatLayout.tsx
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Conversation, Device, SendMessageRequest } from "../../types";
import { useSocket } from "../../providers/SocketProvider";
import { useGetDevicesByUserId } from "../../api/query/devices";
import { useCurrentUser } from "../../api";
import Sidebar from "./Sidebar";
import { encryptHybrid } from "../../crypto";
import { useCrypto } from "../../providers/CryptoProvider";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { socket } = useSocket();
  const { data: currentUser } = useCurrentUser();
  const { deviceInfo } = useCrypto();

  const recipientId = selectedConversation?.participant?.id || "";
  const { data: recipientDevices } = useGetDevicesByUserId(recipientId);
  const { data: myDevices } = useGetDevicesByUserId(currentUser?.id || "");

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation || !socket || !deviceInfo) return;

    const targets: Device[] = [
      ...(recipientDevices || []),
      ...(myDevices || []),
    ];
    if (targets.length === 0) return;
    const map = new Map<string, Device>();
    targets.forEach((d) => map.set(d.id, d));
    const uniqueTargets = Array.from(map.values());

    try {
      const { ciphertext, iv, wrappedKeys } = await encryptHybrid(
        text,
        uniqueTargets
      );
      const payload: SendMessageRequest = {
        ciphertext,
        iv,
        wrappedKeys,
        id: selectedConversation.id,
        senderDeviceId: deviceInfo.id,
      };
      socket.emit("send_message", payload);
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
      {(!isMobile || !selectedConversation) && (
        <Sidebar
          selectedConnection={selectedConversation?.id}
          onSelectConnection={setSelectedConversation}
        />
      )}

      {selectedConversation && (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          borderLeft={{ xs: 0, sm: 1 }}
          borderColor="divider"
          width={{ xs: "100%", sm: "auto" }}
        >
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
