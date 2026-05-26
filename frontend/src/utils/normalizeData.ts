export function normalizarDados(dados: unknown): string {
  return JSON.stringify(ordenarObjeto(dados));
}

function ordenarObjeto(valor: unknown): unknown {
  if (Array.isArray(valor)) {
    return valor.map(ordenarObjeto);
  }

  if (valor !== null && typeof valor === "object") {
    return Object.keys(valor as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((objetoOrdenado, chave) => {
        objetoOrdenado[chave] = ordenarObjeto((valor as Record<string, unknown>)[chave]);
        return objetoOrdenado;
      }, {});
  }

  return valor;
}