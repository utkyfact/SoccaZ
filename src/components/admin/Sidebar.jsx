import React from 'react';
import { Link } from 'react-router';

function Sidebar({ user, activeTab, setActiveTab }) {
  return (
    <div className='w-64 bg-gradient-to-b from-green-700 to-green-800 shadow-lg'>
      {/* Sidebar Header */}
      <div className='p-6 border-b border-green-600'>
        <div className='flex items-center space-x-3'>
          <span className='text-xl'>⚽</span>
          <div>
            <h2 className='text-white font-bold text-lg'>Admin Panel</h2>
            <p className='text-green-200 text-sm'>HalıSaha Yönetimi</p>
            <Link to="/" className='text-green-200 text-sm'>Ana Sayfa</Link>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className='p-4'>
        <ul className='space-y-2'>
          {/* Dashboard */}
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'dashboard'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
            >
              <span className='text-xl'>📊</span>
              <span className='font-medium'>Dashboard</span>
            </button>
          </li>

          {/* Sahalar */}
          <li>
            <button
              onClick={() => setActiveTab('fields')}
              className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'fields'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
            >
              <span className='text-xl'>⚽</span>
              <span className='font-medium'>Sahalar</span>
            </button>
          </li>

          {/* Rezervasyonlar */}
          <li>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'reservations'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
            >
              <span className='text-xl'>📅</span>
              <span className='font-medium'>Rezervasyonlar</span>
            </button>
          </li>

          {/* Kullanıcılar */}
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'users'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
            >
              <span className='text-xl'>👥</span>
              <span className='font-medium'>Kullanıcılar</span>
            </button>
          </li>

          {/* Fiyatlar */}
          <li>
            <button
              onClick={() => setActiveTab('prices')}
              className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'prices'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
            >
              <span className='text-xl'>💰</span>
              <span className='font-medium'>Fiyatlar</span>
            </button>
          </li>

          {/* Ayarlar */}
          <li>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'settings'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
            >
              <span className='text-xl'>⚙️</span>
              <span className='font-medium'>Ayarlar</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-green-600'>
        <div className='flex items-center space-x-3 text-green-100'>
          <div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center'>
            <span className='text-sm font-bold'>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className='text-sm font-medium'>{user.displayName || 'Admin'}</p>
            <p className='text-xs text-green-300'>{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 