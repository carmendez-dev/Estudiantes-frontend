<script>
  import { createEventDispatcher } from 'svelte';
  import { cursosApi } from '../../lib/cursosApi.js';

  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  let selectedGestion = '';
  let cursos = [];
  let loading = false;
  let error = null;
  let availableGestiones = [];

  // Generar gestiones disponibles
  function generateGestiones() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear - 1; i++) {
      years.push(i.toString());
    }
    availableGestiones = years.reverse();
  }

  generateGestiones();

  async function buscarCursos() {
    if (!selectedGestion) {
      error = 'Selecciona una gestión';
      return;
    }

    loading = true;
    error = null;
    
    try {
      // Usar el nuevo endpoint simplificado
      const data = await cursosApi.getCursosPorGestion(selectedGestion);
      cursos = data;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function copiarAlPortapapeles() {
    if (cursos.length === 0) return;

    const texto = cursos.map(c => `${c.nombre_curso}\t${c.nivel}`).join('\n');
    
    navigator.clipboard.writeText(texto).then(() => {
      alert('Lista de cursos copiada al portapapeles. Puedes pegarla en Excel o donde necesites.');
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }

  function close() {
    dispatch('close');
  }
</script>

{#if show}
  <div class="modal-overlay" on:click={close}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Exportar Cursos de Gestión Anterior</h2>
        <button class="close-btn" on:click={close}>&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="gestion">Seleccionar Gestión:</label>
          <select id="gestion" bind:value={selectedGestion}>
            <option value="">-- Selecciona una gestión --</option>
            {#each availableGestiones as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>

        <button class="btn-primary" on:click={buscarCursos} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Cursos'}
        </button>

        {#if error}
          <div class="alert alert-error">{error}</div>
        {/if}

        {#if cursos.length > 0}
          <div class="resultados">
            <h3>Cursos encontrados: {cursos.length}</h3>
            
            <div class="info-box">
              <p>📋 Esta lista muestra todos los cursos de la gestión seleccionada.</p>
              <p>Puedes copiar esta información y pegarla en Excel o donde necesites registrar los nuevos cursos.</p>
            </div>

            <div class="cursos-list">
              <div class="list-header">
                <span class="col-nombre">Nombre del Curso</span>
                <span class="col-nivel">Nivel</span>
              </div>
              {#each cursos as curso}
                <div class="curso-item">
                  <span class="curso-nombre">{curso.nombre_curso}</span>
                  <span class="badge badge-{curso.nivel}">{curso.nivel}</span>
                </div>
              {/each}
            </div>

            <button class="btn-copy" on:click={copiarAlPortapapeles}>
              📋 Copiar Lista al Portapapeles
            </button>
          </div>
        {/if}
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
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
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

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
  }

  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
  }

  .btn-primary {
    width: 100%;
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

  .alert {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
  }

  .alert-error {
    background-color: #fee;
    color: #EF5C52;
    border-left: 4px solid #EF5C52;
  }

  .resultados {
    margin-top: 1.5rem;
  }

  .resultados h3 {
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .info-box {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 6px;
  }

  .info-box p {
    margin: 0.25rem 0;
    color: #1e40af;
    font-size: 0.9rem;
  }

  .cursos-list {
    max-height: 350px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 1rem;
    background: white;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
    font-weight: 600;
    color: #374151;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .col-nombre {
    flex: 1;
  }

  .col-nivel {
    width: 120px;
    text-align: center;
  }

  .curso-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.2s;
  }

  .curso-item:hover {
    background-color: #f9fafb;
  }

  .curso-item:last-child {
    border-bottom: none;
  }

  .curso-nombre {
    flex: 1;
    font-weight: 500;
    color: #1f2937;
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .badge-inicial {
    background-color: #fef3c7;
    color: #92400e;
  }

  .badge-primaria {
    background-color: #d1fae5;
    color: #065f46;
  }

  .badge-secundaria {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .btn-copy {
    width: 100%;
    padding: 0.75rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-copy:hover {
    background-color: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
  }
</style>
