import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

function FieldsManagement() {
  const [fields, setFields] = useState([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    pricePerPerson: '',
    isActive: true
  });

  // Sahaları getir (admin panelinde tüm sahalar)
  const fetchFields = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'fields'));
      const fieldsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFields(fieldsData);
    } catch (error) {
      console.error('Sahalar getirilirken hata:', error);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // Form temizle
  const clearForm = () => {
    setFormData({
      name: '',
      capacity: '',
      pricePerPerson: '',
      isActive: true
    });
    setIsAddingField(false);
    setEditingField(null);
  };

  // Saha ekle
  const handleAddField = async (e) => {
    e.preventDefault();
    try {
      const fieldData = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        pricePerPerson: parseFloat(formData.pricePerPerson),
        isActive: formData.isActive,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'fields'), fieldData);
      clearForm();
      fetchFields();
    } catch (error) {
      console.error('Saha eklenirken hata:', error);
      toast.error('Saha eklenirken hata oluştu');
    }
  };

  // Saha düzenle
  const handleEditField = async (e) => {
    e.preventDefault();
    try {
      const fieldData = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        pricePerPerson: parseFloat(formData.pricePerPerson),
        isActive: formData.isActive,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'fields', editingField.id), fieldData);
      clearForm();
      fetchFields();
    } catch (error) {
      console.error('Saha güncellenirken hata:', error);
      toast.error('Saha güncellenirken hata oluştu');
    }
  };

  // Saha sil
  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Bu sahayı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'fields', fieldId));
        fetchFields();
      } catch (error) {
        console.error('Saha silinirken hata:', error);
        toast.error('Saha silinirken hata oluştu');
      }
    }
  };

  // Düzenleme modunu aç
  const openEditMode = (field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      capacity: field.capacity.toString(),
      pricePerPerson: field.pricePerPerson.toString(),
      isActive: field.isActive !== false
    });
    setIsAddingField(true);
  };

  // Aktif/Pasif durumunu değiştir
  const toggleFieldStatus = async (fieldId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'fields', fieldId), {
        isActive: !currentStatus,
        updatedAt: new Date()
      });
      fetchFields();
    } catch (error) {
      console.error('Saha durumu güncellenirken hata:', error);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Başlık ve Ekle Butonu */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-800'>Sahalar Yönetimi</h2>
        <button
          onClick={() => setIsAddingField(true)}
          className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200'
        >
          ➕ Yeni Saha Ekle
        </button>
      </div>

      {/* Saha Ekleme/Düzenleme Formu */}
      {isAddingField && (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            {editingField ? 'Saha Düzenle' : 'Yeni Saha Ekle'}
          </h3>
          <form onSubmit={editingField ? handleEditField : handleAddField} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Saha Adı
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Örn: A Saha'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Kapasite (Kişi Sayısı)
              </label>
              <input
                type='number'
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Örn: 10'
                min='1'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Kişi Başı Ücret (₺)
              </label>
              <input
                type='number'
                value={formData.pricePerPerson}
                onChange={(e) => setFormData({...formData, pricePerPerson: e.target.value})}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Örn: 50'
                min='0'
                step='0.01'
                required
              />
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='isActive'
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
              />
              <label htmlFor='isActive' className='ml-2 block text-sm text-gray-700'>
                Saha Aktif (Rezervasyon alabilir)
              </label>
            </div>
            <div className='flex space-x-3'>
              <button
                type='submit'
                className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer'
              >
                {editingField ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type='button'
                onClick={clearForm}
                className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer'
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sahalar Listesi */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-800'>Mevcut Sahalar</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Saha Adı
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kapasite
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Kişi Başı Ücret
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Durum
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {fields.length === 0 ? (
                <tr>
                  <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
                    Henüz saha eklenmemiş
                  </td>
                </tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.id} className={`hover:bg-gray-50 ${
                    field.isActive === false ? 'bg-gray-50 opacity-75' : ''
                  }`}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className={`text-sm font-medium ${
                        field.isActive === false ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {field.name}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{field.capacity} kişi</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>₺{field.pricePerPerson}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <button
                        onClick={() => toggleFieldStatus(field.id, field.isActive !== false)}
                        className={`inline-flex cursor-pointer px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                          field.isActive !== false 
                            ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800' 
                            : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800'
                        }`}
                        title={field.isActive !== false ? 'Pasif yapmak için tıklayın' : 'Aktif yapmak için tıklayın'}
                      >
                        {field.isActive !== false ? '✅ Aktif' : '❌ Pasif'}
                      </button>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => openEditMode(field)}
                        className='text-green-600 hover:text-green-900 mr-3 cursor-pointer'
                      >
                        ✏️ Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className='text-red-600 hover:text-red-900 cursor-pointer'
                      >
                        🗑️ Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FieldsManagement; 