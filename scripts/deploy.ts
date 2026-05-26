import { ethers } from "hardhat";

async function main() {
  const RegistroAuditoria = await ethers.getContractFactory("RegistroAuditoria");
  const contrato = await RegistroAuditoria.deploy();

  await contrato.waitForDeployment();

  const enderecoContrato = await contrato.getAddress();

  console.log("RegistroAuditoria deployado em:", enderecoContrato);
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});