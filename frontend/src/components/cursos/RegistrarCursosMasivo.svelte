<script>
  import { createEventDispatcher } from 'svelte';
  import { cursosApi } from '../../lib/cursosApi.js';

  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  let cursosText = '';
  let gestionDestino = new Date().getFullYear().toString();
  let loading = false;
  let error = null;
  let success = null;
  let availableGestiones = [];

  function generateGestiones() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i.toString());
    }
    availableGestiones = years;
  }

  generateGestiones();

  async function registrarCursos() {
    if (!cursosText.trim()) {
      error = 'Debes pegar la lista de cursos';
      return;
    }

    if (!gestionDestino) {
      error = 'Selecciona una gestión';
      return;
    }

    loading = true;
    error = null;
    success = null;

    try {
      // Parsear el texto pegado (formato: nombre_curso TAB nivel)
      const lineas = cursosText.trim().split('\n');
      const cursos = [];

      for (const linea of lineas) {
        const partes = linea.split('\t');
        if (partes.length >= 2) {
          const nombre_curso = partes[0].trim();
          let nivel = partes[1].trim().toUpperCase();
          
          // Validar que el nivel sea correcto
          if (!['INICIAL', 'PRIMARIA', 'SECUNDARIA'].includes(nivel)) {
            error = `Nivel inválido: ${nivel}. Debe ser INICIAL, PRIMARIA o SECUNDARIA`;
            loading = false;
            return;
          }

          cursos.push({
            nombre_curso,
            nivel,
            gestion: gestionDestino
          });
        }
      }

      if (cursos.length === 0) {
        error = 'No se encontraron cursos válidos. Formato: nombre_curso [TAB] nivel';
        loading = false;
        return;
      }

      // Llamar al endpoint masivo
      const resultado = await cursosApi.createCursosMasivo(cursos);
      
      success = resultado.mensaje || `Se crearon ${resultado.total_creados} cursos exitosamente`;
      
      setTimeout(() => {
        dispatch('success');
        close();
      }, 2000);

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function close() {
    dispatch('close');
    cursosText = '';
    error = null;
    success = null;
  }
</script>

{#if show}
  <div class="modal-overlay" on:click={close}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Registrar Cursos Masivamente</h2>
        <button class="close-btn" on:click={close}>&times;</button>
      </div>

      <div class="modal-body">
        {#if error}
          <div class="alert alert-error">{error}</div>
        {/if}

        {#if success}
          <div class="alert alert-success">{success}</div>
        {/if}

        <div class="info-box">
          <p>📋 <strong>Instrucciones:</strong></p>
          <ul>
            <li>Pega la lista de cursos copiada del exportador</li>
            <li>Formato esperado: <code>nombre_curso [TAB] nivel</code></li>
            <li>Los niveles deben ser: INICIAL, PRIMARIA o SECUNDARIA</li>
            <li>Puedes modificar los nombres antes de registrar</li>
          </ul>
        </div>

        <div class="form-group">
          <label>Gestión de Destino:</label>
          <select bind:value={gestionDestino}>
            {#each availableGestiones as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label>Lista de Cursos (pegar aquí):</label>
          <textarea 
            bind:value={cursosText}
            placeholder="Pega aquí la lista de cursos...&#10;Ejemplo:&#10;Matemáticas Avanzadas	SECUNDARIA&#10;Historia Universal	PRIMARIA&#10;Ciencias Naturales	INICIAL"
            rows="12"
          ></textarea>
          <small class="help-text">
            Cada línea debe tener: nombre_curso [TAB] nivel
          </small>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" on:click={close}>Cancelar</button>
          <button 
            class="btn-primary" 
            on:click={registrarCursos}
            disabled={loading || !cursosText.trim()}
          >
            {loading ? 'Registrando...' : 'Registrar Cursos'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #1f2937;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: #6b7280;
    cursor: pointer;
    line-height: 1;
  }

  .close-btn:hover {
    color: #EF5C52;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    position: sticky;
    bottom: 0;
    background: white;
  }

  .info-box {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 6px;
  }

  .info-box p {
    margin: 0 0 0.5rem 0;
    color: #1e40af;
    font-size: 0.9rem;
  }

  .info-box ul {
    margin: 0.5rem 0 0 1.5rem;
    color: #1e40af;
    font-size: 0.85rem;
  }

  .info-box li {
    margin: 0.25rem 0;
  }

  .info-box code {
    background-color: #dbeafe;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.85em;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
  }

  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-group textarea {
    resize: vertical;
    font-family: monospace;
    font-size: 0.9rem;
  }

  .help-text {
    display: block;
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.85rem;
    font-style: italic;
  }

  .btn-primary {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background-color: #27C5DA;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #1fb5c9;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background-color: #f3f4f6;
    color: #374151;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background-color: #e5e7eb;
  }

  .alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
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
</style>
