<script>
  import { createEventDispatcher } from 'svelte';
  import { cursosApi } from '../../lib/cursosApi.js';
  import { asignacionesApi } from '../../lib/asignacionesApi.js';

  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  let cursoSeleccionadoId = '';
  let cursos = [];
  let estudiantes = [];
  let loading = false;
  let error = null;
  let gestionSeleccionada = '';
  let availableGestiones = [];

  function generateGestiones() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i.toString());
    }
    availableGestiones = years.reverse();
  }

  generateGestiones();

  async function cargarCursos() {
    if (!gestionSeleccionada) return;
    
    loading = true;
    try {
      cursos = await cursosApi.getCursos(0, 1000, null, gestionSeleccionada);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function cargarEstudiantes() {
    if (!cursoSeleccionadoId) {
      error = 'Selecciona un curso';
      return;
    }

    loading = true;
    error = null;
    
    try {
      const data = await asignacionesApi.getEstudiantesDeCurso(cursoSeleccionadoId);
      // Filtrar solo estudiantes activos/habilitados
      estudiantes = data.filter(e => e.estado !== 'inactivo');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function copiarAlPortapapeles() {
    if (estudiantes.length === 0) return;

    const texto = estudiantes.map(e => 
      `${e.id_estudiante}\t${e.nombres} ${e.apellido_paterno} ${e.apellido_materno}`
    ).join('\n');
    
    navigator.clipboard.writeText(texto).then(() => {
      alert('Lista de estudiantes copiada al portapapeles. Puedes pegarla en Excel o donde necesites.');
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }

  function close() {
    dispatch('close');
    // Reset
    cursoSeleccionadoId = '';
    estudiantes = [];
    error = null;
  }

</script>

{#if show}
  <div class="modal-overlay" on:click={close}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Ver Estudiantes Habilitados de un Curso</h2>
        <button class="close-btn" on:click={close}>&times;</button>
      </div>

      <div class="modal-body">
        {#if error}
          <div class="alert alert-error">{error}</div>
        {/if}

        <div class="info-box">
          <p>📋 Esta lista muestra el ID y nombre de todos los estudiantes habilitados del curso seleccionado.</p>
          <p>Puedes copiar esta información para registrarlos en otro curso.</p>
        </div>

        <div class="section">
          <h3>Seleccionar Curso</h3>
          <div class="form-group">
            <label>Gestión:</label>
            <select bind:value={gestionSeleccionada} on:change={cargarCursos}>
              <option value="">-- Selecciona gestión --</option>
              {#each availableGestiones as year}
                <option value={year}>{year}</option>
              {/each}
            </select>
          </div>

          {#if cursos.length > 0}
            <div class="form-group">
              <label>Curso:</label>
              <select bind:value={cursoSeleccionadoId} on:change={cargarEstudiantes}>
                <option value="">-- Selecciona curso --</option>
                {#each cursos as curso}
                  <option value={curso.id_curso}>
                    {curso.nombre_curso} - {curso.nivel}
                  </option>
                {/each}
              </select>
            </div>
          {/if}
        </div>

        {#if loading}
          <div class="loading">Cargando estudiantes...</div>
        {/if}

        {#if estudiantes.length > 0}
          <div class="section">
            <h3>Estudiantes Habilitados ({estudiantes.length})</h3>

            <div class="estudiantes-list">
              <div class="list-header">
                <span class="col-id">ID</span>
                <span class="col-nombre">Nombre Completo</span>
              </div>
              {#each estudiantes as estudiante}
                <div class="estudiante-item">
                  <span class="estudiante-id">{estudiante.id_estudiante}</span>
                  <span class="estudiante-nombre">
                    {estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}
                  </span>
                </div>
              {/each}
            </div>

            <button class="btn-copy" on:click={copiarAlPortapapeles}>
              📋 Copiar Lista al Portapapeles
            </button>
          </div>
        {:else if cursoSeleccionadoId && !loading}
          <div class="empty-message">
            No hay estudiantes habilitados en este curso.
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 650px;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #1f2937;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: #6b7280;
    cursor: pointer;
    line-height: 1;
  }

  .close-btn:hover {
    color: #EF5C52;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .info-box {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 6px;
  }

  .info-box p {
    margin: 0.25rem 0;
    color: #1e40af;
    font-size: 0.9rem;
  }

  .section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
  }

  .section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: #1f2937;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }

  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
    font-style: italic;
  }

  .empty-message {
    text-align: center;
    padding: 2rem;
    color: #9ca3af;
    font-style: italic;
  }

  .estudiantes-list {
    max-height: 350px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    margin-bottom: 1rem;
  }

  .list-header {
    display: flex;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
    font-weight: 600;
    color: #374151;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .col-id {
    width: 80px;
  }

  .col-nombre {
    flex: 1;
  }

  .estudiante-item {
    display: flex;
    padding: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.2s;
  }

  .estudiante-item:hover {
    background-color: #f9fafb;
  }

  .estudiante-item:last-child {
    border-bottom: none;
  }

  .estudiante-id {
    width: 80px;
    font-weight: 600;
    color: #6b7280;
  }

  .estudiante-nombre {
    flex: 1;
    color: #1f2937;
  }

  .btn-copy {
    width: 100%;
    padding: 0.75rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-copy:hover {
    background-color: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
  }

  .alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
  }

  .alert-error {
    background-color: #fee;
    color: #EF5C52;
    border-left: 4px solid #EF5C52;
  }
</style>

