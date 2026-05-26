const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

// busca o token salvo para enviar nas rotas protegidas 
function buscarToken(): string | null {
  return localStorage.getItem("compraaudit_token");
}

// trata resposta da api e exibe erro mais claro 
async function tratarResposta<T>(resposta: Response): Promise<T> {
  const conteudo = await resposta.text();
  const dados = conteudo ? JSON.parse(conteudo) : null;

  if (!resposta.ok) {
    throw new Error(dados?.mensagem || "Erro ao comunicar com a API.");
  }

  return dados as T;
}

// faz requisições http para o backend 
export async function apiFetch<T>(
  endpoint: string,
  opcoes: RequestInit = {}
): Promise<T> {
  const token = buscarToken();

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  return tratarResposta<T>(resposta);
}