<script>
  export let currentPage = 'estudiantes';
  
  function navigate(page) {
    currentPage = page;
  }
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="logo-container">
      <div class="logo-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#27C5DA"/>
          <path d="M16 8L8 12v8c0 5 8 8 8 8s8-3 8-8v-8l-8-4z" fill="white"/>
        </svg>
      </div>
      <div class="logo-text">
        <div class="logo-title">BRISA</div>
        <div class="logo-subtitle">Sistema Escolar</div>
      </div>
    </div>
  </div>

  <nav class="sidebar-nav">
    <button class="nav-item" class:active={currentPage === 'dashboard'} on:click={() => navigate('dashboard')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Dashboard</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'usuarios'} on:click={() => navigate('usuarios')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13 14c2.2 0 4 1.8 4 4H3c0-2.2 1.8-4 4-4M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Usuarios y Roles</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'estudiantes'} on:click={() => navigate('estudiantes')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 6l7-3 7 3v6c0 4-7 7-7 7s-7-3-7-7V6z" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Estudiantes</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'cursos'} on:click={() => navigate('cursos')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 3h16v2H2V3zM2 7h16v2H2V7zM2 11h16v2H2v-2zM2 15h10v2H2v-2z" fill="currentColor"/>
      </svg>
      <span>Cursos</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'profesores'} on:click={() => navigate('profesores')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 18h16M4 18V8l6-4 6 4v10M8 18v-6h4v6" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Profesores</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'administrativos'} on:click={() => navigate('administrativos')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
        <path d="M7 3v14M13 3v14M3 10h14" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Administrativos</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'retiros'} on:click={() => navigate('retiros')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
        <path d="M10 6v4l3 3" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Retiros Tempranos</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'incidentes'} on:click={() => navigate('incidentes')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L2 18h16L10 2z" stroke="currentColor" stroke-width="2"/>
        <path d="M10 8v4M10 14v1" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Incidentes</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'esquelas'} on:click={() => navigate('esquelas')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 6l7 5 7-5M3 6v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6M3 6l7-3 7 3" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Esquelas</span>
    </button>

    <button class="nav-item" class:active={currentPage === 'reportes'} on:click={() => navigate('reportes')}>
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 3h14v14H3V3z" stroke="currentColor" stroke-width="2"/>
        <path d="M7 7h6M7 11h6M7 15h4" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Reportes</span>
    </button>
  </nav>

  <div class="sidebar-footer">
    <button class="nav-item logout">
      <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M13 13l4-4-4-4M17 9H7" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Cerrar Sesión</span>
    </button>
  </div>
</aside>

<style>
  .sidebar {
    width: 250px;
    background-color: #0c2a4d;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 1.5rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    flex-shrink: 0;
  }

  .logo-text {
    color: white;
  }

  .logo-title {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .logo-subtitle {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.2s;
    font-size: 0.95rem;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
  }

  .nav-item.active {
    background-color: #27C5DA;
    color: #0c2a4d;
    font-weight: 600;
    border-radius: 8px;
    margin: 0 0.75rem;
    padding-left: 0.75rem;
    width: calc(100% - 1.5rem);
  }

  .nav-icon {
    flex-shrink: 0;
  }

  .sidebar-footer {
    padding: 1rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logout {
    color: rgba(255, 255, 255, 0.6);
  }

  .logout:hover {
    color: #EF5C52;
  }
</style>
