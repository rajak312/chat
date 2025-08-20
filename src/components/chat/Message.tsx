import { Box, Typography } from "@mui/material";
import { useCrypto } from "../../providers/CryptoProvider";
import { useEffect, useState } from "react";
import type { Message as MsgType } from "../../types";
import { useCurrentUser } from "../../api";

export interface MessageProps {
  message: MsgType;
}

export function Message({ message }: MessageProps) {
  const { decryptWithDevice } = useCrypto();
  const [plaintext, setPlaintext] = useState<string>("Decrypting...");
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    let isMounted = true;

    async function decrypt() {
      try {
        const decrypted = await decryptWithDevice(message.ciphertext);

        if (isMounted) setPlaintext(decrypted);
      } catch (err) {
        console.error("Failed to decrypt message", err);
        if (isMounted) setPlaintext("[Unable to decrypt]");
      }
    }

    decrypt();
    return () => {
      isMounted = false;
    };
  }, [message.ciphertext]);

  return (
    <Box
      key={message.id}
      sx={{
        alignSelf:
          message.sender.id === currentUser?.id ? "flex-end" : "flex-start",
        bgcolor:
          message.sender.id === currentUser?.id ? "primary.main" : "grey.300",
        color: message.sender.id === currentUser?.id ? "white" : "black",
        px: 2,
        py: 1,
        borderRadius: 2,
        maxWidth: "70%",
        wordBreak: "break-word",
      }}
    >
      <Typography>{plaintext}</Typography>
    </Box>
  );
}
