<script>
  import { onMount } from 'svelte';
  import { cursosApi } from '../lib/cursosApi.js';
  import { cursos, loadingCursos, errorCursos, successCursos } from '../lib/cursosStore.js';
  import CursosList from '../components/cursos/CursosList.svelte';
  import CursoForm from '../components/cursos/CursoForm.svelte';
  import CursoDetail from '../components/cursos/CursoDetail.svelte';
  import ExportarCursos from '../components/cursos/ExportarCursos.svelte';
  import CopiarEstudiantes from '../components/cursos/CopiarEstudiantes.svelte';
  import RegistrarCursosMasivo from '../components/cursos/RegistrarCursosMasivo.svelte';
  import Modal from '../components/Modal.svelte';

  let showModal = false;
  let showDetailModal = false;
  let showExportarModal = false;
  let showCopiarModal = false;
  let showRegistrarMasivoModal = false;
  let editingCurso = null;
  let viewingCurso = null;
  let searchTerm = '';
  let filterNivel = 'Todos los niveles';
  let filterGestion = new Date().getFullYear().toString();
  let availableGestiones = [];

  onMount(() => {
    loadCursos();
    generateGestiones();
  });

  function generateGestiones() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i.toString());
    }
    availableGestiones = years.reverse();
  }

  async function loadCursos() {
    $loadingCursos = true;
    $errorCursos = null;
    try {
      const nivel = filterNivel === 'Todos los niveles' ? null : filterNivel.toLowerCase();
      const gestion = filterGestion === 'Todas las gestiones' ? null : filterGestion;
      const data = await cursosApi.getCursos(0, 100, nivel, gestion);
      $cursos = data;
    } catch (err) {
      $errorCursos = err.message;
    } finally {
      $loadingCursos = false;
    }
  }

  function openCreateModal() {
    editingCurso = null;
    showModal = true;
  }

  function openEditModal(event) {
    editingCurso = event.detail;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingCurso = null;
  }

  async function openDetailModal(event) {
    $loadingCursos = true;
    try {
      const curso = await cursosApi.getCurso(event.detail.id_curso);
      viewingCurso = curso;
      showDetailModal = true;
    } catch (err) {
      $errorCursos = err.message;
    } finally {
      $loadingCursos = false;
    }
  }

  function closeDetailModal() {
    showDetailModal = false;
    viewingCurso = null;
  }

  async function handleCursoUpdated() {
    if (viewingCurso) {
      try {
        const curso = await cursosApi.getCurso(viewingCurso.id_curso);
        viewingCurso = curso;
      } catch (err) {
        $errorCursos = err.message;
      }
    }
    await loadCursos();
  }

  function handleEditFromDetail(event) {
    closeDetailModal();
    editingCurso = event.detail;
    showModal = true;
  }

  async function handleSubmit(event) {
    $loadingCursos = true;
    $errorCursos = null;
    $successCursos = null;

    try {
      if (editingCurso) {
        await cursosApi.updateCurso(editingCurso.id_curso, event.detail);
        $successCursos = 'Curso actualizado exitosamente';
      } else {
        await cursosApi.createCurso(event.detail);
        $successCursos = 'Curso creado exitosamente';
      }
      await loadCursos();
      closeModal();
      
      setTimeout(() => {
        $successCursos = null;
      }, 3000);
    } catch (err) {
      $errorCursos = err.message;
    } finally {
      $loadingCursos = false;
    }
  }

  async function handleDelete(event) {
    $loadingCursos = true;
    $errorCursos = null;
    $successCursos = null;

    try {
      await cursosApi.deleteCurso(event.detail);
      $successCursos = 'Curso eliminado exitosamente';
      await loadCursos();
      
      setTimeout(() => {
        $successCursos = null;
      }, 3000);
    } catch (err) {
      $errorCursos = err.message;
    } finally {
      $loadingCursos = false;
    }
  }

  $: filteredCursos = $cursos.filter(curso => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = curso.nombre_curso?.toLowerCase().includes(search);
    return matchesSearch;
  });
</script>

<div class="page-content">
  {#if $errorCursos}
    <div class="alert alert-error">
      {$errorCursos}
    </div>
  {/if}

  {#if $successCursos}
    <div class="alert alert-success">
      {$successCursos}
    </div>
  {/if}

  <div class="page-header">
    <div>
      <h1 class="page-title">Gestión de Cursos</h1>
      <p class="page-subtitle">Administra los cursos del sistema educativo</p>
    </div>
    <div class="header-buttons">
      <button class="btn-secondary" on:click={() => showExportarModal = true}>
        Exportar Cursos
      </button>
      <button class="btn-secondary" on:click={() => showRegistrarMasivoModal = true}>
        Registrar Masivo
      </button>
      <button class="btn-secondary" on:click={() => showCopiarModal = true}>
        Ver Estudiantes
      </button>
      <button class="btn-nuevo" on:click={openCreateModal}>
        + Nuevo Curso
      </button>
    </div>
  </div>

  <div class="search-filter-bar">
    <div class="search-input-wrapper">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input 
        type="text" 
        class="search-input"
        placeholder="Buscar por nombre de curso..." 
        bind:value={searchTerm}
      />
    </div>
    <div class="filter-wrapper">
      <svg class="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 4h16M5 10h10M8 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <select class="filter-select" bind:value={filterNivel} on:change={loadCursos}>
        <option>Todos los niveles</option>
        <option>Inicial</option>
        <option>Primaria</option>
        <option>Secundaria</option>
      </select>
    </div>
    <div class="filter-wrapper">
      <svg class="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2"/>
        <path d="M3 9h14M9 3v4M15 3v4" stroke="currentColor" stroke-width="2"/>
      </svg>
      <select class="filter-select" bind:value={filterGestion} on:change={loadCursos}>
        <option value="Todas las gestiones">Todas las gestiones</option>
        {#each availableGestiones as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if $loadingCursos}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Cargando cursos...</p>
    </div>
  {:else if filteredCursos.length === 0}
    <div class="empty-state">
      <h2>No hay cursos registrados</h2>
      <p>Comienza agregando tu primer curso</p>
      <button class="btn-nuevo" on:click={openCreateModal}>
        + Nuevo Curso
      </button>
    </div>
  {:else}
    <CursosList 
      cursos={filteredCursos}
      on:view={openDetailModal}
      on:edit={openEditModal}
      on:delete={handleDelete}
    />
  {/if}

  <Modal 
    show={showModal} 
    title={editingCurso ? 'Editar Curso' : 'Nuevo Curso'}
    onClose={closeModal}
  >
    <CursoForm 
      curso={editingCurso}
      isEditing={!!editingCurso}
      on:submit={handleSubmit}
      on:cancel={closeModal}
    />
  </Modal>

  <Modal 
    show={showDetailModal} 
    title="Detalles del Curso"
    onClose={closeDetailModal}
  >
    {#if viewingCurso}
      <CursoDetail 
        curso={viewingCurso}
        on:close={closeDetailModal}
        on:edit={handleEditFromDetail}
        on:delete={handleDelete}
        on:updated={handleCursoUpdated}
      />
    {/if}
  </Modal>

  <ExportarCursos 
    show={showExportarModal}
    on:close={() => showExportarModal = false}
  />

  <RegistrarCursosMasivo 
    show={showRegistrarMasivoModal}
    on:close={() => showRegistrarMasivoModal = false}
    on:success={loadCursos}
  />

  <CopiarEstudiantes 
    show={showCopiarModal}
    on:close={() => showCopiarModal = false}
  />
</div>

<style>
  .page-content {
    padding: 0;
  }

  .alert {
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
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

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .page-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }

  .header-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .btn-nuevo {
    background-color: #27C5DA;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(39, 197, 218, 0.2);
  }

  .btn-nuevo:hover {
    background-color: #1fb5c9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(39, 197, 218, 0.3);
  }

  .btn-secondary {
    background-color: #7A95D9;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(122, 149, 217, 0.2);
  }

  .btn-secondary:hover {
    background-color: #6a85c9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(122, 149, 217, 0.3);
  }

  .search-filter-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .search-input-wrapper {
    position: relative;
    flex: 1;
    max-width: 500px;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: white;
  }

  .search-input:focus {
    outline: none;
    border-color: #27C5DA;
  }

  .filter-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .filter-icon {
    position: absolute;
    left: 1rem;
    color: #9ca3af;
    pointer-events: none;
  }

  .filter-select {
    padding: 0.75rem 2.5rem 0.75rem 3rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: white;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239ca3af' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
  }

  .filter-select:focus {
    outline: none;
    border-color: #27C5DA;
  }

  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e5e7eb;
    border-top-color: #27C5DA;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .empty-state h2 {
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
    }

    .search-filter-bar {
      flex-direction: column;
    }

    .search-input-wrapper {
      max-width: 100%;
    }
  }
</style>
