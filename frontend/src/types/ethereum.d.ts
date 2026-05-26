export {};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (evento: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (evento: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}