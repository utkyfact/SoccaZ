import React from 'react';

function Header({ activeTab, onMenuClick, sidebarOpen }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';


      case 'users':
        return 'Benutzerverwaltung';
      case 'content':
        return 'Inhaltsverwaltung';
      case 'contact':
        return 'Kontaktseite';
      case 'settings':
        return 'Systemeinstellungen';
      default:
        return 'Dashboard';
    }
  };

  const getDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Allgemeine Statistiken und Zusammenfassungen';


      case 'users':
        return 'Benutzerverwaltung';
      case 'content':
        return 'Inhaltsverwaltung';
      case 'contact':
        return 'Kontaktseite';
      case 'settings':
        return 'Systemeinstellungen';
      default:
        return 'Allgemeine Statistiken und Zusammenfassungen';
    }
  };

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={onMenuClick}
            className='lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200'
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                // X icon when sidebar is open
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                // Hamburger icon when sidebar is closed
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>

          {/* Title Section */}
          <div>
            <h1 className='text-xl lg:text-2xl font-bold text-gray-800'>
              {getTitle()}
            </h1>
            <p className='text-gray-600 mt-1 text-sm lg:text-base hidden sm:block'>
              {getDescription()}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2 lg:space-x-4'>
          <button className='bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm lg:text-base'>
            <span className='hidden sm:inline'>🔔 Benachrichtigungen anzeigen</span>
            <span className='sm:hidden'>🔔</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header; 