<script>
  import { createEventDispatcher } from 'svelte';
  
  export let curso = null;
  export let isEditing = false;

  const dispatch = createEventDispatcher();

  let formData = {
    nombre_curso: '',
    nivel: '',
    gestion: ''
  };

  $: if (curso) {
    formData = { ...curso };
  }

  function handleSubmit() {
    dispatch('submit', formData);
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="form-container">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-body">
      <div class="form-section">
        <h3 class="section-title">Información del Curso</h3>
        <div class="form-grid">
          <div class="input-group full-width">
            <label for="nombre_curso">Nombre del Curso <span class="required">*</span></label>
            <input 
              type="text" 
              id="nombre_curso" 
              name="nombre_curso"
              bind:value={formData.nombre_curso} 
              required 
              placeholder="Ej: 1ro de Primaria A"
              class="form-input"
              maxlength="50"
            />
          </div>

          <div class="input-group">
            <label for="nivel">Nivel <span class="required">*</span></label>
            <select 
              id="nivel" 
              name="nivel"
              bind:value={formData.nivel} 
              required
              class="form-input"
            >
              <option value="">Seleccione un nivel</option>
              <option value="inicial">Inicial</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </select>
          </div>

          <div class="input-group">
            <label for="gestion">Gestión <span class="required">*</span></label>
            <input 
              type="text" 
              id="gestion" 
              name="gestion"
              bind:value={formData.gestion} 
              required 
              placeholder="Ej: 2024"
              class="form-input"
              maxlength="20"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button type="button" class="btn btn-cancel" on:click={handleCancel}>
        Cancelar
      </button>
      <button type="submit" class="btn btn-save">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.333 7.333v5.334a1.333 1.333 0 0 1-1.333 1.333H4a1.333 1.333 0 0 1-1.333-1.333V4A1.333 1.333 0 0 1 4 2.667h5.333M12 2l2 2M14 4l-7.333 7.333-2.667.667.667-2.667L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {isEditing ? 'Actualizar Curso' : 'Guardar Curso'}
      </button>
    </div>
  </form>
</div>

<style>
  .form-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  form {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .form-body {
    padding: 0.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .form-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #27C5DA;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group.full-width {
    grid-column: 1 / -1;
  }

  .input-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .required {
    color: #EF5C52;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #1f2937;
    transition: all 0.2s;
    background-color: white;
  }

  .form-input:focus {
    outline: none;
    border-color: #27C5DA;
    box-shadow: 0 0 0 3px rgba(39, 197, 218, 0.1);
  }

  select.form-input {
    cursor: pointer;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.25rem;
    border-top: 2px solid #e5e7eb;
    background-color: #f9fafb;
    border-radius: 0 0 12px 12px;
    flex-shrink: 0;
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel {
    background-color: #f3f4f6;
    color: #4b5563;
  }

  .btn-cancel:hover {
    background-color: #e5e7eb;
  }

  .btn-save {
    background-color: #27C5DA;
    color: white;
  }

  .btn-save:hover {
    background-color: #1fb5c9;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(39, 197, 218, 0.3);
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-footer {
      flex-direction: column;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
