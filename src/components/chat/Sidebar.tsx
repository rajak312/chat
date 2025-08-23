import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { useGetConversations } from "../../api/query/conversation";
import type { Conversation } from "../../types";
import { useCurrentUser } from "../../api";

interface SidebarProps {
  selectedConnection?: string;
  onSelectConnection: (chat: Conversation) => void;
}

export default function Sidebar({
  selectedConnection,
  onSelectConnection,
}: SidebarProps) {
  const { data } = useGetConversations();
  const { data: user } = useCurrentUser();

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
        Chats : {user?.username}
      </Typography>
      <List>
        {data?.conversations?.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={selectedConnection === chat.id}
            onClick={() => onSelectConnection(chat)}
          >
            <Avatar
              sx={{
                mr: 2,
                bgcolor:
                  chat.type === "connection" && chat?.participant?.online
                    ? "green"
                    : "grey",
              }}
            >
              {chat.type === "connection"
                ? chat.participant?.username[0].toUpperCase()
                : chat.participant?.username[0].toUpperCase()}
            </Avatar>
            <ListItemText
              primary={
                chat.type === "connection"
                  ? chat.participant?.username
                  : chat.participant?.username
              }
              secondary={chat.lastMessage?.ciphertext || "No messages yet"}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
