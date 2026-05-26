export const ENDERECO_CONTRATO =
  import.meta.env.VITE_CONTRACT_ADDRESS || "";

export const SEPOLIA_CHAIN_ID = Number(
  import.meta.env.VITE_SEPOLIA_CHAIN_ID || 11155111
);

export const EXPLORER_URL =
  import.meta.env.VITE_EXPLORER_URL || "https://sepolia.etherscan.io";