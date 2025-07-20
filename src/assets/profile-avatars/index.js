// Resim dosyalarını import et
import ronaldoImg from './cristiano.png';
import messiImg from './messi.png';
import neymarImg from './neymar.png';
import mbappeImg from './mbappe.png';
import haalandImg from './haaland.png';
import benzemaImg from './benzema.png';

// Profil resmi seçenekleri
export const profileAvatars = [
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    image: ronaldoImg,
    description: 'CR7 - Portekizli yıldız'
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    image: messiImg,
    description: 'La Pulga - Arjantinli efsane'
  },
  {
    id: 'neymar',
    name: 'Neymar Jr.',
    image: neymarImg,
    description: 'Ney - Brezilyalı samba ustası'
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    image: mbappeImg,
    description: 'Kylian - Fransız hız ustası'
  },
  {
    id: 'haaland',
    name: 'Erling Haaland',
    image: haalandImg,
    description: 'Haaland - Norveçli yıldız'
  },
  {
    id: 'benzema',
    name: 'Karim Benzema',
    image: benzemaImg,
    description: 'Benzema - Fransız efsane'
  }
];

// Varsayılan profil resmi
export const defaultAvatar = {
  id: 'default',
  name: 'Varsayılan',
  image: null,
  description: 'Harf avatarı'
};

// Profil resmi seçme fonksiyonu
export const getAvatarById = (id) => {
  return profileAvatars.find(avatar => avatar.id === id) || defaultAvatar;
};

// Profil resmi URL'sini al
export const getAvatarImage = (avatarId) => {
  const avatar = getAvatarById(avatarId);
  return avatar.image;
}; 