import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import UserAvatar from '../UserAvatar';
import { sanitizeInput } from '../../utils/inputSanitizer';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Kullanıcıları getir
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Kullanıcıları getir
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Kullanıcı rolünü değiştir
  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date()
      });
      fetchUsers(); // Listeyi yenile
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Benutzerrolle:', error);
    }
  };

  // Kullanıcı durumunu değiştir
  const updateUserStatus = async (userId, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: newStatus,
        updatedAt: new Date()
      });
      fetchUsers(); // Listeyi yenile
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Benutzerstatus:', error);
    }
  };

  // Kullanıcı sil
  const deleteUser = async (userId) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers(); // Listeyi yenile
      } catch (error) {
        console.error('Fehler beim Löschen des Benutzers:', error);
      }
    }
  };



  // Filtreleme ve arama
  const filteredUsers = users
    .filter(user => {
      // Rol filtresi
      if (filterRole !== 'all' && user.role !== filterRole) {
        return false;
      }
      
      // Durum filtresi (varsayılan: active)
      const userStatus = user.status || 'active';
      if (filterStatus !== 'all' && userStatus !== filterStatus) {
        return false;
      }
      
      // Arama filtresi
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'createdAt':
          aValue = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          bValue = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          break;
        case 'lastLogin':
          aValue = a.lastLogin?.toDate ? a.lastLogin.toDate() : new Date(a.lastLogin);
          bValue = b.lastLogin?.toDate ? b.lastLogin.toDate() : new Date(b.lastLogin);
          break;
        default:
          aValue = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          bValue = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination hesaplamaları
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Sayfa değiştirme fonksiyonları
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Filtre değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  // Tarih formatla
  const formatDate = (date) => {
    if (!date) return 'Unbekannt';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Rol badge'i
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Admin</span>;
      case 'user':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Benutzer</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unbekannt</span>;
    }
  };

  // Durum badge'i
  const getStatusBadge = (status) => {
    // Varsayılan olarak aktif kabul et
    const userStatus = status || 'active';
    
    switch (userStatus) {
      case 'active':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktiv</span>;
      case 'inactive':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inaktiv</span>;
      case 'banned':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Gesperrt</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktiv</span>;
    }
  };

  // Email doğrulama badge'i
  const getEmailVerificationBadge = (emailVerified) => {
    if (emailVerified === undefined || emailVerified === null) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unbekannt</span>;
    }
    return emailVerified ? 
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✓ Verifiziert</span> :
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⚠ Unverifiziert</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Benutzerverwaltung</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Benutzer werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Başlık ve Yenile Butonu */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Benutzerverwaltung</h2>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer text-sm lg:text-base"
        >
          {loading ? '🔄' : '🔄 Aktualisieren'}
        </button>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suche</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(sanitizeInput(e.target.value))}
              placeholder="Name, E-Mail, Telefon..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Rol Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Alle</option>
              <option value="admin">Admin</option>
              <option value="user">Benutzer</option>
            </select>
          </div>

          {/* Durum Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Alle</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Inaktiv</option>
              <option value="banned">Gesperrt</option>
            </select>
          </div>

          {/* Sıralama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="createdAt-desc">Registrierungsdatum (Neu)</option>
              <option value="createdAt-asc">Registrierungsdatum (Alt)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="email-asc">E-Mail (A-Z)</option>
              <option value="email-desc">E-Mail (Z-A)</option>
              <option value="lastLogin-desc">Letzte Anmeldung (Neu)</option>
              <option value="lastLogin-asc">Letzte Anmeldung (Alt)</option>
            </select>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-blue-50 p-3 lg:p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-xs lg:text-sm font-medium">Gesamte Benutzer</p>
          <p className="text-xl lg:text-2xl font-bold text-blue-800">{users.length}</p>
        </div>
        <div className="bg-green-50 p-3 lg:p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-xs lg:text-sm font-medium">Aktiv</p>
          <p className="text-xl lg:text-2xl font-bold text-green-800">
            {users.filter(u => (u.status || 'active') === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 p-3 lg:p-4 rounded-lg border border-purple-200">
          <p className="text-purple-600 text-xs lg:text-sm font-medium">Admin</p>
          <p className="text-xl lg:text-2xl font-bold text-purple-800">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-3 lg:p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-600 text-xs lg:text-sm font-medium">Unverifiziert</p>
          <p className="text-xl lg:text-2xl font-bold text-yellow-800">
            {users.filter(u => !u.emailVerified || u.emailVerified === false).length}
          </p>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800">
              Benutzer ({filteredUsers.length})
            </h3>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Seite {currentPage} / {totalPages} 
                ({indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} / {filteredUsers.length})
              </div>
            )}
          </div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="p-4 lg:p-6 text-center text-gray-500">
            <div className="text-gray-400 text-4xl mb-2">👥</div>
            <p>Benutzer nicht gefunden</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Benutzer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontakt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role & Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Daten
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={user} size="sm" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || user.name || 'Unbekannt'}
                          </div>
                          {(!user.emailVerified || user.emailVerified === false) && (
                            <div className="text-sm text-gray-500">
                              {getEmailVerificationBadge(user.emailVerified)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone || 'Keine Telefonnummer'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">Registrierung: {formatDate(user.createdAt)}</div>
                        <div className="text-sm text-gray-500">Letzte Anmeldung: {formatDate(user.lastLogin)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Rol değiştirme */}
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 cursor-pointer"
                        >
                          <option value="user">Benutzer</option>
                          <option value="admin">Admin</option>
                        </select>

                        {/* Durum değiştirme */}
                        <select
                          value={user.status || 'active'}
                          onChange={(e) => updateUserStatus(user.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 cursor-pointer"
                        >
                          <option value="active">Aktiv</option>
                          <option value="inactive">Inaktiv</option>
                          <option value="banned">Gesperrt</option>
                        </select>

                        {/* Silme butonu */}
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          title="Benutzer löschen"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="space-y-4 p-4">
                {currentUsers.map((user) => (
                  <div key={user.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={user} size="sm" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {user.displayName || user.name || 'Unbekannt'}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.phone && (
                          <p className="text-xs text-gray-500 truncate">{user.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                      {getEmailVerificationBadge(user.emailVerified)}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="flex-1 text-xs border border-gray-300 rounded px-2 py-2 cursor-pointer"
                      >
                        <option value="user">Benutzer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <select
                        value={user.status || 'active'}
                        onChange={(e) => updateUserStatus(user.id, e.target.value)}
                        className="flex-1 text-xs border border-gray-300 rounded px-2 py-2 cursor-pointer"
                      >
                        <option value="active">Aktiv</option>
                        <option value="inactive">Inaktiv</option>
                        <option value="banned">Gesperrt</option>
                      </select>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer px-3 py-2 text-xs border border-red-300 rounded hover:bg-red-50"
                        title="Benutzer löschen"
                      >
                        🗑️ Sil
                      </button>
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Registrierung: {formatDate(user.createdAt)}</p>
                      <p>Letzte Anmeldung: {formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white p-4 lg:p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* Pagination butonları */}
              <div className="flex justify-center items-center space-x-2">
                {/* Önceki sayfa */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Vorherige
                </button>

                {/* Sayfa numaraları */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    
                    // Sadece mevcut sayfa, ilk sayfa, son sayfa ve yakındaki sayfaları göster
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                            isCurrentPage
                              ? 'bg-green-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Sonraki sayfa */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Nächste →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersManagement; 