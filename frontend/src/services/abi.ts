export const REGISTRO_AUDITORIA_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "fonte",
        type: "string",
      },
      {
        internalType: "string",
        name: "identificador",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "hashDados",
        type: "bytes32",
      },
    ],
    name: "registrarEvidencia",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;