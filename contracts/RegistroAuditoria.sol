// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RegistroAuditoria {
    struct Evidencia {
        string fonte;
        string identificador;
        bytes32 hashDados;
        uint256 timestamp;
        address registrador;
        bool existe;
    }

    mapping(string => Evidencia) private evidencias;

    event EvidenciaRegistrada(
        string identificador,
        string fonte,
        bytes32 hashDados,
        uint256 timestamp,
        address registrador
    );

    function registrarEvidencia(
        string memory fonte,
        string memory identificador,
        bytes32 hashDados
    ) public {
        require(bytes(identificador).length > 0, "Identificador obrigatorio");
        require(hashDados != bytes32(0), "Hash invalido");
        require(!evidencias[identificador].existe, "Evidencia ja registrada");

        evidencias[identificador] = Evidencia({
            fonte: fonte,
            identificador: identificador,
            hashDados: hashDados,
            timestamp: block.timestamp,
            registrador: msg.sender,
            existe: true
        });

        emit EvidenciaRegistrada(
            identificador,
            fonte,
            hashDados,
            block.timestamp,
            msg.sender
        );
    }

    function consultarEvidencia(
        string memory identificador
    )
        public
        view
        returns (
            string memory fonte,
            string memory id,
            bytes32 hashDados,
            uint256 timestamp,
            address registrador,
            bool existe
        )
    {
        Evidencia memory evidencia = evidencias[identificador];

        return (
            evidencia.fonte,
            evidencia.identificador,
            evidencia.hashDados,
            evidencia.timestamp,
            evidencia.registrador,
            evidencia.existe
        );
    }
}