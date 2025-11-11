const API_BASE_URL = 'http://localhost:8000/api/estudiantes';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Obtener todos los estudiantes
  async getEstudiantes(skip = 0, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  // Obtener estudiante por ID
  async getEstudiante(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/`);
    return handleResponse(response);
  },

  // Crear nuevo estudiante
  async createEstudiante(estudiante) {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(estudiante),
    });
    return handleResponse(response);
  },

  // Actualizar estudiante
  async updateEstudiante(id, estudiante) {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(estudiante),
    });
    return handleResponse(response);
  },

  // Eliminar estudiante
  async deleteEstudiante(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
