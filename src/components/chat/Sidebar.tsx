import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";

interface SidebarProps {
  selectedConnection: string | null;
  onSelectConnection: (username: string) => void;
}

const dummyConnections = [
  { username: "alice", online: true },
  { username: "bob", online: false },
  { username: "charlie", online: true },
];

export default function Sidebar({
  selectedConnection,
  onSelectConnection,
}: SidebarProps) {
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
        Connections
      </Typography>
      <List>
        {dummyConnections.map((user) => (
          <ListItemButton
            key={user.username}
            selected={selectedConnection === user.username}
            onClick={() => onSelectConnection(user.username)}
          >
            <Avatar sx={{ mr: 2, bgcolor: user.online ? "green" : "grey" }}>
              {user.username[0].toUpperCase()}
            </Avatar>
            <ListItemText primary={user.username} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
