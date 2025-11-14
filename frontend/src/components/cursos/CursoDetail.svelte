<script>
  import { createEventDispatcher } from 'svelte';
  import AsignarEstudiantes from './AsignarEstudiantes.svelte';
  import AsignarEstudiantesMasivo from './AsignarEstudiantesMasivo.svelte';
  
  export let curso;

  const dispatch = createEventDispatcher();
  let activeTab = 'info';
  let showAsignarMasivoModal = false;

  function handleClose() {
    dispatch('close');
  }

  function handleEdit() {
    dispatch('edit', curso);
  }

  function handleDelete() {
    if (confirm(`¿Estás seguro de eliminar el curso ${curso.nombre_curso}?`)) {
      dispatch('delete', curso.id_curso);
      dispatch('close');
    }
  }

  function getInitials(nombre) {
    const words = nombre?.split(' ') || [];
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return nombre?.substring(0, 2).toUpperCase() || 'C';
  }

  function getNivelColor(nivel) {
    const colors = {
      'inicial': '#f59e0b',
      'primaria': '#3AC0B8',
      'secundaria': '#7A95D9'
    };
    return colors[nivel] || '#6b7280';
  }
</script>

<div class="modal-content-wrapper">
  <div class="modal-header">
    <h2 class="modal-title">Detalles del Curso</h2>
    <div class="header-actions">
      <button class="btn-secondary" on:click={handleEdit}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Editar
      </button>
      <button class="btn-primary" on:click={handleDelete}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Eliminar Curso
      </button>
    </div>
  </div>

  <div class="modal-header-actions">
    <button class="btn-action-tab" class:active={activeTab === 'info'} on:click={() => activeTab = 'info'}>
      Información
    </button>
    <button class="btn-action-tab" class:active={activeTab === 'estudiantes'} on:click={() => activeTab = 'estudiantes'}>
      Gestionar Estudiantes
    </button>
  </div>

  <div class="modal-body">
    {#if activeTab === 'info'}
      <div class="curso-card">
      <div class="avatar-large" style="background-color: {getNivelColor(curso.nivel)}">
        {getInitials(curso.nombre_curso)}
      </div>
      
      <h3 class="curso-name">{curso.nombre_curso}</h3>
      
      <div class="curso-badges">
        <span class="badge badge-nivel" style="background-color: {getNivelColor(curso.nivel)}">
          {curso.nivel}
        </span>
        <span class="badge badge-gestion">
          Gestión {curso.gestion}
        </span>
      </div>

      <div class="info-section">
        <div class="info-item">
          <span class="info-label">ID del Curso:</span>
          <span class="info-value">{curso.id_curso}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Nombre Completo:</span>
          <span class="info-value">{curso.nombre_curso}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Nivel Educativo:</span>
          <span class="info-value">{curso.nivel}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Gestión Académica:</span>
          <span class="info-value">{curso.gestion}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Estudiantes Inscritos:</span>
          <span class="info-value">
            {#if curso.estudiantes && curso.estudiantes.length > 0}
              {curso.estudiantes.length} estudiante{curso.estudiantes.length > 1 ? 's' : ''}
            {:else}
              Sin estudiantes inscritos
            {/if}
          </span>
        </div>
      </div>

      {#if curso.estudiantes && curso.estudiantes.length > 0}
        <div class="estudiantes-section">
          <h3 class="section-subtitle">Estudiantes Inscritos</h3>
          <div class="estudiantes-list">
            {#each curso.estudiantes as estudiante}
              <div class="estudiante-item">
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
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
    {:else if activeTab === 'estudiantes'}
      <div class="estudiantes-tab">
        <div class="tab-header">
          <h3>Gestión de Estudiantes</h3>
          <button class="btn-masivo" on:click={() => showAsignarMasivoModal = true}>
            Asignar Masivamente
          </button>
        </div>
        <AsignarEstudiantes {curso} on:updated={() => dispatch('updated')} />
      </div>
    {/if}
  </div>

  <AsignarEstudiantesMasivo 
    show={showAsignarMasivoModal}
    on:close={() => showAsignarMasivoModal = false}
    on:success={() => dispatch('updated')}
  />
</div>

<style>
  .modal-content-wrapper {
    background: white;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn-secondary,
  .btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary {
    background-color: #f3f4f6;
    color: #4b5563;
  }

  .btn-secondary:hover {
    background-color: #e5e7eb;
  }

  .btn-primary {
    background-color: #27C5DA;
    color: white;
  }

  .btn-primary:hover {
    background-color: #1fb5c9;
  }

  .modal-body {
    display: flex;
    justify-content: center;
    overflow-y: auto;
    flex: 1;
    padding: 1rem;
  }

  .curso-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    max-width: 500px;
    width: 100%;
    margin-bottom: 1rem;
  }

  .avatar-large {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 2.5rem;
    margin: 0 auto 1.5rem;
  }

  .curso-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .curso-badges {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    color: white;
  }

  .badge-gestion {
    background-color: #6b7280;
  }

  .info-section {
    text-align: left;
    background-color: #f9fafb;
    padding: 1.5rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .info-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .info-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
  }

  .info-value {
    font-size: 0.95rem;
    color: #1f2937;
    font-weight: 500;
  }

  .estudiantes-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e5e7eb;
  }

  .section-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .estudiantes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .estudiante-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 8px;
    border-left: 3px solid #27C5DA;
  }

  .estudiante-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #7A95D9;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .estudiante-info {
    flex: 1;
  }

  .estudiante-nombre {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
  }

  .estudiante-ci {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .modal-header-actions {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
    flex-shrink: 0;
    padding: 0 1.5rem;
  }

  .btn-action-tab {
    flex: 1;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    color: #6b7280;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-action-tab:hover {
    color: #1f2937;
  }

  .btn-action-tab.active {
    color: #27C5DA;
    border-bottom-color: #27C5DA;
  }

  .estudiantes-tab {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .tab-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1f2937;
  }

  .btn-masivo {
    background-color: #7A95D9;
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-masivo:hover {
    background-color: #6a85c9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .modal-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .header-actions {
      width: 100%;
      flex-direction: column;
    }

    .btn-secondary,
    .btn-primary {
      width: 100%;
      justify-content: center;
    }
  }
</style>
