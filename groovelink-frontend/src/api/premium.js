import { API_URL } from "./config";
import { getAuthToken } from "./authSession";

export async function activarPremium() {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/usuarios/me/premium`, {
    method: "POST",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Error al activar premium";
    throw new Error(message);
  }

  return data;
}
