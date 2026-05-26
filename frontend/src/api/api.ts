const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export async function apiFetch<T>(
  endpoint: string,
  opcoes: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("compraaudit_token");

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    throw new Error("Erro ao comunicar com a API.");
  }

  return resposta.json() as Promise<T>;
}