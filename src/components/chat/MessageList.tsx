import { Box, Typography } from "@mui/material";

interface MessageListProps {
  connection: string;
}

const dummyMessages = [
  { id: 1, sender: "me", text: "Hello!" },
  { id: 2, sender: "alice", text: "Hi there!" },
  { id: 3, sender: "me", text: "How are you?" },
];

export default function MessageList({ connection }: MessageListProps) {
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
      {dummyMessages.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
            bgcolor: msg.sender === "me" ? "primary.main" : "grey.300",
            color: msg.sender === "me" ? "white" : "black",
            px: 2,
            py: 1,
            borderRadius: 2,
            maxWidth: "70%",
          }}
        >
          <Typography>{msg.text}</Typography>
        </Box>
      ))}
    </Box>
  );
}
