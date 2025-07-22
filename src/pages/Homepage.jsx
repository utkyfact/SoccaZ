import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout';
import { Link } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

function Homepage() {
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Anasayfa içeriklerini Firebase'den yükle
  const loadContent = async () => {
    try {
      const contentDoc = await getDoc(doc(db, 'settings', 'homepage'));
      if (contentDoc.exists()) {
        setContentData(contentDoc.data());
      } else {
        setContentData(null);
      }
    } catch (error) {
      console.error('İçerik yüklenirken hata:', error);
      setContentData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Loading durumunda
  if (loading) {
    return (
      <Layout>
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Sayfa yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!contentData) {
    return (
      <Layout>
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
          <div className="text-center">
            <p className="text-gray-600 text-lg">İçerik bulunamadı. Lütfen yöneticiye başvurun.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center gap-8 px-4'>
        {/* Hero Section */}
        <div className='text-center max-w-4xl'>
          <img src="/SoccaZ.png" alt="logo" className='w-52 h-52 mx-auto' />
          <h1 className='text-5xl font-bold text-gray-800 mb-4'>
            {contentData?.hero?.title}
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            {contentData?.hero?.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-center'>
          <Link
            to="/matches"
            className='bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          >
            ⚽ Maçlara Katıl
          </Link>
        </div>

        {/* Features */}
        {contentData?.features && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl'>
            {contentData.features.map((feature) => (
              <div key={feature.id} className='bg-white p-6 rounded-lg shadow-sm text-center'>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{feature.title}</h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {contentData?.info && (
          <div className='bg-white p-8 rounded-lg shadow-sm max-w-4xl my-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
              {contentData.info.title}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* İlk yarı */}
              <div className='space-y-3'>
                {contentData.info.items.slice(0, Math.ceil(contentData.info.items.length / 2)).map((item, index) => (
                  <div key={index} className='flex items-center'>
                    <span className='text-green-600 mr-3'>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {/* İkinci yarı */}
              <div className='space-y-3'>
                {contentData.info.items.slice(Math.ceil(contentData.info.items.length / 2)).map((item, index) => (
                  <div key={index} className='flex items-center'>
                    <span className='text-green-600 mr-3'>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Homepage;