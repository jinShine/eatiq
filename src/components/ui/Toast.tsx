import { type ExternalToast, toast } from "sonner";

export const Toast = {
  default: (message: string, options: ExternalToast = {}) => {
    toast(message, { ...options });
  },
  success: (message: string, options: ExternalToast = {}) => {
    toast.success(message, { ...options });
  },
  error: (message: string, options: ExternalToast = {}) => {
    toast.error(message, { ...options });
  },
  info: (message: string, options: ExternalToast = {}) => {
    toast.info(message, { ...options });
  },
  warning: (message: string, options: ExternalToast = {}) => {
    toast.warning(message, { ...options });
  },
};
