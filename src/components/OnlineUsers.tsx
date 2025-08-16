import { Box, Typography, Paper } from "@mui/material";

interface OnlineUsersProps {
  users: string[];
}

export default function OnlineUsers({ users }: OnlineUsersProps) {
  return (
    <Paper sx={{ width: 200, p: 2 }}>
      <Typography variant="h6" mb={1}>
        Online Users
      </Typography>
      {users.map((u) => (
        <Typography key={u}>{u}</Typography>
      ))}
    </Paper>
  );
}
