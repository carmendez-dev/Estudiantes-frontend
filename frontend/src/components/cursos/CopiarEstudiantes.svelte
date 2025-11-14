<script>
  import { createEventDispatcher } from 'svelte';
  import { cursosApi } from '../../lib/cursosApi.js';
  import { asignacionesApi } from '../../lib/asignacionesApi.js';

  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  let cursoOrigenId = '';
  let cursoDestinoId = '';
  let cursosOrigen = [];
  let cursosDestino = [];
  let estudiantesOrigen = [];
  let estudiantesSeleccionados = [];
  let loading = false;
  let error = null;
  let success = null;
  let gestionOrigen = '';
  let gestionDestino = '';
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

  async function cargarCursosOrigen() {
    if (!gestionOrigen) return;
    
    loading = true;
    try {
      cursosOrigen = await cursosApi.getCursos(0, 1000, null, gestionOrigen);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function cargarCursosDestino() {
    if (!gestionDestino) return;
    
    loading = true;
    try {
      cursosDestino = await cursosApi.getCursos(0, 1000, null, gestionDestino);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function cargarEstudiantes() {
    if (!cursoOrigenId) {
      error = 'Selecciona un curso de origen';
      return;
    }

    loading = true;
    error = null;
    
    try {
      const estudiantes = await asignacionesApi.getEstudiantesDeCurso(cursoOrigenId);
      estudiantesOrigen = estudiantes;
      estudiantesSeleccionados = estudiantes.map(e => e.id_estudiante);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function toggleEstudiante(idEstudiante) {
    if (estudiantesSeleccionados.includes(idEstudiante)) {
      estudiantesSeleccionados = estudiantesSeleccionados.filter(id => id !== idEstudiante);
    } else {
      estudiantesSeleccionados = [...estudiantesSeleccionados, idEstudiante];
    }
  }

  function seleccionarTodos() {
    estudiantesSeleccionados = estudiantesOrigen.map(e => e.id_estudiante);
  }

  function deseleccionarTodos() {
    estudiantesSeleccionados = [];
  }

  async function copiarEstudiantes() {
    if (!cursoDestinoId) {
      error = 'Selecciona un curso de destino';
      return;
    }

    if (estudiantesSeleccionados.length === 0) {
      error = 'Selecciona al menos un estudiante';
      return;
    }

    loading = true;
    error = null;
    success = null;

    try {
      let exitosos = 0;
      let fallidos = 0;

      for (const idEstudiante of estudiantesSeleccionados) {
        try {
          await asignacionesApi.asignarEstudiante(idEstudiante, parseInt(cursoDestinoId));
          exitosos++;
        } catch (err) {
          fallidos++;
          console.error(`Error asignando estudiante ${idEstudiante}:`, err);
        }
      }

      success = `Se copiaron ${exitosos} estudiantes exitosamente.`;
      if (fallidos > 0) {
        success += ` ${fallidos} ya estaban asignados o hubo errores.`;
      }

      setTimeout(() => {
        close();
      }, 2000);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function close() {
    dispatch('close');
    // Reset
    cursoOrigenId = '';
    cursoDestinoId = '';
    estudiantesOrigen = [];
    estudiantesSeleccionados = [];
    error = null;
    success = null;
  }

  $: cursoOrigenId, cargarEstudiantes();
</script>

{#if show}
  <div class="modal-overlay" on:click={close}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Copiar Estudiantes a Nuevo Curso</h2>
        <button class="close-btn" on:click={close}>&times;</button>
      </div>

      <div class="modal-body">
        {#if error}
          <div class="alert alert-error">{error}</div>
        {/if}

        {#if success}
          <div class="alert alert-success">{success}</div>
        {/if}

        <div class="section">
          <h3>1. Seleccionar Curso de Origen</h3>
          <div class="form-group">
            <label>Gestión de Origen:</label>
            <select bind:value={gestionOrigen} on:change={cargarCursosOrigen}>
              <option value="">-- Selecciona gestión --</option>
              {#each availableGestiones as year}
                <option value={year}>{year}</option>
              {/each}
            </select>
          </div>

          {#if cursosOrigen.length > 0}
            <div class="form-group">
              <label>Curso de Origen:</label>
              <select bind:value={cursoOrigenId}>
                <option value="">-- Selecciona curso --</option>
                {#each cursosOrigen as curso}
                  <option value={curso.id_curso}>
                    {curso.nombre_curso} - {curso.nivel}
                  </option>
                {/each}
              </select>
            </div>
          {/if}
        </div>

        {#if estudiantesOrigen.length > 0}
          <div class="section">
            <div class="section-header">
              <h3>2. Seleccionar Estudiantes ({estudiantesSeleccionados.length}/{estudiantesOrigen.length})</h3>
              <div class="selection-buttons">
                <button class="btn-small" on:click={seleccionarTodos}>Todos</button>
                <button class="btn-small" on:click={deseleccionarTodos}>Ninguno</button>
              </div>
            </div>

            <div class="estudiantes-list">
              {#each estudiantesOrigen as estudiante}
                <label class="estudiante-item">
                  <input 
                    type="checkbox" 
                    checked={estudiantesSeleccionados.includes(estudiante.id_estudiante)}
                    on:change={() => toggleEstudiante(estudiante.id_estudiante)}
                  />
                  <span>{estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}</span>
                </label>
              {/each}
            </div>
          </div>

          <div class="section">
            <h3>3. Seleccionar Curso de Destino</h3>
            <div class="form-group">
              <label>Gestión de Destino:</label>
              <select bind:value={gestionDestino} on:change={cargarCursosDestino}>
                <option value="">-- Selecciona gestión --</option>
                {#each availableGestiones as year}
                  <option value={year}>{year}</option>
                {/each}
              </select>
            </div>

            {#if cursosDestino.length > 0}
              <div class="form-group">
                <label>Curso de Destino:</label>
                <select bind:value={cursoDestinoId}>
                  <option value="">-- Selecciona curso --</option>
                  {#each cursosDestino as curso}
                    <option value={curso.id_curso}>
                      {curso.nombre_curso} - {curso.nivel}
                    </option>
                  {/each}
                </select>
              </div>
            {/if}
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" on:click={close}>Cancelar</button>
            <button 
              class="btn-primary" 
              on:click={copiarEstudiantes}
              disabled={loading || !cursoDestinoId || estudiantesSeleccionados.length === 0}
            >
              {loading ? 'Copiando...' : `Copiar ${estudiantesSeleccionados.length} Estudiantes`}
            </button>
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
    max-width: 700px;
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

  .modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    position: sticky;
    bottom: 0;
    background: white;
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

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .section-header h3 {
    margin: 0;
  }

  .selection-buttons {
    display: flex;
    gap: 0.5rem;
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

  .estudiantes-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    padding: 0.5rem;
  }

  .estudiante-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background 0.2s;
  }

  .estudiante-item:hover {
    background: #f9fafb;
  }

  .estudiante-item:last-child {
    border-bottom: none;
  }

  .estudiante-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .estudiante-item span {
    flex: 1;
    color: #1f2937;
  }

  .btn-small {
    padding: 0.4rem 0.8rem;
    background-color: #e5e7eb;
    color: #374151;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-small:hover {
    background-color: #d1d5db;
  }

  .btn-primary {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background-color: #27C5DA;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #1fb5c9;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background-color: #f3f4f6;
    color: #374151;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background-color: #e5e7eb;
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

  .alert-success {
    background-color: #efe;
    color: #3AC0B8;
    border-left: 4px solid #3AC0B8;
  }
</style>

