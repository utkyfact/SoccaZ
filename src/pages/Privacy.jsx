import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router';

function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Datenschutzrichtlinie 🔒
            </h1>
            <p className="text-lg text-gray-600">
              Datenschutzrichtlinie für SoccaZ halı saha rezervasyonssystem
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Giriş */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Einführung</h2>
                <p className="text-gray-700 mb-4">
                  Als SoccaZ verpflichten wir uns, die Privatsphäre Ihrer persönlichen Daten zu schützen. 
                  Diese Datenschutzrichtlinie erklärt, welche Daten wir sammeln, wie wir sie verwenden und wie wir sie schützen.
                </p>
                <p className="text-gray-700">
                  Diese Datenschutzrichtlinie wurde im Einklang mit dem Gesetz über die Schutz von personenbezogenen Daten und der Datenschutzverordnung erstellt.
                </p>
              </section>

              {/* Toplanan Veriler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Gathered Data</h2>
                <div className="space-y-6 text-gray-700">
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">👤 Persönliche Daten:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Vor- und Nachname</li>
                      <li>E-Mail-Adresse</li>
                      <li>Telefonnummer</li>
                      <li>Geburtsdatum (optional)</li>
                      <li>Profilbild (optional)</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">📅 Reservierungsdaten:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Reservierungsdatum und -zeit</li>
                      <li>Ausgewählte Platzinformationen</li>
                      <li>Zahlungsinformationen</li>
                      <li>Reservierungsverlauf</li>
                      <li>Favorisierte Plätze</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">🌐 Technische Daten:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>IP-Adresse</li>
                      <li>Browserinformationen</li>
                      <li>Geräteinformationen</li>
                      <li>Nutzungsstatistiken</li>
                      <li>Cookies</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">📱 Mobil Daten:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Standortinformationen (wenn erlaubt)</li>
                      <li>Push-Benachrichtigungseinstellungen</li>
                      <li>App-Nutzungsdaten</li>
                      <li>Geräte-ID</li>
                    </ul>
                  </div>

                </div>
              </section>

              {/* Veri Kullanım Amaçları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Verwendungszwecke</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Wir verwenden Ihre persönlichen Daten für folgende Zwecke:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">🎯 Grundlegende Dienste:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Kontoerstellung und -verwaltung</li>
                        <li>Reservierungsprozesse</li>
                        <li>Zahlungsverarbeitung</li>
                        <li>Kundenbetreuung</li>
                        <li>Benachrichtigungen</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">📊 Verbesserung:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Verbesserung der Dienstleistung</li>
                        <li>Verbesserung der Benutzeroberfläche</li>
                        <li>Entwicklung neuer Funktionen</li>
                        <li>Sicherheitsmaßnahmen</li>
                        <li>Analyse und Berichterstattung</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Veri Paylaşımı */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Datenfreigabe</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Wir teilen Ihre persönlichen Daten mit folgenden Partnern:</p>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">⚠️ Pflichtige Freigaben:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Rechtliche Verpflichtungen</li>
                      <li>Gerichtliche Entscheidungen</li>
                      <li>Gefahren für die Sicherheit</li>
                      <li>Rechtsstreitigkeiten</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">🤝 Dienstleister:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Zahlungsverarbeitung (sichere Zahlung)</li>
                      <li>E-Mail-Dienste (Benachrichtigungen)</li>
                      <li>Analyse-Dienste (Nutzungsanalyse)</li>
                      <li>Cloud-Speicherung (Datensicherung)</li>
                      <li>Kundenbetreuungsplattformen</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Sichere Freigabe:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Verarbeitungsverträge (DPA)</li>
                      <li>Verschlüsselung und Sicherheitsmaßnahmen</li>
                      <li>Minimum-Datenprinzip</li>
                      <li>Regelmäßige Sicherheitsüberprüfungen</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Veri Güvenliği */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Datensicherheit</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Um Ihre Daten zu schützen, treffen wir folgende Maßnahmen:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">🔐 Technische Maßnahmen:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>SSL/TLS-Verschlüsselung</li>
                        <li>Sichere Datenspeicherung</li>
                        <li>Regelmäßige Sicherheitsupdates</li>
                        <li>Firewall-Schutz</li>
                        <li>DDoS-Schutz</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">👥 Organisatorische Maßnahmen:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Mitarbeiter-Ausbildung</li>
                        <li>Zugriffskontrolle</li>
                        <li>Datenverarbeitungsrichtlinien</li>
                        <li>Regelmäßige Überprüfungen</li>
                        <li>Vorfallintervention Pläne</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Çerezler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Wir verwenden auf unserer Website die folgenden Cookie-Typen:</p>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">🍪 Cookie-Typen:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Erforderliche Cookies:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Sitzungsverwaltung</li>
                          <li>Sicherheit</li>
                          <li>Grundfunktionen</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Analyse-Cookies:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Nutzungsanalyse</li>
                          <li>Leistungsmessung</li>
                          <li>Fehlerverfolgung</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">⚙️ Cookie-Verwaltung:</h3>
                    <p className="text-sm">
                      Sie können Cookies in den Browsereinstellungen verwalten und löschen. 
                      Allerdings kann das Deaktivieren bestimmter Cookies dazu führen, dass unsere Dienste nicht ordnungsgemäß funktionieren.
                    </p>
                  </div>
                </div>
              </section>

              {/* Kullanıcı Hakları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Nutzerrechte</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Sie haben unter KVKK folgende Rechte:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">📋 Informationsrechte:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Wissen, ob Ihre Daten verarbeitet werden</li>
                        <li>Wissen, welche Daten verarbeitet werden</li>
                        <li>Wissen, für welche Zwecke Ihre Daten verarbeitet werden</li>
                        <li>Wissen, an welche Dritten Ihre Daten übertragen werden</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">✏️ Eingriffsrechte:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Wunsch nach Korrektur falscher Daten</li>
                        <li>Wunsch nach Löschung von Daten</li>
                        <li>Einschränkung der Verarbeitung</li>
                        <li>Datenübertragbarkeit</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">📧 Ausübung Ihrer Rechte:</h3>
                    <p className="text-sm mb-2">
                      Um Ihre Rechte auszuüben, kontaktieren Sie uns über folgende Kanäle:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li><strong>E-Mail:</strong> privacy@soccaz.com</li>
                      <li><strong>Telefon:</strong> +90 (212) 555 0123</li>
                      <li><strong>Adresse:</strong> İstanbul, Türkiye</li>
                      <li><strong>Online Form:</strong> Profilseite von</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Veri Saklama */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Datenspeicherungsdauer</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Wir halten Ihre Daten für folgende Zeiträume:</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li><strong>Kontodaten:</strong> Solange das Konto aktiv ist</li>
                      <li><strong>Reservierungsdaten:</strong> 5 Jahre (rechtliche Verpflichtung)</li>
                      <li><strong>Zahlungsdaten:</strong> 10 Jahre (finanzielle Vorschriften)</li>
                      <li><strong>Kontaktinformationen:</strong> 3 Jahre</li>
                      <li><strong>Analyse-Daten:</strong> 2 Jahre</li>
                      <li><strong>Cookies:</strong> 1 Jahr (maximal)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Çocukların Gizliliği */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Schutz von Kindern</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Unsere Dienste sind für 18 Jahre und ältere Personen konzipiert. 
                    Für 18 Jahre und jüngere Personen ist die Zustimmung der Eltern erforderlich.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">⚠️ Wichtige Hinweise:</h3>
                    <p className="text-sm">
                      Wir sammeln keine personenbezogenen Daten von 18 Jahre und jüngeren Personen. 
                      Wenn wir feststellen, dass personenbezogene Daten von 18 Jahre und jüngeren Personen erhoben werden, löschen wir diese Daten sofort.
                    </p>
                  </div>
                </div>
              </section>

              {/* Değişiklikler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Änderungen der Datenschutzrichtlinie</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Wir aktualisieren diese Datenschutzrichtlinie gelegentlich. 
                    Wir werden Sie informieren, wenn wichtige Änderungen vorgenommen werden.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">📢 Benachrichtigungsmethoden:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>E-Mail-Benachrichtigung</li>
                      <li>Plattform-interner Hinweis</li>
                      <li>Webseitenaktualisierung</li>
                      <li>Push-Benachrichtigung</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* İletişim */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Kontakt</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    Für Fragen zur Datenschutzrichtlinie:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Datenschutzbeauftragter:</strong> SoccaZ Teknoloji A.Ş.</p>
                    <p><strong>E-Mail:</strong> privacy@soccaz.com</p>
                    <p><strong>Telefon:</strong> +90 (212) 555 0123</p>
                    <p><strong>Adresse:</strong> İstanbul, Türkiye</p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="text-center text-gray-500 text-sm">
                  <p>
                    Diese Datenschutzrichtlinie wurde im Jahr {new Date().getFullYear()} veröffentlicht und gilt für das SoccaZ-Fußballplatzreservierungssystem.
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

export default Privacy; 