import { Box, Typography } from "@mui/material";
import { useCrypto } from "../../providers/CryptoProvider";
import { useEffect, useState } from "react";
import type { Message } from "../../types";
import { useCurrentUser } from "../../api";

export interface MessageProps {
  message: Message;
}

export function Message({ message }: MessageProps) {
  const { decryptText, deviceInfo } = useCrypto();
  const [plaintext, setPlaintext] = useState<string>("Decrypting...");
  const { data: currentUser } = useCurrentUser();
  const isMyMessage = !!(message.sender.id === currentUser?.id);

  useEffect(() => {
    let running = true;
    (async () => {
      try {
        let wrappedKey = message.wrappedKeys;
        if (!message.iv || !message.ciphertext || !wrappedKey) {
          console.warn("Missing fields required for hybrid decrypt", {
            iv: !!message.iv,
            ct: !!message.ciphertext,
            wk: !!wrappedKey,
          });
          if (running) setPlaintext("[No ciphertext for this device]");
          return;
        }

        const wrappedKeys = message.wrappedKeys.map((k) => k.encryptedKey);
        console.log(deviceInfo?.id, message.wrappedKeys);
        console.log("Message", message);

        const dec = await decryptText(
          message.iv,
          message.ciphertext,
          wrappedKeys[0]
        );
        if (!dec) return;
        if (running) setPlaintext(dec);
      } catch (err) {
        console.error("Failed to decrypt message", err);
        if (running) setPlaintext("[Unable to decrypt]");
      }
    })();
    return () => {
      running = false;
    };
  }, [
    message.id,
    message.iv,
    message.ciphertext,
    deviceInfo?.id,
    message.wrappedKeys,
  ]);

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
