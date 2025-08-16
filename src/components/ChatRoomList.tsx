import { Box, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { type Room } from "../types/chat";

interface ChatRoomListProps {
  rooms: Room[];
  selectedRoom: string | null;
  onSelectRoom: (roomId: string) => void;
}

export default function ChatRoomList({
  rooms,
  selectedRoom,
  onSelectRoom,
}: ChatRoomListProps) {
  return (
    <Paper sx={{ width: 200, p: 1 }}>
      <List>
        {rooms.map((room) => (
          <ListItemButton
            key={room.id}
            selected={selectedRoom === room.id}
            onClick={() => onSelectRoom(room.id)}
          >
            <ListItemText primary={room.name} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
