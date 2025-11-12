// E:\devalayaum\frontend\src\utils\extractMessage.ts
type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
};

export default function extractMessage(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    const maybe = err as ErrorWithResponse;
    const respMsg = maybe.response?.data?.message;
    if (typeof respMsg === "string" && respMsg.trim() !== "") return respMsg;
    const respErr = maybe.response?.data?.error;
    if (typeof respErr === "string" && respErr.trim() !== "") return respErr;
    if (typeof maybe.message === "string" && maybe.message.trim() !== "") return maybe.message;
  }

  if (typeof err === "string") return err;
  return "Unexpected error occurred";
}
