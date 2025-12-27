// components/ui/use-toast.ts
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    sonnerToast[variant === "destructive" ? "error" : "message"](title, {
      description,
      // You can add more options here like duration, action, etc.
    });
  };

  return { toast };
}
