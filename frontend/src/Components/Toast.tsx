import { toast } from "sonner";

const Success = (message: string) => {
  toast.success(message, {
    duration: 3000,
    cancel: {
      label: "Cancel",
      onClick: () => {},
    },
  });
};
const Failure = (message: string) => {
  toast.error(message, {
    duration: 3000,
    cancel: {
      label: "Cancel",
      onClick: () => {},
    },
  });
};

export { Success, Failure };
