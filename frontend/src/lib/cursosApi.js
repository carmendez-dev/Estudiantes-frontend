const API_BASE_URL = 'http://localhost:8000/api/cursos';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

export const cursosApi = {
  // Obtener todos los cursos
  async getCursos(skip = 0, limit = 100, nivel = null, gestion = null) {
    let url = `${API_BASE_URL}/?skip=${skip}&limit=${limit}`;
    if (nivel) url += `&nivel=${nivel}`;
    if (gestion) url += `&gestion=${gestion}`;
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Obtener curso por ID
  async getCurso(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/`);
    return handleResponse(response);
  },

  // Crear nuevo curso
  async createCurso(curso) {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(curso),
    });
    return handleResponse(response);
  },

  // Actualizar curso
  async updateCurso(id, curso) {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(curso),
    });
    return handleResponse(response);
  },

  // Eliminar curso
  async deleteCurso(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
