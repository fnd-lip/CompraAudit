export const REGISTRO_AUDITORIA_ABI = [
  {
    inputs: [
      { internalType: "string", name: "fonte", type: "string" },
      { internalType: "string", name: "identificador", type: "string" },
      { internalType: "bytes32", name: "hashDados", type: "bytes32" },
    ],
    name: "registrarEvidencia",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "identificador", type: "string" }],
    name: "consultarEvidencia",
    outputs: [
      { internalType: "string", name: "fonte", type: "string" },
      { internalType: "string", name: "id", type: "string" },
      { internalType: "bytes32", name: "hashDados", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "address", name: "registrador", type: "address" },
      { internalType: "bool", name: "existe", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;