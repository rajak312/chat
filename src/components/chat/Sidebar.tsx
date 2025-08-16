import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { useChats } from "../../api/query/chats";

interface SidebarProps {
  selectedConnection: string | null;
  onSelectConnection: (id: string) => void;
}

export default function Sidebar({
  selectedConnection,
  onSelectConnection,
}: SidebarProps) {
  const { data } = useChats();

  return (
    <Box
      width={{ xs: "100%", sm: 300 }}
      borderRight={{ xs: 0, sm: 1 }}
      borderColor="divider"
      bgcolor="background.paper"
      overflow="auto"
      flexShrink={0}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
      >
        Chats
      </Typography>
      <List>
        {data?.chats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={selectedConnection === chat.id}
            onClick={() => onSelectConnection(chat.id)}
          >
            <Avatar
              sx={{
                mr: 2,
                bgcolor:
                  chat.type === "connection" && chat.participant.online
                    ? "green"
                    : "grey",
              }}
            >
              {chat.type === "connection"
                ? chat.participant.username[0].toUpperCase()
                : chat.name[0].toUpperCase()}
            </Avatar>
            <ListItemText
              primary={
                chat.type === "connection"
                  ? chat.participant.username
                  : chat.name
              }
              secondary={chat.lastMessage?.ciphertext || "No messages yet"}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
