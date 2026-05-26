# Teste da API PNCP

O CompraAudit utilizará dados públicos de contratações para gerar evidências verificáveis.

## Campos usados no hash

- fonte
- identificador
- orgao
- objeto
- valor
- modalidade
- dataPublicacao

## Estratégia

O backend irá consultar a fonte pública, normalizar os dados principais da contratação e gerar um hash. Esse hash será registrado em blockchain enquanto os dados completos ficarão off-chain.