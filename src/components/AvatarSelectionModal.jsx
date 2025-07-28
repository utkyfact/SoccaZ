import React, { useState } from 'react';
import { profileAvatars, defaultAvatar } from '../assets/profile-avatars';

function AvatarSelectionModal({ isOpen, onClose, onSelect, currentAvatarId = 'default' }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarId);

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelect(selectedAvatar);
    onClose();
  };

  const allAvatars = [defaultAvatar, ...profileAvatars];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Profilbild auswählen</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Wählen Sie einen der Fußball-Cartoon-Avatare aus oder verwenden Sie den Standard-Avatar.
          </p>
        </div>

        {/* Avatar Listesi */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {allAvatars.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                  selectedAvatar === avatar.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Seçim İşareti */}
                {selectedAvatar === avatar.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Avatar Görüntüsü */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    {avatar.image ? (
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (e.target && e.target.style) {
                            e.target.style.display = 'none';
                          }
                          if (e.target && e.target.nextSibling && e.target.nextSibling.style) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    {!avatar.image && (
                      <span className="text-2xl font-bold text-white">
                        {avatar.id === 'default' ? '👤' : '⚽'}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm">{avatar.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSelect}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Auswählen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarSelectionModal; 