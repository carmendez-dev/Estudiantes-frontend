<script>
  import { createEventDispatcher } from 'svelte';
  
  export let estudiante;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }

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
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function getInitials(nombres, apellido) {
    const first = nombres?.charAt(0) || '';
    const last = apellido?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  function getGradeLevel() {
    return 'Primaria';
  }

  function getGrade() {
    return '5to A';
  }
</script>

<div class="modal-content-wrapper">
  <div class="modal-header">
    <h2 class="modal-title">Ficha del Estudiante</h2>
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
        Eliminar Estudiante
      </button>
    </div>
  </div>

  <div class="modal-body">
    <div class="left-column">
      <div class="profile-card">
        <div class="avatar-wrapper">
          <div class="avatar-large">
            {getInitials(estudiante.nombres, estudiante.apellido_paterno)}
          </div>
        </div>
        <h3 class="student-name">{estudiante.nombres} {estudiante.apellido_paterno}</h3>
        <p class="student-grade">{getGrade()} | {getGradeLevel()}</p>
      </div>

      <div class="contact-card">
        <h4 class="card-title">Información de Contacto</h4>
        <div class="contact-item">
          <svg class="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5"/>
            <path d="m2 5 8 6 8-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <div>
            <p class="contact-label">Email</p>
            <p class="contact-value">{estudiante.nombres?.toLowerCase()}.{estudiante.apellido_paterno?.toLowerCase()}@email.edu</p>
          </div>
        </div>
        <div class="contact-item">
          <svg class="contact-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18 14v2a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 7 13.82 19.5 19.5 0 0 1 2 5.18 2 2 0 0 1 4 3h2a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10.8a16 16 0 0 0 6.11 6.11l1.17-1.17a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 18 14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <p class="contact-label">Teléfono</p>
            <p class="contact-value">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>

    <div class="right-column">
      <div class="info-sections-row">
        <div class="info-section">
          <h3 class="section-title">Datos Personales</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Fecha de Nacimiento:</span>
              <span class="info-value">{formatDate(estudiante.fecha_nacimiento)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CI/CURP:</span>
              <span class="info-value">{estudiante.ci || 'No especificado'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Dirección:</span>
              <span class="info-value">{estudiante.direccion || 'No especificada'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cursos Asignados:</span>
              <span class="info-value">
                {#if estudiante.cursos && estudiante.cursos.length > 0}
                  {estudiante.cursos.length} curso{estudiante.cursos.length > 1 ? 's' : ''}
                {:else}
                  Sin cursos asignados
                {/if}
              </span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información del Padre</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Nombre Padre:</span>
              <span class="info-value">{estudiante.nombre_padre || ''} {estudiante.apellido_paterno_padre || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Teléfono Padre:</span>
              <span class="info-value">{estudiante.telefono_padre || 'No especificado'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{estudiante.nombre_padre ? `${estudiante.nombre_padre.toLowerCase()}.${estudiante.apellido_paterno_padre?.toLowerCase() || ''}@email.com` : 'No especificado'}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información de la Madre</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Nombre Madre:</span>
              <span class="info-value">{estudiante.nombre_madre || ''} {estudiante.apellido_paterno_madre || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Teléfono Madre:</span>
              <span class="info-value">{estudiante.telefono_madre || 'No especificado'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{estudiante.nombre_madre ? `${estudiante.nombre_madre.toLowerCase()}.${estudiante.apellido_paterno_madre?.toLowerCase() || ''}@email.com` : 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      {#if estudiante.cursos && estudiante.cursos.length > 0}
        <div class="cursos-section">
          <h3 class="section-title">Cursos Asignados</h3>
          <div class="cursos-list">
            {#each estudiante.cursos as curso}
              <div class="curso-badge">
                <span class="curso-nombre">{curso.nombre_curso}</span>
                <span class="curso-nivel">{curso.nivel}</span>
                <span class="curso-gestion">Gestión {curso.gestion}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-content-wrapper {
    background: white;
    overflow: visible;
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
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.25rem;
    overflow-y: auto;
    flex: 1;
    padding: 1.5rem;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .profile-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;
  }

  .avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 0.75rem;
  }

  .avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #7A95D9;
    border: 3px solid #27C5DA;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 2rem;
  }

  .student-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  .student-grade {
    font-size: 0.85rem;
    color: #6b7280;
    margin: 0;
  }

  .contact-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem;
  }

  .card-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.75rem 0;
  }

  .contact-item {
    display: flex;
    gap: 0.625rem;
    margin-bottom: 0.75rem;
  }

  .contact-item:last-child {
    margin-bottom: 0;
  }

  .contact-icon {
    flex-shrink: 0;
    color: #6b7280;
  }

  .contact-label {
    font-size: 0.75rem;
    color: #9ca3af;
    margin: 0 0 0.25rem 0;
  }

  .contact-value {
    font-size: 0.875rem;
    color: #1f2937;
    margin: 0;
    word-break: break-word;
  }

  .right-column {
    display: flex;
    flex-direction: column;
  }

  .info-sections-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .info-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .section-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.75rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f3f4f6;
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }

  .info-value {
    font-size: 0.85rem;
    color: #1f2937;
    font-weight: 400;
    word-break: break-word;
  }

  .cursos-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e5e7eb;
  }

  .cursos-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .curso-badge {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background-color: #f0fdff;
    border: 1px solid #27C5DA;
    border-radius: 8px;
  }

  .curso-nombre {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
  }

  .curso-nivel {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: capitalize;
  }

  .curso-gestion {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  @media (max-width: 1200px) {
    .info-sections-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1024px) {
    .modal-body {
      grid-template-columns: 1fr;
    }

    .left-column {
      order: 2;
    }

    .right-column {
      order: 1;
    }
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
