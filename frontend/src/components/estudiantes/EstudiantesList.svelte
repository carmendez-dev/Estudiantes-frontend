<script>
  import { createEventDispatcher } from 'svelte';
  
  export let estudiantes = [];
  export let gestionActual = new Date().getFullYear().toString();

  const dispatch = createEventDispatcher();

  const avatarColors = [
    '#7A95D9',
    '#27C5DA',
    '#3AC0B8',
    '#EF5C52',
    '#9b87f5',
    '#f59e0b',
    '#10b981',
    '#ec4899'
  ];

  function getInitials(nombres, apellido) {
    const first = nombres?.charAt(0) || '';
    const last = apellido?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  function getAvatarColor(index) {
    return avatarColors[index % avatarColors.length];
  }

  function handleView(estudiante) {
    dispatch('view', estudiante);
  }

  function handleEdit(estudiante) {
    dispatch('edit', estudiante);
  }

  function handleToggleEstado(estudiante) {
    const accion = estudiante.estado === 'activo' ? 'deshabilitar' : 'habilitar';
    if (confirm(`¿Estás seguro de ${accion} a ${estudiante.nombres} ${estudiante.apellido_paterno}?`)) {
      dispatch('toggleEstado', estudiante.id_estudiante);
    }
  }

  function getCursosGestionActual(estudiante) {
    if (!estudiante.cursos || estudiante.cursos.length === 0) {
      return [];
    }
    return estudiante.cursos.filter(c => c.gestion === gestionActual);
  }

  function getCursosInfo(estudiante) {
    const cursosGestion = getCursosGestionActual(estudiante);
    if (cursosGestion.length === 0) {
      return { nombre: 'Sin curso asignado', nivel: '', gestion: '' };
    }
    const curso = cursosGestion[0];
    return {
      nombre: curso.nombre_curso,
      nivel: curso.nivel,
      gestion: curso.gestion,
      cantidad: cursosGestion.length
    };
  }

</script>

<div class="estudiantes-container">
  <h2 class="list-title">Lista de Estudiantes</h2>
  
  <div class="estudiantes-list">
    {#each estudiantes as estudiante, index (estudiante.id_estudiante)}
      <div class="estudiante-item" class:deshabilitado={estudiante.estado === 'inactivo'}>
        <div class="estudiante-info">
          <div class="avatar" style="background-color: {getAvatarColor(index)}">
            {getInitials(estudiante.nombres, estudiante.apellido_paterno)}
          </div>
          
          <div class="estudiante-details">
            <div class="estudiante-name">
              {estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}
              {#if estudiante.estado === 'inactivo'}
                <span class="badge badge-inactivo">Inactivo</span>
              {/if}
            </div>
            <div class="estudiante-meta">
              {#if getCursosGestionActual(estudiante).length > 0}
                <span class="badge badge-curso">{getCursosInfo(estudiante).nombre}</span>
                <span class="badge badge-nivel">{getCursosInfo(estudiante).nivel}</span>
                <span class="badge badge-gestion">Gestión {getCursosInfo(estudiante).gestion}</span>
                {#if getCursosInfo(estudiante).cantidad > 1}
                  <span class="badge badge-count">+{getCursosInfo(estudiante).cantidad - 1} más</span>
                {/if}
              {:else}
                <span class="badge badge-sin-curso">Sin curso en gestión {gestionActual}</span>
              {/if}
            </div>
          </div>
        </div>

        <div class="estudiante-actions">
          <button 
            class="btn-action btn-view" 
            on:click={() => handleView(estudiante)}
            title="Ver ficha"
          >
            Ver
          </button>
          <button 
            class="btn-action btn-edit" 
            on:click={() => handleEdit(estudiante)}
            title="Editar"
            disabled={estudiante.estado === 'inactivo'}
          >
            Editar
          </button>
          <button 
            class="btn-action" 
            class:btn-delete={estudiante.estado === 'activo'}
            class:btn-enable={estudiante.estado === 'inactivo'}
            on:click={() => handleToggleEstado(estudiante)}
            title={estudiante.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}
          >
            {estudiante.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .estudiantes-container {
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

  .estudiantes-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .estudiante-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid transparent;
    transition: all 0.2s;
  }

  .estudiante-item.deshabilitado {
    opacity: 0.6;
    background-color: #f9fafb;
  }

  .estudiante-item:hover {
    background-color: #f0fdff;
    border-left-color: #27C5DA;
  }

  .estudiante-item.deshabilitado:hover {
    background-color: #f3f4f6;
  }

  .estudiante-info {
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

  .estudiante-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .estudiante-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .estudiante-meta {
    display: flex;
    gap: 0.5rem;
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .badge-curso {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .badge-nivel {
    background-color: #f3f4f6;
    color: #6b7280;
    text-transform: capitalize;
  }

  .badge-count {
    background-color: #27C5DA;
    color: white;
  }

  .badge-sin-curso {
    background-color: #fee;
    color: #EF5C52;
  }

  .badge-gestion {
    background-color: #e0f2fe;
    color: #075985;
  }

  .badge-inactivo {
    background-color: #fef3c7;
    color: #92400e;
    margin-left: 0.5rem;
  }

  .estudiante-actions {
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

  .btn-action:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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

  .btn-edit:hover:not(:disabled) {
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

  .btn-enable {
    background-color: #10b981;
    color: white;
  }

  .btn-enable:hover {
    background-color: #059669;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .estudiante-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .estudiante-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
