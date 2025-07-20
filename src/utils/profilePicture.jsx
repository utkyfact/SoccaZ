// Profil resmi mapping'i
export const profilePictures = {
  ronaldo: {
    name: 'Cristiano Ronaldo',
    image: '/profile-pictures/ronaldo-cartoon.png',
    description: 'CR7 - Portekizli yıldız'
  },
  messi: {
    name: 'Lionel Messi',
    image: '/profile-pictures/messi-cartoon.png',
    description: 'La Pulga - Arjantinli efsane'
  },
  neymar: {
    name: 'Neymar Jr.',
    image: '/profile-pictures/neymar-cartoon.png',
    description: 'Ney - Brezilyalı samba ustası'
  },
  mbappe: {
    name: 'Kylian Mbappé',
    image: '/profile-pictures/mbappe-cartoon.png',
    description: 'KM7 - Fransız hız ustası'
  },
  haaland: {
    name: 'Erling Haaland',
    image: '/profile-pictures/haaland-cartoon.png',
    description: 'Viking - Norveçli gol makinesi'
  },
  benzema: {
    name: 'Karim Benzema',
    image: '/profile-pictures/benzema-cartoon.png',
    description: 'Big Benz - Fransız teknik ustası'
  }
};

// Profil resmi component'i
export const ProfilePicture = ({ profilePictureId, size = 'md', className = '' }) => {
  const picture = profilePictures[profilePictureId];
  
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };

  const fallbackSizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl'
  };

  if (!picture) {
    return (
      <div className={`${sizeClasses[size]} ${fallbackSizeClasses[size]} bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold ${className}`}>
        ?
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 ${className}`}>
      <img
        src={picture.image}
        alt={picture.name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className={`${sizeClasses[size]} ${fallbackSizeClasses[size]} bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold hidden`}>
        {picture.name.split(' ')[0][0]}
      </div>
    </div>
  );
};

// Profil resmi bilgilerini getir
export const getProfilePictureInfo = (profilePictureId) => {
  return profilePictures[profilePictureId] || null;
};

// Varsayılan profil resmi
export const getDefaultProfilePicture = () => {
  return 'ronaldo';
}; 