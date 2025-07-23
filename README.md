---

## 👤 User Flow

1. **Register/Login:** Users sign up with email or Google, verify their email, and set up their profile.
2. **Browse Matches:** See available matches, join or leave as a participant.
3. **Book a Pitch:** Create a new match, select date/time, set max participants, and invite friends.
4. **Notifications:** Get notified about upcoming matches, changes, or admin messages.
5. **Profile Management:** Update personal info, change avatar, view match history.

---

## 🛡️ Security & Best Practices

- **Input Sanitization:** All user input is sanitized (DOMPurify, Validator.js).
- **Rate Limiting & DDoS:** Advanced rate limiting and DDoS protection (client + Cloudflare).
- **2FA Ready:** Multi-factor authentication (Firebase MFA) can be enabled.
- **Session Management:** Secure session handling, auto-logout on inactivity.
- **Admin Controls:** Role-based access, audit logs, and real-time monitoring.
- **PWA Security:** Service Worker only in production, secure headers via Vite.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS 4, React Router 7, React Toastify
- **Backend:** Firebase Auth, Firestore, Firebase Storage
- **PWA:** Manifest, Service Worker, Offline support
- **Security:** DOMPurify, Validator.js, Cloudflare WAF, custom rate limiter
- **Other:** Leaflet (maps), QRCode (match QR), ESLint

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/utkyfact/soccaz.git
cd turf-field
npm install
```

### 2. Environment Setup

Create a `.env` file in `/turf-field`:

```env
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_firebase_auth_domain
VITE_PROJECTID=your_firebase_project_id
VITE_STORAGEBUCKET=your_firebase_storage_bucket
VITE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_APPID=your_firebase_app_id
VITE_MEASUREMENTID=your_firebase_measurement_id
```

### 3. Run Locally

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 🧑‍💼 Admin Panel

- Access via `/admin` (admin users only)
- Manage users, matches, content, messages, and monitor DDoS/security events
- Create the first admin via Firestore or `src/utils/createFirstAdmin.js`

---

## 📱 PWA Features

- Installable on mobile and desktop
- Offline support
- Push notifications (with Firebase)
- Home screen shortcut

---

## 🌍 Customization

- **Avatars:** Add PNGs to `/public/profile-pictures/`
- **Homepage Content:** Editable via admin panel
- **Security Rules:** Update Firebase and Cloudflare settings as needed

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

MIT License © [Your Name or SoccaZ Team]

---

<p align="center">
  <img src="public/SoccaZ.png" alt="SoccaZ" width="60" /><br>
  <b>Organize your football matches, effortlessly.</b>
</p>