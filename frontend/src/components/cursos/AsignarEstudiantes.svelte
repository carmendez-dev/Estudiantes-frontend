<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { api } from '../../lib/api.js';
  import { asignacionesApi } from '../../lib/asignacionesApi.js';
  
  export let curso;

  const dispatch = createEventDispatcher();

  let estudiantes = [];
  let estudiantesAsignados = [];
  let loading = false;
  let error = null;
  let searchTerm = '';
  let selectedEstudiante = null;

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = null;
    try {
      const [allEstudiantes, cursoData] = await Promise.all([
        api.getEstudiantes(),
        asignacionesApi.getEstudiantesDeCurso(curso.id_curso)
      ]);
      
      estudiantes = allEstudiantes;
      estudiantesAsignados = cursoData.estudiantes || [];
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function asignarEstudiante() {
    if (!selectedEstudiante) return;
    
    loading = true;
    error = null;
    try {
      await asignacionesApi.asignarEstudiante(selectedEstudiante, curso.id_curso);
      await loadData();
      selectedEstudiante = null;
      dispatch('updated');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function desasignarEstudiante(id_estudiante) {
    if (!confirm('¿Estás seguro de desasignar este estudiante del curso?')) return;
    
    loading = true;
    error = null;
    try {
      await asignacionesApi.desasignarEstudiante(id_estudiante, curso.id_curso);
      await loadData();
      dispatch('updated');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  $: estudiantesDisponibles = estudiantes.filter(est => {
    const yaAsignado = estudiantesAsignados.some(ea => ea.id_estudiante === est.id_estudiante);
    const matchSearch = searchTerm === '' || 
      `${est.nombres} ${est.apellido_paterno} ${est.apellido_materno}`.toLowerCase().includes(searchTerm.toLowerCase());
    return !yaAsignado && matchSearch;
  });
</script>

<div class="asignar-container">
  <h3 class="section-title">Gestionar Estudiantes del Curso</h3>
  <p class="section-subtitle">{curso.nombre_curso} - {curso.nivel}</p>

  {#if error}
    <div class="alert alert-error">{error}</div>
  {/if}

  <div class="asignar-form">
    <div class="form-group">
      <label>Buscar y Asignar Estudiante</label>
      <div class="input-group">
        <input 
          type="text" 
          placeholder="Buscar estudiante..."
          bind:value={searchTerm}
          class="search-input"
        />
        <select bind:value={selectedEstudiante} class="select-input" disabled={loading}>
          <option value={null}>Seleccione un estudiante</option>
          {#each estudiantesDisponibles as est}
            <option value={est.id_estudiante}>
              {est.nombres} {est.apellido_paterno} {est.apellido_materno}
            </option>
          {/each}
        </select>
        <button 
          class="btn-asignar" 
          on:click={asignarEstudiante}
          disabled={!selectedEstudiante || loading}
        >
          Asignar
        </button>
      </div>
    </div>
  </div>

  <div class="estudiantes-asignados">
    <h4>Estudiantes Asignados ({estudiantesAsignados.length})</h4>
    {#if loading}
      <p>Cargando...</p>
    {:else if estudiantesAsignados.length === 0}
      <p class="empty-message">No hay estudiantes asignados a este curso</p>
    {:else}
      <div class="estudiantes-list">
        {#each estudiantesAsignados as estudiante}
          <div class="estudiante-card">
            <div class="estudiante-avatar">
              {estudiante.nombres.charAt(0)}{estudiante.apellido_paterno.charAt(0)}
            </div>
            <div class="estudiante-info">
              <div class="estudiante-nombre">
                {estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}
              </div>
              {#if estudiante.ci}
                <div class="estudiante-ci">CI: {estudiante.ci}</div>
              {/if}
            </div>
            <button 
              class="btn-desasignar"
              on:click={() => desasignarEstudiante(estudiante.id_estudiante)}
              disabled={loading}
            >
              Desasignar
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .asignar-container {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .section-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0 0 1.5rem 0;
  }

  .alert {
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .alert-error {
    background-color: #fee;
    color: #EF5C52;
    border-left: 3px solid #EF5C52;
  }

  .asignar-form {
    background-color: #f9fafb;
    padding: 1.25rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .input-group {
    display: flex;
    gap: 0.75rem;
  }

  .search-input,
  .select-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .search-input:focus,
  .select-input:focus {
    outline: none;
    border-color: #27C5DA;
  }

  .btn-asignar {
    padding: 0.75rem 1.5rem;
    background-color: #27C5DA;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-asignar:hover:not(:disabled) {
    background-color: #1fb5c9;
  }

  .btn-asignar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .estudiantes-asignados h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .empty-message {
    text-align: center;
    color: #6b7280;
    padding: 2rem;
    background-color: #f9fafb;
    border-radius: 8px;
  }

  .estudiantes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .estudiante-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    border-left: 3px solid #27C5DA;
  }

  .estudiante-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #7A95D9;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .estudiante-info {
    flex: 1;
  }

  .estudiante-nombre {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
  }

  .estudiante-ci {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .btn-desasignar {
    padding: 0.5rem 1rem;
    background-color: #EF5C52;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-desasignar:hover:not(:disabled) {
    background-color: #d94942;
  }

  .btn-desasignar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .input-group {
      flex-direction: column;
    }

    .estudiante-card {
      flex-wrap: wrap;
    }

    .btn-desasignar {
      width: 100%;
    }
  }
</style>
