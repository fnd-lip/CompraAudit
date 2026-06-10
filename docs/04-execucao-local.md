# 04 - Execução Local

## 1. Pré-requisitos

Para executar o **CompraAudit** localmente, é recomendado ter instalado:

* Node.js 20 ou superior
* npm
* Git
* MetaMask
* Docker, opcional para validar o build em ambiente Linux;
* acesso a uma RPC da Sepolia, caso deseje fazer novos deploys ou interações diretas com a testnet.

---

## 2. Clonar o repositório

```bash
git clone https://github.com/fnd-lip/CompraAudit.git
cd CompraAudit
```

---

## 3. Estrutura principal do projeto

```txt
CompraAudit/
├── contracts/          # Contrato Solidity
├── scripts/            # Scripts de deploy
├── test/               # Testes Hardhat
├── frontend/           # Aplicação web React
│   └── server/         # Backend/API
├── docs/               # Documentação do projeto
└── README.md
```

---

## 4. Executar contratos e testes

Na raiz do projeto, instale as dependências:

```bash
npm ci
```

Compile os contratos:

```bash
npx hardhat compile
```

Execute os testes:

```bash
npx hardhat test
```

Resultado esperado:

```txt
RegistroAuditoria
  ✔ deve registrar e consultar uma evidencia
  ✔ nao deve permitir registrar a mesma evidencia duas vezes

2 passing
```

---

## 5. Variáveis de ambiente da blockchain

Para interagir diretamente com a Sepolia usando Hardhat, crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
SEPOLIA_RPC_URL=SUA_RPC_SEPOLIA
PRIVATE_KEY=SUA_PRIVATE_KEY
CONTRACT_ADDRESS=0x0c25D7F879C01173C1C0F728272804331dB5a503
```

> Nunca envie chaves privadas reais para o GitHub.

Contrato usado no MVP:

```txt
0x0c25D7F879C01173C1C0F728272804331dB5a503
```

Explorador:

```txt
https://sepolia.etherscan.io/address/0x0c25D7F879C01173C1C0F728272804331dB5a503
```

---

## 6. Executar o backend

O backend fica dentro da pasta:

```txt
frontend/server
```

Entre na pasta do servidor:

```bash
cd frontend/server
```

Instale as dependências:

```bash
npm ci
```

Crie um arquivo `.env` dentro de `frontend/server`.

Exemplo:

```env
PORT=3333
JWT_SECRET=compraaudit_dev_secret
PNCP_BASE_URL=https://pncp.gov.br/api/consulta
DATABASE_URL=COLE_AQUI_SUA_DATABASE_URL
```

Descrição das variáveis:

| Variável        | Função                                                         |
| --------------- | -------------------------------------------------------------- |
| `PORT`          | Porta em que a API será executada                              |
| `JWT_SECRET`    | Chave usada para geração/validação de tokens no ambiente local |
| `PNCP_BASE_URL` | URL base da API pública do PNCP                                |
| `DATABASE_URL`  | URL de conexão com o banco de dados usado pelo Prisma          |

> O valor de `DATABASE_URL` depende do banco configurado no ambiente local.
> Não envie credenciais reais para o GitHub.

Execute o backend:

```bash
npm run dev
```

A API deve ficar disponível em:

```txt
http://localhost:3333
```

Endpoint de teste:

```txt
GET http://localhost:3333/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "CompraAudit API"
}
```

---

## 7. Executar o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm ci
```

Crie um arquivo `.env` dentro de `frontend`.

Exemplo:

```env
VITE_API_URL=http://localhost:3333
VITE_CONTRACT_ADDRESS=0x0c25D7F879C01173C1C0F728272804331dB5a503
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_EXPLORER_URL=https://sepolia.etherscan.io
```

Descrição das variáveis:

| Variável                | Função                                      |
| ----------------------- | ------------------------------------------- |
| `VITE_API_URL`          | URL da API backend usada pelo frontend      |
| `VITE_CONTRACT_ADDRESS` | Endereço do contrato deployado na Sepolia   |
| `VITE_SEPOLIA_CHAIN_ID` | Chain ID da Sepolia                         |
| `VITE_EXPLORER_URL`     | URL base do explorador Etherscan da Sepolia |

Execute o frontend:

```bash
npm run dev
```

A aplicação deve ficar disponível em:

```txt
http://localhost:5173
```

---

## 8. Fluxo de teste manual

Com backend e frontend rodando:

1. Acesse o frontend local.
2. Abra a tela de nova auditoria.
3. Consulte ou selecione uma contratação pública.
4. Revise os dados retornados.
5. Registre a evidência na blockchain usando MetaMask.
6. Aguarde a confirmação da transação na Sepolia.
7. Acesse a tela de verificação pública.
8. Consulte a evidência pelo identificador, ID ou hash.
9. Confira se o resultado aparece como compatível.
10. Abra o dashboard e verifique o registro no mapa on-chain.

---

## 9. Aplicação em produção

Frontend em produção:

```txt
https://compra-audit.vercel.app/
```

Contrato na Sepolia:

```txt
https://sepolia.etherscan.io/address/0x0c25D7F879C01173C1C0F728272804331dB5a503
```

---

## 10. Scripts úteis

### Raiz do projeto

```bash
npm ci
npx hardhat compile
npx hardhat test
```

### Frontend

```bash
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

### Backend

```bash
cd frontend/server
npm ci
npm run dev
```

---

## 11. Validação com Docker

Durante o desenvolvimento, a validação do frontend foi feita em ambiente Linux usando Docker, simulando melhor o ambiente do GitHub Actions.

Na raiz do projeto:

```powershell
docker run --rm -v "${PWD}:/app" -w /app/frontend node:24-bookworm bash -lc "npm ci && npm run lint && npm run build"
```

Esse comando executa:

```txt
npm ci
npm run lint
npm run build
```

Se todos os passos passarem, o frontend está validado para CI/CD.

---

## 12. Observações importantes

* O backend precisa estar rodando para o frontend consultar dados, evidências e sugestões de auditoria.
* A MetaMask deve estar conectada à rede Sepolia para registrar evidências on-chain.
* O contrato já está deployado na Sepolia.
* Chaves privadas e URLs sensíveis devem ficar apenas em arquivos `.env` locais.
* O projeto usa blockchain apenas para registrar a prova criptográfica da evidência.
* Os dados completos da contratação ficam off-chain.
* O frontend em produção está disponível na Vercel.
* O contrato pode ser verificado publicamente no Etherscan da Sepolia.

---

## 13. Resumo rápido

Para testar os contratos:

```bash
npm ci
npx hardhat test
```

Para rodar o backend:

```bash
cd frontend/server
npm ci
npm run dev
```

Para rodar o frontend:

```bash
cd frontend
npm ci
npm run dev
```

Depois, acesse:

```txt
http://localhost:5173
```

A API local deve estar em:

```txt
http://localhost:3333
```