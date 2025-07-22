import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import ContentArea from '../components/admin/ContentArea';

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth ve admin kontrolü
  useEffect(() => {
    if (!loading) {
      if (!user) {
    navigate('/login');
        return;
      }
      
      if (!isAdmin) {
        navigate('/');
        return;
      }
    }
  }, [user, isAdmin, loading, navigate]);

  // Loading durumunda loading göster
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kullanıcı yoksa veya admin değilse null döndür (useEffect yönlendirecek)
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onMobileItemClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col lg:ml-0'>
        {/* Header */}
        <Header 
          activeTab={activeTab} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Content Area */}
        <ContentArea activeTab={activeTab} />
      </div>
    </div>
  )
}

export default Admin;