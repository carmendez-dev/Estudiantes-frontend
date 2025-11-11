<script>
  export let show = false;
  export let title = '';
  export let onClose = () => {};
</script>

{#if show}
  <div class="modal-overlay" on:click={onClose}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{title}</h2>
        <button class="close-btn" on:click={onClose}>&times;</button>
      </div>
      <div class="modal-body">
        <slot />
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
    background-color: rgba(11, 46, 80, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: var(--blanco);
    border-radius: 16px;
    width: 95%;
    max-width: 1200px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(11, 46, 80, 0.3);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 2px solid var(--gris-medio);
    flex-shrink: 0;
  }

  .modal-header h2 {
    color: var(--azul-oscuro);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--azul-oscuro);
    cursor: pointer;
    line-height: 1;
    transition: color 0.3s ease;
  }

  .close-btn:hover {
    color: var(--rojo-coral);
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    min-height: 0;
  }
</style>
