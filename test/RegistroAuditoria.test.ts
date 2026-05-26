import { expect } from "chai";
import { ethers } from "hardhat";

describe("RegistroAuditoria", function () {
  it("deve registrar e consultar uma evidencia", async function () {
    const Contrato = await ethers.getContractFactory("RegistroAuditoria");
    const contrato = await Contrato.deploy();

    const fonte = "PNCP";
    const identificador = "PNCP-2026-0001";
    const hashDados = ethers.keccak256(
      ethers.toUtf8Bytes("dados-normalizados")
    );

    await contrato.registrarEvidencia(fonte, identificador, hashDados);

    const evidencia = await contrato.consultarEvidencia(identificador);

    expect(evidencia[0]).to.equal(fonte);
    expect(evidencia[1]).to.equal(identificador);
    expect(evidencia[2]).to.equal(hashDados);
    expect(evidencia[5]).to.equal(true);
  });

  it("nao deve permitir registrar a mesma evidencia duas vezes", async function () {
    const Contrato = await ethers.getContractFactory("RegistroAuditoria");
    const contrato = await Contrato.deploy();

    const fonte = "PNCP";
    const identificador = "PNCP-2026-0001";
    const hashDados = ethers.keccak256(
      ethers.toUtf8Bytes("dados-normalizados")
    );

    await contrato.registrarEvidencia(fonte, identificador, hashDados);

    await expect(
      contrato.registrarEvidencia(fonte, identificador, hashDados)
    ).to.be.revertedWith("Evidencia ja registrada");
  });
});