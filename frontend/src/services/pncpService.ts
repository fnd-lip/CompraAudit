import { buscarContratacaoApi } from "../api/pncpApi";

// busca contratacao e hash calculado pelo backend 
export async function buscarContratacaoPorIdentificador(identificador: string) {
  return buscarContratacaoApi(identificador);
}