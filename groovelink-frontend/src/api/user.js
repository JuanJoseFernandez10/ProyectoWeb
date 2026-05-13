import { API_URL } from "./config";
import { getAuthToken } from "./authSession";

/**
 * GET /aptitudes - fetch all aptitudes
 */
export async function fetchAptitudes() {
  const response = await fetch(`${API_URL}/aptitudes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al cargar aptitudes");
  }

  return response.json();
}

/**
 * GET /generos - fetch all generos
 */
export async function fetchGeneros() {
  const response = await fetch(`${API_URL}/generos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al cargar géneros musicales");
  }

  return response.json();
}

/**
 * PUT /usuarios/me/personalizar - save personalization data
 */
export async function personalizarPerfil({ aptitudesIds, generosIds, descripcion, ubicacion }) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/usuarios/me/personalizar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      aptitudesIds: aptitudesIds || [],
      generosIds: generosIds || [],
      descripcion: descripcion || "",
      ubicacion: ubicacion || "",
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Error al guardar la personalización";
    throw new Error(message);
  }

  return data;
}

/**
 * POST /usuarios/me/foto-perfil - upload profile photo
 */
export async function subirFotoPerfil(fotoFile) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("foto", fotoFile);

  const response = await fetch(`${API_URL}/usuarios/me/foto-perfil`, {
    method: "POST",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Error al subir la foto";
    throw new Error(message);
  }

  return data;
}
