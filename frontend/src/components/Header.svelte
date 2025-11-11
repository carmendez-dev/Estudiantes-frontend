<script>
  let globalSearch = '';
  let notificationCount = 3;
</script>

<header class="header">
  <div class="header-left">
    <button class="menu-toggle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    
    <div class="global-search">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input 
        type="text" 
        placeholder="Buscar estudiantes, profesores, reportes..."
        bind:value={globalSearch}
      />
    </div>
  </div>

  <div class="header-right">
    <button class="notification-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      {#if notificationCount > 0}
        <span class="notification-badge">{notificationCount}</span>
      {/if}
    </button>

    <div class="user-profile">
      <div class="user-info">
        <div class="user-name">Ana María López</div>
        <div class="user-role">Administrador</div>
      </div>
      <div class="user-avatar">AML</div>
    </div>
  </div>
</header>

<style>
  .header {
    height: 70px;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
  }

  .menu-toggle {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    display: none;
  }

  .global-search {
    position: relative;
    max-width: 500px;
    flex: 1;
  }

  .global-search .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .global-search input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #374151;
  }

  .global-search input::placeholder {
    color: #9ca3af;
  }

  .global-search input:focus {
    outline: none;
    border-color: #27C5DA;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .notification-btn {
    position: relative;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
  }

  .notification-badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #EF5C52;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.15rem 0.4rem;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .user-info {
    text-align: right;
  }

  .user-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
  }

  .user-role {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7A95D9, #27C5DA);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    .user-info {
      display: none;
    }
  }
</style>
