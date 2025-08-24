import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Conversation, Device } from "../../types";
import { useSocket } from "../../providers/SocketProvider";
import { useGetDevicesByUserId } from "../../api/query/devices";
import { useCurrentUser, useMessages } from "../../api";
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

  // expose cache helpers from your hook
  const { addMessage, updateMessageStatus } = useMessages(
    selectedConversation?.id,
    deviceInfo?.id
  );

  useEffect(() => {
    if (!socket) return;

    // ✅ sender confirm: temp -> sent
    const handleMessageCreated = (payload: {
      messageId: string;
      tempId?: string;
    }) => {
      if (payload.tempId) {
        updateMessageStatus(payload.tempId, payload.messageId);
      }
    };

    // ✅ receiver: new incoming message or update -> received
    const handleReceiveMessage = (payload: any) => {
      console.log("Revieve Message", payload);
      addMessage({
        ...payload,
        status: "received",
      });
    };

    socket.on("message_created", handleMessageCreated);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("message_created", handleMessageCreated);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, updateMessageStatus, addMessage]);

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation || !socket || !deviceInfo) return;

    const targets: Device[] = [
      ...(recipientDevices || []),
      ...(myDevices || []),
    ];
    if (targets.length === 0) return;

    const uniqueTargets = Array.from(
      new Map(targets.map((d) => [d.id, d])).values()
    );

    try {
      const { ciphertext, iv, wrappedKeys } = await encryptHybrid(
        text,
        uniqueTargets
      );

      const tempId = "temp-" + Date.now();

      // optimistic insert → pending
      addMessage({
        id: tempId,
        ciphertext,
        iv,
        wrappedKeys,
        senderId: currentUser?.id || "",
        senderDeviceId: deviceInfo.id,
        sender: {
          id: currentUser?.id || "",
          username: currentUser?.username || "me",
        },
        createdAt: new Date().toISOString(),
        seenBy: [],
        status: "pending",
      } as any);

      socket.emit("send_message", {
        ciphertext,
        iv,
        wrappedKeys,
        id: selectedConversation.id,
        senderDeviceId: deviceInfo.id,
        tempId,
      });
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
          <ChatInput onSend={handleSendMessage} />
        </Box>
      )}
    </Box>
  );
}
