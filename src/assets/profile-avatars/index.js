// Resim dosyalarını import et
import ronaldoImg from './cristiano.png';
import messiImg from './messi.png';
import neymarImg from './neymar.png';
import mbappeImg from './mbappe.png';
import haalandImg from './haaland.png';
import benzemaImg from './benzema.png';
import icardiImg from './icardi.png';
import saneImg from './sane.png';

// Profil resmi seçenekleri
export const profileAvatars = [
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    image: ronaldoImg
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    image: messiImg
  },
  {
    id: 'neymar',
    name: 'Neymar Jr.',
    image: neymarImg
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    image: mbappeImg
  },
  {
    id: 'haaland',
    name: 'Erling Haaland',
    image: haalandImg
  },
  {
    id: 'benzema',
    name: 'Karim Benzema',
    image: benzemaImg
  },
  {
    id: 'icardi',
    name: 'Mauro Icardi',
    image: icardiImg
  },
  {
    id: 'Sane',
    name: 'Leroy Sané',
    image: saneImg
  }
];

// Varsayılan profil resmi
export const defaultAvatar = {
  id: 'default',
  name: 'Varsayılan',
  image: null
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