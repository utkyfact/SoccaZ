import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router';

function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nutzungsbedingungen 📋
            </h1>
            <p className="text-lg text-gray-600">
            Nutzungsbedingungen für den SoccaZ-Halb-Feld-Reservierungssystem
            </p>
            <p className="text-sm text-gray-500 mt-2">
            Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Genel Bilgiler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Allgemeine Informationen</h2>
                <p className="text-gray-700 mb-4">
                Diese Nutzungsbedingungen regeln die Verwendung des SoccaZ-Halb-Feld-Reservierungssystems ("Plattform"). 
                Durch die Nutzung der Plattform erklären Sie sich mit diesen Bedingungen einverstanden.
                </p>
                <p className="text-gray-700">
                Die Plattform ist eine Webanwendung, die für die Reservierung von Halb-Feld-Spielflächen entwickelt wurde und es den Benutzern ermöglicht, Reservierungen zu tätigen, zu verwalten und zu verfolgen.
                </p>
              </section>

              {/* Hizmet Kapsamı */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Dienstbereich</h2>
                <div className="space-y-3 text-gray-700">
                  <p>SoccaZ bietet die folgenden Dienste an:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Halb-Feld-Reservierung</li>
                    <li>Reservierungsverlauf ansehen</li>
                    <li>Preisinformationen und Verfügbarkeitsüberprüfung</li>
                    <li>Bildirung und Erinnerungsdienste</li>
                    <li>Benutzerprofilverwaltung</li>
                    <li>Mobile App-Unterstützung (PWA)</li>
                  </ul>
                </div>
              </section>

              {/* Kullanıcı Sorumlulukları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Benutzerverantwortung</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Durch die Nutzung der Plattform erklären Sie sich mit den folgenden Regeln einverstanden:</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">✅ Zu tun:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Richtige und aktuelle Informationen bereitstellen</li>
                      <li>Reservierungszeiten einhalten</li>
                      <li>Spielfeldregeln einhalten</li>
                      <li>Andere Benutzer nicht stören</li>
                      <li>Plattform rechtswidrig nutzen</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">❌ Nicht tun:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-red-800">
                      <li>Falsche Informationen bereitstellen</li>
                      <li>Reservierungszeiten missachten</li>
                      <li>Spielfeldgeräte beschädigen</li>
                      <li>Plattform schlecht nutzen</li>
                      <li>Andere Benutzerkonten missbrauchen</li>
                      <li>Spam oder schädliche Inhalte teilen</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Rezervasyon Kuralları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Reservierungsregeln</h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">📅 Reservierungsprozess:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Reservierungen müssen mindestens 1 Stunde vorher erfolgen</li>
                      <li>Maximale Reservierungszeit beträgt 2 Stunden</li>
                      <li>Reservierungen müssen mindestens 2 Stunden vorher storniert werden</li>
                      <li>Zahlung bei der Reservierung</li>
                      <li>Reservierungsbestätigung per E-Mail</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Stornierung und Änderung:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Reservierungen, die weniger als 2 Stunden vorher storniert werden, werden nicht erstattet</li>
                      <li>Reservierungen, die aufgrund von Wetterbedingungen storniert werden, werden erstattet</li>
                      <li>Reservierungen, die aufgrund technischer Probleme storniert werden, werden erstattet</li>
                      <li>Reservierungsänderungen sind nur bei Verfügbarkeit möglich</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Ödeme ve Fiyatlandırma */}
              {/* <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Zahlung und Preisgestaltung</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Informationen zur Zahlung und Preisgestaltung:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">💳 Zahlungsmethoden:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Kredit-/Debitkarte</li>
                        <li>Online Banking</li>
                        <li>Digitaler Wallet</li>
                        <li>Barzahlung (auf dem Spielfeld)</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">💰 Preisgestaltung:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Preise werden stündlich festgelegt</li>
                        <li>Zusätzliche Gebühren in Spitzenzeiten</li>
                        <li>Rabatt für Grupreservierungen</li>
                        <li>Vorteile des Mitgliedschaftsprogramms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section> */}

              {/* Gizlilik ve Güvenlik */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Datenschutz und Sicherheit</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Die Schutz Ihrer persönlichen Daten ist uns wichtig. Weitere Informationen finden Sie auf unserer{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-700 underline">
                      Datenschutzerklärung
                    </Link>{' '}
                    Seite.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🔒 Sicherheitsmaßnahmen:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>SSL-Verschlüsselung für sichere Datenübertragung</li>
                      <li>PCI DSS-konforme Zahlungssystem</li>
                      <li>Regelmäßige Sicherheitsüberprüfungen</li>
                      <li>Datensicherung und Notfallwiederherstellung</li>
                      <li>Verschlüsselung der Benutzerdaten</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sorumluluk Sınırları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Haftungsbeschränkungen</h2>
                <div className="space-y-4 text-gray-700">
                  <p>SoccaZ übernimmt keine Haftung für folgende Situationen:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fehler durch Benutzer</li>
                    <li>Internetverbindungsprobleme</li>
                    <li>Probleme mit Diensten von Drittanbietern</li>
                    <li>Naturkatastrophen und unerwartete Ereignisse</li>
                    <li>Nicht Einhaltung der Spielfeldregeln</li>
                    <li>Wartungsarbeiten</li>
                  </ul>
                </div>
              </section>

              {/* Değişiklikler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Änderungen</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    SoccaZ behält sich vor, diese Nutzungsbedingungen ohne vorherige Ankündigung zu ändern. 
                    Änderungen werden auf der Plattform bekannt gegeben.
                  </p>
                  <p>
                    Die Weiterverwendung der Plattform nach der Einführung der Änderungen bedeutet die Annahme der neuen Bedingungen.
                    Die Weiterverwendung der Plattform nach der Einführung der Änderungen bedeutet die Annahme der neuen Bedingungen.
                  </p>
                </div>
              </section>

              {/* İletişim */}
              {/* <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Kontakt</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    Für Fragen zu diesen Nutzungsbedingungen können Sie sich mit uns in Verbindung setzen:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> info@soccaz.com</p>
                    <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                    <p><strong>Adresse:</strong> Berlin, Deutschland</p>
                    <p><strong>Arbeitszeiten:</strong> Montag - Sonntag, 08:00 - 22:00</p>
                  </div>
                </div>
              </section> */}

              {/* Footer */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="text-center text-gray-500 text-sm">
                  <p>
                    Diese Nutzungsbedingungen wurden im Jahr {new Date().getFullYear()} veröffentlicht und gelten für das SoccaZ-Halb-Feld-Reservierungssystem.
                  </p>
                  <p className="mt-2">
                    <Link to="/" className="text-green-600 hover:text-green-700 underline">
                      Zur Startseite
                    </Link>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Terms; 