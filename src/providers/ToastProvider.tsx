import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

interface Toast {
  id: number;
  message: string;
  severity: AlertColor;
}

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, severity: AlertColor = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, severity }]);
    },
    []
  );

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={4000}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.severity}
            sx={{
              width: "100%",
              fontWeight: 500,
              border: "1px solid",
              borderColor:
                toast.severity === "success"
                  ? "green"
                  : toast.severity === "error"
                  ? "red"
                  : toast.severity === "warning"
                  ? "orange"
                  : "blue",
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
