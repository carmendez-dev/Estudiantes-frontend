<script>
  import { onMount } from 'svelte';
  import { api } from './lib/api.js';
  import { estudiantes, loading, error, success } from './lib/stores.js';
  import Sidebar from './components/Sidebar.svelte';
  import Header from './components/Header.svelte';
  import EstudiantesList from './components/estudiantes/EstudiantesList.svelte';
  import EstudianteForm from './components/estudiantes/EstudianteForm.svelte';
  import EstudianteDetail from './components/estudiantes/EstudianteDetail.svelte';
  import CursosPage from './pages/CursosPage.svelte';
  import Modal from './components/Modal.svelte';

  let currentPage = 'estudiantes';
  let showModal = false;
  let showDetailModal = false;
  let editingEstudiante = null;
  let viewingEstudiante = null;
  let searchTerm = '';
  let filterLevel = 'Todos los niveles';
  let gestionActual = new Date().getFullYear().toString();

  onMount(() => {
    loadEstudiantes();
  });

  async function loadEstudiantes() {
    $loading = true;
    $error = null;
    try {
      const data = await api.getEstudiantes();
      // El estado viene del backend (habilitado/inhabilitado)
      $estudiantes = data;
    } catch (err) {
      $error = err.message;
    } finally {
      $loading = false;
    }
  }

  function openCreateModal() {
    editingEstudiante = null;
    showModal = true;
  }

  function openEditModal(event) {
    editingEstudiante = event.detail;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingEstudiante = null;
  }

  async function openDetailModal(event) {
    $loading = true;
    try {
      const estudiante = await api.getEstudiante(event.detail.id_estudiante);
      viewingEstudiante = estudiante;
      showDetailModal = true;
    } catch (err) {
      $error = err.message;
    } finally {
      $loading = false;
    }
  }

  function closeDetailModal() {
    showDetailModal = false;
    viewingEstudiante = null;
  }

  function handleEditFromDetail(event) {
    closeDetailModal();
    editingEstudiante = event.detail;
    showModal = true;
  }

  async function handleSubmit(event) {
    $loading = true;
    $error = null;
    $success = null;

    try {
      if (editingEstudiante) {
        await api.updateEstudiante(editingEstudiante.id_estudiante, event.detail);
        $success = 'Estudiante actualizado exitosamente';
      } else {
        await api.createEstudiante(event.detail);
        $success = 'Estudiante creado exitosamente';
      }
      await loadEstudiantes();
      closeModal();
      
      setTimeout(() => {
        $success = null;
      }, 3000);
    } catch (err) {
      $error = err.message;
    } finally {
      $loading = false;
    }
  }

  async function handleDelete(event) {
    $loading = true;
    $error = null;
    $success = null;

    try {
      await api.deleteEstudiante(event.detail);
      $success = 'Estudiante eliminado exitosamente';
      await loadEstudiantes();
      
      setTimeout(() => {
        $success = null;
      }, 3000);
    } catch (err) {
      $error = err.message;
    } finally {
      $loading = false;
    }
  }

  async function handleToggleEstado(event) {
    const idEstudiante = event.detail;
    $loading = true;
    $error = null;
    $success = null;

    try {
      // Encontrar el estudiante
      const estudiante = $estudiantes.find(e => e.id_estudiante === idEstudiante);
      if (!estudiante) return;

      // Cambiar el estado en el backend
      const nuevoEstado = estudiante.estado_estudiante === 'habilitado' ? 'inhabilitado' : 'habilitado';
      await api.cambiarEstadoEstudiante(idEstudiante, nuevoEstado);

      // Actualizar la lista
      await loadEstudiantes();
      
      $success = `Estudiante ${nuevoEstado === 'habilitado' ? 'habilitado' : 'inhabilitado'} exitosamente`;
      setTimeout(() => {
        $success = null;
      }, 3000);
    } catch (err) {
      $error = err.message;
    } finally {
      $loading = false;
    }
  }

  $: filteredEstudiantes = $estudiantes.filter(est => {
    const search = searchTerm.toLowerCase();
    return (
      est.nombres?.toLowerCase().includes(search) ||
      est.apellido_paterno?.toLowerCase().includes(search) ||
      est.apellido_materno?.toLowerCase().includes(search) ||
      est.ci?.includes(search)
    );
  });
</script>

<div class="app-layout">
  <Sidebar bind:currentPage />
  
  <div class="main-content">
    <Header />
    
    <main class="content-area">
      {#if currentPage === 'estudiantes'}
        {#if $error}
          <div class="alert alert-error">
            {$error}
          </div>
        {/if}

        {#if $success}
          <div class="alert alert-success">
            {$success}
          </div>
        {/if}

        <div class="page-header">
          <div>
            <h1 class="page-title">Estudiantes y Cursos</h1>
            <p class="page-subtitle">Gestiona la información de los estudiantes</p>
          </div>
          <button class="btn-nuevo" on:click={openCreateModal}>
            + Nuevo Estudiante
          </button>
        </div>

        <div class="search-filter-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              class="search-input"
              placeholder="Buscar por nombre o curso..." 
              bind:value={searchTerm}
            />
          </div>
          <div class="filter-wrapper">
            <svg class="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2"/>
              <path d="M3 9h14M9 3v4M15 3v4" stroke="currentColor" stroke-width="2"/>
            </svg>
            <select class="filter-select" bind:value={gestionActual}>
              <option value="{(new Date().getFullYear() - 1).toString()}">{new Date().getFullYear() - 1}</option>
              <option value="{new Date().getFullYear().toString()}">{new Date().getFullYear()}</option>
              <option value="{(new Date().getFullYear() + 1).toString()}">{new Date().getFullYear() + 1}</option>
            </select>
          </div>
          <div class="filter-wrapper">
            <svg class="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 4h16M5 10h10M8 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <select class="filter-select" bind:value={filterLevel}>
              <option>Todos los niveles</option>
              <option>Primaria</option>
              <option>Secundaria</option>
            </select>
          </div>
        </div>

        {#if $loading}
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando estudiantes...</p>
          </div>
        {:else if filteredEstudiantes.length === 0}
          <div class="empty-state">
            <h2>No hay estudiantes registrados</h2>
            <p>Comienza agregando tu primer estudiante</p>
            <button class="btn-nuevo" on:click={openCreateModal}>
              + Nuevo Estudiante
            </button>
          </div>
        {:else}
          <EstudiantesList 
            estudiantes={filteredEstudiantes}
            gestionActual={gestionActual}
            on:view={openDetailModal}
            on:edit={openEditModal}
            on:delete={handleDelete}
            on:toggleEstado={handleToggleEstado}
          />
        {/if}

        <Modal 
          show={showModal} 
          title={editingEstudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
          onClose={closeModal}
        >
          <EstudianteForm 
            estudiante={editingEstudiante}
            isEditing={!!editingEstudiante}
            on:submit={handleSubmit}
            on:cancel={closeModal}
          />
        </Modal>

        <Modal 
          show={showDetailModal} 
          title="Ficha del Estudiante"
          onClose={closeDetailModal}
        >
          {#if viewingEstudiante}
            <EstudianteDetail 
              estudiante={viewingEstudiante}
              on:close={closeDetailModal}
              on:edit={handleEditFromDetail}
              on:delete={handleDelete}
            />
          {/if}
        </Modal>
      {:else if currentPage === 'cursos'}
        <CursosPage />
      {/if}
    </main>
  </div>
</div>

<style>
  .app-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
  }

  .main-content {
    flex: 1;
    margin-left: 250px;
    display: flex;
    flex-direction: column;
  }

  .content-area {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
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
    .main-content {
      margin-left: 0;
    }

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
