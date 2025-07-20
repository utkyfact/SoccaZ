import React from 'react'
import Layout from '../components/Layout';
import { Link } from 'react-router';

function Homepage() {
  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center gap-8 px-4'>
        {/* Hero Section */}
        <div className='text-center max-w-4xl'>
          <img src="/SoccaZ.png" alt="logo" className='w-52 h-52 mx-auto' />
          <h1 className='text-5xl font-bold text-gray-800 mb-4'>
            Halı Saha Rezervasyon
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Profesyonel futbol sahalarımızda unutulmaz maçlar oynayın. 
            Hemen rezervasyon yapın ve arkadaşlarınızla birlikte eğlenceli vakit geçirin!
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-center'>
          <Link
            to="/fields"
            className='bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          >
            🏟️ Sahaları Görüntüle
          </Link>
        </div>

        {/* Features */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl'>
          <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
            <div className='text-4xl mb-4'>🌱</div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Profesyonel Çim</h3>
            <p className='text-gray-600'>En kaliteli yapay çim ile donatılmış sahalar</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
            <div className='text-4xl mb-4'>💡</div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Aydınlatmalı Sahalar</h3>
            <p className='text-gray-600'>Gece de maç yapabilirsiniz</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
            <div className='text-4xl mb-4'>📱</div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Kolay Rezervasyon</h3>
            <p className='text-gray-600'>Tek tıkla online rezervasyon</p>
          </div>
        </div>

        {/* Info Section */}
        <div className='bg-white p-8 rounded-lg shadow-sm max-w-4xl my-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4 text-center'>Neden Bizi Seçmelisiniz?</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-3'>
              <div className='flex items-center'>
                <span className='text-green-600 mr-3'>✓</span>
                <span>Profesyonel saha kalitesi</span>
              </div>
              <div className='flex items-center'>
                <span className='text-green-600 mr-3'>✓</span>
                <span>7/24 hizmet</span>
              </div>
              <div className='flex items-center'>
                <span className='text-green-600 mr-3'>✓</span>
                <span>Uygun fiyatlar</span>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center'>
                <span className='text-green-600 mr-3'>✓</span>
                <span>Güvenli ödeme</span>
              </div>
              <div className='flex items-center'>
                <span className='text-green-600 mr-3'>✓</span>
                <span>Kolay iptal</span>
              </div>
              <div className='flex items-center'>
                <span className='text-green-600 mr-3'>✓</span>
                <span>Müşteri desteği</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Homepage;