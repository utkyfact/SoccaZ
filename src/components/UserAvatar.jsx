import React from 'react';
import { getAvatarById } from '../assets/profile-avatars';

function UserAvatar({ 
  user, 
  userProfile,
  size = 'md', 
  showBorder = false, 
  className = '',
  onClick = null 
}) {
  const avatarId = userProfile?.avatarId || user?.avatarId || 'default';
  const avatar = getAvatarById(avatarId);
  
  // Boyut sınıfları
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-24 h-24 text-3xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Border sınıfı
  const borderClass = showBorder ? 'ring-2 ring-green-500 ring-offset-2' : '';

  // Tıklanabilir sınıf
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : '';

  return (
    <div
      className={`${sizeClass} ${borderClass} ${clickableClass} ${className} rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold`}
      onClick={onClick}
    >
      {avatar.image ? (
        <img
          src={avatar.image}
          alt={avatar.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Resim yüklenemezse harf avatarına geç
            if (e.target && e.target.style) {
              e.target.style.display = 'none';
            }
            if (e.target && e.target.nextSibling && e.target.nextSibling.style) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      {/* Fallback harf avatarı */}
      <div className={`${avatar.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
        {avatarId === 'default' ? (
          <span>
            {user?.displayName 
              ? user.displayName.charAt(0).toUpperCase() 
              : user?.email?.charAt(0).toUpperCase() || 'U'
            }
          </span>
        ) : (
          <span>⚽</span>
        )}
      </div>
    </div>
  );
}

export default UserAvatar; 