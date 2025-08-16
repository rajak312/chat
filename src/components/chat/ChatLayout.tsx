import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatLayout() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      bgcolor="background.default"
    >
      {/* Sidebar */}
      {(!isMobile || !selectedChatId) && (
        <Sidebar
          selectedConnection={selectedChatId}
          onSelectConnection={setSelectedChatId}
        />
      )}

      {/* Chat Window */}
      {selectedChatId && (
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
              <IconButton onClick={() => setSelectedChatId(null)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" ml={1}>
                {selectedChatId}
              </Typography>
            </Box>
          )}

          {/* Messages */}
          <MessageList chatId={selectedChatId} />

          {/* Input */}
          <ChatInput connectionId={selectedChatId} />
        </Box>
      )}
    </Box>
  );
}
