const API_BASE_URL = 'http://localhost:8000/api/asignaciones';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

export const asignacionesApi = {
  // Asignar estudiante a curso
  async asignarEstudiante(id_estudiante, id_curso) {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_estudiante, id_curso }),
    });
    return handleResponse(response);
  },

  // Asignar múltiples estudiantes a un curso (nuevo endpoint masivo)
  async asignarEstudiantesMasivo(id_curso, ids_estudiantes) {
    const response = await fetch(`${API_BASE_URL}/masivo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_curso, ids_estudiantes }),
    });
    return handleResponse(response);
  },

  // Desasignar estudiante de curso
  async desasignarEstudiante(id_estudiante, id_curso) {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_estudiante, id_curso }),
    });
    return handleResponse(response);
  },

  // Obtener todos los estudiantes de un curso
  async getEstudiantesDeCurso(id_curso) {
    const response = await fetch(`${API_BASE_URL}/curso/${id_curso}/`);
    return handleResponse(response);
  },

  // Obtener estudiantes habilitados de un curso (nuevo endpoint)
  async getEstudiantesHabilitadosDeCurso(id_curso) {
    const response = await fetch(`${API_BASE_URL}/curso/${id_curso}/estudiantes-habilitados`);
    return handleResponse(response);
  },

  // Obtener todos los cursos de un estudiante
  async getCursosDeEstudiante(id_estudiante) {
    const response = await fetch(`${API_BASE_URL}/estudiante/${id_estudiante}/`);
    return handleResponse(response);
  },
};
