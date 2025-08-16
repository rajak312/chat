import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatLayout() {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      bgcolor="background.default"
    >
      {/* Sidebar */}
      {(!isMobile || !selectedConnection) && (
        <Sidebar
          selectedConnection={selectedConnection}
          onSelectConnection={setSelectedConnection}
        />
      )}

      {/* Chat Window */}
      {selectedConnection && (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          borderLeft={{ xs: 0, sm: 1 }}
          borderColor="divider"
          width={{ xs: "100%", sm: "auto" }}
        >
          {/* Mobile Header with back button */}
          {isMobile && (
            <Box
              display="flex"
              alignItems="center"
              p={1}
              borderBottom={1}
              borderColor="divider"
              bgcolor="background.paper"
            >
              <IconButton onClick={() => setSelectedConnection(null)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" ml={1}>
                {selectedConnection}
              </Typography>
            </Box>
          )}

          {/* Messages */}
          <MessageList connection={selectedConnection} />

          {/* Input */}
          <ChatInput connection={selectedConnection} />
        </Box>
      )}
    </Box>
  );
}
