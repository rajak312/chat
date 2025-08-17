import { Box, Typography } from "@mui/material";
import { useCrypto } from "../../providers/CryptoProvider";
import { useEffect, useState } from "react";
import type { Device, Message } from "../../types";
import { useCurrentUser } from "../../api";

export interface MessageProps {
  message: Message;
  devices?: Device[];
}

export function Message({ message, devices }: MessageProps) {
  const { decryptReceivedMessage } = useCrypto();
  const [plaintext, setPlaintext] = useState<string>("Decrypting...");
  const { data } = useCurrentUser();

  useEffect(() => {
    let isMounted = true;

    async function decrypt() {
      try {
        // Only attempt decryption if encrypted fields exist
        // console.log("decrypting", message);
        if (message.iv && message.senderEphemeralPublic) {
          console.log("decrypting");
          console.log("ciphertext", message.ciphertext);
          console.log("iv", message.iv);
          console.log("senderEphemeralPublic", message.senderEphemeralPublic);

          const decrypted = await decryptReceivedMessage(
            message.ciphertext,
            message.iv,
            message.senderEphemeralPublic
          );
          console.log(decrypted, "mees");
          if (isMounted) setPlaintext(decrypted);
        } else {
          setPlaintext(message.ciphertext); // fallback if not encrypted
        }
      } catch (err) {
        console.error("Failed to decrypt message", err);
        if (isMounted) setPlaintext("[Unable to decrypt]");
      }
    }

    decrypt();

    return () => {
      isMounted = false;
    };
  }, [message, decryptReceivedMessage]);

  return (
    <Box
      key={message.id}
      sx={{
        alignSelf: message.sender.id === data?.id ? "flex-end" : "flex-start",
        bgcolor: message.sender.id === data?.id ? "primary.main" : "grey.300",
        color: message.sender.id === data?.id ? "white" : "black",
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
