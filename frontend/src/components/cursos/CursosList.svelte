<script>
  import { createEventDispatcher } from 'svelte';
  
  export let cursos = [];

  const dispatch = createEventDispatcher();

  const avatarColors = ['#7A95D9', '#27C5DA', '#3AC0B8', '#EF5C52', '#9b87f5', '#f59e0b'];

  function getInitials(nombre) {
    const words = nombre?.split(' ') || [];
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return nombre?.substring(0, 2).toUpperCase() || 'C';
  }

  function getAvatarColor(index) {
    return avatarColors[index % avatarColors.length];
  }

  function handleView(curso) {
    dispatch('view', curso);
  }

  function handleEdit(curso) {
    dispatch('edit', curso);
  }

  function handleDelete(id, nombre) {
    if (confirm(`¿Estás seguro de eliminar el curso ${nombre}?`)) {
      dispatch('delete', id);
    }
  }

  function getNivelBadgeColor(nivel) {
    const colors = {
      'inicial': '#f59e0b',
      'primaria': '#3AC0B8',
      'secundaria': '#7A95D9'
    };
    return colors[nivel] || '#6b7280';
  }
</script>

<div class="cursos-container">
  <h2 class="list-title">Lista de Cursos</h2>
  
  <div class="cursos-list">
    {#each cursos as curso, index (curso.id_curso)}
      <div class="curso-item">
        <div class="curso-info">
          <div class="avatar" style="background-color: {getAvatarColor(index)}">
            {getInitials(curso.nombre_curso)}
          </div>
          
          <div class="curso-details">
            <div class="curso-name">{curso.nombre_curso}</div>
            <div class="curso-meta">
              <span class="badge" style="background-color: {getNivelBadgeColor(curso.nivel)}; color: white;">
                {curso.nivel}
              </span>
              <span class="badge badge-gestion">Gestión {curso.gestion}</span>
            </div>
          </div>
        </div>

        <div class="curso-actions">
          <button 
            class="btn-action btn-view" 
            on:click={() => handleView(curso)}
            title="Ver detalles"
          >
            Ver
          </button>
          <button 
            class="btn-action btn-edit" 
            on:click={() => handleEdit(curso)}
            title="Editar"
          >
            Editar
          </button>
          <button 
            class="btn-action btn-delete" 
            on:click={() => handleDelete(curso.id_curso, curso.nombre_curso)}
            title="Eliminar"
          >
            Eliminar
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .cursos-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .list-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .cursos-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .curso-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid transparent;
    transition: all 0.2s;
  }

  .curso-item:hover {
    background-color: #f0fdff;
    border-left-color: #27C5DA;
  }

  .curso-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .curso-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .curso-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .curso-meta {
    display: flex;
    gap: 0.5rem;
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .badge-gestion {
    background-color: #f3f4f6;
    color: #6b7280;
  }

  .curso-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-action {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-view {
    background-color: #3AC0B8;
    color: white;
  }

  .btn-view:hover {
    background-color: #2aa89f;
    transform: translateY(-1px);
  }

  .btn-edit {
    background-color: #7A95D9;
    color: white;
  }

  .btn-edit:hover {
    background-color: #6a85c9;
    transform: translateY(-1px);
  }

  .btn-delete {
    background-color: #EF5C52;
    color: white;
  }

  .btn-delete:hover {
    background-color: #d94942;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .curso-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .curso-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
