<script>
  import { createEventDispatcher } from 'svelte';
  
  export let estudiante;

  const dispatch = createEventDispatcher();

  function handleEdit() {
    dispatch('edit', estudiante);
  }

  function handleDelete() {
    if (confirm(`¿Estás seguro de eliminar a ${estudiante.nombres} ${estudiante.apellido_paterno}?`)) {
      dispatch('delete', estudiante.id_estudiante);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
</script>

<div class="card estudiante-card">
  <div class="card-header">
    <div class="student-name">
      <h3>{estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}</h3>
      {#if estudiante.ci}
        <span class="ci-badge">CI: {estudiante.ci}</span>
      {/if}
    </div>
    <div class="card-actions">
      <button class="btn-icon btn-edit" on:click={handleEdit} title="Editar">
        Editar
      </button>
      <button class="btn-icon btn-delete" on:click={handleDelete} title="Eliminar">
        Eliminar
      </button>
    </div>
  </div>

  <div class="card-body">
    <div class="info-row">
      <span class="label">Fecha de Nacimiento:</span>
      <span class="value">{formatDate(estudiante.fecha_nacimiento)}</span>
    </div>

    {#if estudiante.direccion}
      <div class="info-row">
        <span class="label">Dirección:</span>
        <span class="value">{estudiante.direccion}</span>
      </div>
    {/if}

    {#if estudiante.nombre_padre || estudiante.telefono_padre}
      <div class="parent-info">
        <strong>Padre:</strong>
        {estudiante.nombre_padre || ''} 
        {estudiante.apellido_paterno_padre || ''} 
        {estudiante.apellido_materno_padre || ''}
        {#if estudiante.telefono_padre}
          <span class="phone">Tel: {estudiante.telefono_padre}</span>
        {/if}
      </div>
    {/if}

    {#if estudiante.nombre_madre || estudiante.telefono_madre}
      <div class="parent-info">
        <strong>Madre:</strong>
        {estudiante.nombre_madre || ''} 
        {estudiante.apellido_paterno_madre || ''} 
        {estudiante.apellido_materno_madre || ''}
        {#if estudiante.telefono_madre}
          <span class="phone">Tel: {estudiante.telefono_madre}</span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .estudiante-card {
    border-left: 4px solid var(--azul-celeste);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--gris-medio);
  }

  .student-name h3 {
    color: var(--azul-oscuro);
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .ci-badge {
    display: inline-block;
    background-color: var(--azul-pastel);
    color: var(--blanco);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
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

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-row {
    display: flex;
    gap: 0.5rem;
  }

  .label {
    font-weight: 600;
    color: var(--azul-oscuro);
  }

  .value {
    color: #555;
  }

  .parent-info {
    padding: 0.75rem;
    background-color: var(--gris-claro);
    border-radius: 8px;
    border-left: 3px solid var(--turquesa);
  }

  .parent-info strong {
    color: var(--azul-oscuro);
    margin-right: 0.5rem;
  }

  .phone {
    display: inline-block;
    margin-left: 0.5rem;
    color: var(--turquesa);
    font-weight: 600;
  }
</style>
