import { Box } from "@mui/material";
import { useMessages } from "../../api/query/messages";
import { Message } from "./Message";
import { useCrypto } from "../../providers/CryptoProvider";

interface MessageListProps {
  conversationId: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { deviceInfo } = useCrypto();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(
    conversationId,
    deviceInfo?.id || ""
  );

  const messages = data?.pages.flatMap((page) => page) ?? [];

  // load more when scrolled to top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse", // so latest stays at bottom
        gap: 1,
      }}
      onScroll={handleScroll}
    >
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </Box>
  );
}
