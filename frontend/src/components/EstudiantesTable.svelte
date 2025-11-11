<script>
  import { createEventDispatcher } from 'svelte';
  
  export let estudiantes = [];

  const dispatch = createEventDispatcher();

  function handleEdit(estudiante) {
    dispatch('edit', estudiante);
  }

  function handleDelete(id, nombre) {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      dispatch('delete', id);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }
</script>

<div class="table-container">
  <table class="estudiantes-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>CI</th>
        <th>Nombres</th>
        <th>Apellido Paterno</th>
        <th>Apellido Materno</th>
        <th>Fecha Nacimiento</th>
        <th>Dirección</th>
        <th>Padre</th>
        <th>Tel. Padre</th>
        <th>Madre</th>
        <th>Tel. Madre</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each estudiantes as estudiante (estudiante.id_estudiante)}
        <tr>
          <td class="id-cell">{estudiante.id_estudiante}</td>
          <td>{estudiante.ci || '-'}</td>
          <td class="nombre-cell">{estudiante.nombres}</td>
          <td>{estudiante.apellido_paterno}</td>
          <td>{estudiante.apellido_materno}</td>
          <td>{formatDate(estudiante.fecha_nacimiento)}</td>
          <td class="direccion-cell">{estudiante.direccion || '-'}</td>
          <td>
            {#if estudiante.nombre_padre}
              {estudiante.nombre_padre} {estudiante.apellido_paterno_padre || ''} {estudiante.apellido_materno_padre || ''}
            {:else}
              -
            {/if}
          </td>
          <td>{estudiante.telefono_padre || '-'}</td>
          <td>
            {#if estudiante.nombre_madre}
              {estudiante.nombre_madre} {estudiante.apellido_paterno_madre || ''} {estudiante.apellido_materno_madre || ''}
            {:else}
              -
            {/if}
          </td>
          <td>{estudiante.telefono_madre || '-'}</td>
          <td class="actions-cell">
            <button 
              class="btn-icon btn-edit" 
              on:click={() => handleEdit(estudiante)}
              title="Editar"
            >
              Editar
            </button>
            <button 
              class="btn-icon btn-delete" 
              on:click={() => handleDelete(estudiante.id_estudiante, `${estudiante.nombres} ${estudiante.apellido_paterno}`)}
              title="Eliminar"
            >
              Eliminar
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    background: var(--blanco);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(11, 46, 80, 0.1);
    overflow-x: auto;
  }

  .estudiantes-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  thead {
    background: linear-gradient(135deg, var(--azul-oscuro) 0%, var(--azul-pastel) 100%);
    color: var(--blanco);
  }

  thead th {
    padding: 1rem 0.75rem;
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tbody tr {
    border-bottom: 1px solid var(--gris-medio);
    transition: background-color 0.2s ease;
  }

  tbody tr:hover {
    background-color: rgba(122, 149, 217, 0.1);
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  td {
    padding: 1rem 0.75rem;
    color: var(--azul-oscuro);
  }

  .id-cell {
    font-weight: 600;
    color: var(--azul-celeste);
  }

  .nombre-cell {
    font-weight: 600;
    color: var(--azul-oscuro);
  }

  .direccion-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .btn-icon {
    border: none;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-weight: 600;
    color: var(--blanco);
  }

  .btn-edit {
    background-color: var(--azul-pastel);
  }

  .btn-edit:hover {
    background-color: #6a85c9;
    transform: translateY(-2px);
  }

  .btn-delete {
    background-color: var(--rojo-coral);
  }

  .btn-delete:hover {
    background-color: #d94942;
    transform: translateY(-2px);
  }

  @media (max-width: 1200px) {
    .estudiantes-table {
      font-size: 0.85rem;
    }

    thead th,
    td {
      padding: 0.75rem 0.5rem;
    }
  }
</style>
