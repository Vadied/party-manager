'use client';

import { useState } from 'react';
import { Team, GAMING_SYSTEMS } from '@/types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

const DEFAULT_EMAIL_TEMPLATES = {
  invitation: {
    subject: 'Conferma della tua partecipazione - {{teamName}}',
    body: `Ciao {{firstName}},

Siamo felici di confermarti che sei stato/a selezionato/a per partecipare al team "{{teamName}}" per una sessione di {{gameSystem}}!

**Dettagli del Team:**
- Nome Team: {{teamName}}
- Sistema di Gioco: {{gameSystem}}
- Game Master: {{masterName}} ({{masterEmail}})
- Partecipanti: {{playersList}}
{{sessionDateInfo}}

**Prossimi Passi:**
1. Conferma la tua partecipazione rispondendo a questa email
2. Il Game Master ti contatterà per organizzare i dettagli della sessione
3. Preparati per un'avventura fantastica!

Per qualsiasi domanda, non esitare a contattarci.

Buon gioco!
Il Team di Party Manager

---
Questa email è stata inviata automaticamente dal sistema Party Manager.`
  },
  reminder: {
    subject: 'Promemoria Sessione - {{teamName}}',
    body: `Ciao {{firstName}},

Ti ricordiamo che la tua sessione di {{gameSystem}} con il team "{{teamName}}" si avvicina!

**Dettagli della Sessione:**
- Team: {{teamName}}
- Sistema: {{gameSystem}}
- Game Master: {{masterName}}
{{sessionDateInfo}}

**Ricorda di:**
- Preparare il tuo personaggio (se necessario)
- Avere a disposizione dadi e materiali
- Essere puntuale all'appuntamento

Ci vediamo al tavolo!
Il Team di Party Manager`
  }
};

export default function EmailModal({ isOpen, onClose, team }: EmailModalProps) {
  const [template, setTemplate] = useState<'invitation' | 'reminder' | 'custom'>('invitation');
  const [subject, setSubject] = useState(DEFAULT_EMAIL_TEMPLATES.invitation.subject);
  const [body, setBody] = useState(DEFAULT_EMAIL_TEMPLATES.invitation.body);
  const [isSending, setIsSending] = useState(false);

  const allParticipants = [team.master, ...team.players];
  const gameSystemLabel = GAMING_SYSTEMS.find(s => s.value === team.gamingSystem)?.label || team.gamingSystem;

  const replaceVariables = (text: string, participant: typeof team.master) => {
    const playersList = team.players.map(p => `${p.firstName} ${p.lastName}`).join(', ');
    const sessionDateInfo = team.sessionDate 
      ? `\n- Data Sessione: ${team.sessionDate.toLocaleDateString('it-IT', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`
      : '\n- Data da definire';

    return text
      .replace(/\{\{firstName\}\}/g, participant.firstName)
      .replace(/\{\{lastName\}\}/g, participant.lastName)
      .replace(/\{\{email\}\}/g, participant.email)
      .replace(/\{\{teamName\}\}/g, team.name)
      .replace(/\{\{gameSystem\}\}/g, gameSystemLabel)
      .replace(/\{\{masterName\}\}/g, `${team.master.firstName} ${team.master.lastName}`)
      .replace(/\{\{masterEmail\}\}/g, team.master.email)
      .replace(/\{\{playersList\}\}/g, playersList)
      .replace(/\{\{sessionDateInfo\}\}/g, sessionDateInfo);
  };

  const handleTemplateChange = (newTemplate: typeof template) => {
    setTemplate(newTemplate);
    if (newTemplate !== 'custom') {
      const templateData = DEFAULT_EMAIL_TEMPLATES[newTemplate];
      setSubject(templateData.subject);
      setBody(templateData.body);
    }
  };

  const handleSendEmails = async () => {
    setIsSending(true);

    try {
      // Simula invio email (in un'app reale, qui faresti una chiamata API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Per ogni partecipante, prepara l'email personalizzata
      const emailPromises = allParticipants.map(async (participant) => {
        const personalizedSubject = replaceVariables(subject, participant);
        const personalizedBody = replaceVariables(body, participant);

        // In un'app reale, qui invieresti l'email
        console.log('Email inviata a:', participant.email);
        console.log('Oggetto:', personalizedSubject);
        console.log('Corpo:', personalizedBody);
        console.log('---');

        return {
          to: participant.email,
          subject: personalizedSubject,
          body: personalizedBody
        };
      });

      await Promise.all(emailPromises);

      alert(`Email inviate con successo a tutti i ${allParticipants.length} partecipanti!`);
      onClose();

    } catch (error) {
      console.error('Errore durante l\'invio delle email:', error);
      alert('Errore durante l\'invio delle email. Riprova più tardi.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Invia Email - {team.name}</h2>
            <p className="text-sm text-gray-600">
              Email sarà inviata a {allParticipants.length} partecipanti
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Composition */}
            <div className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Email
                </label>
                <select
                  value={template}
                  onChange={(e) => handleTemplateChange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="invitation">Invito Team</option>
                  <option value="reminder">Promemoria Sessione</option>
                  <option value="custom">Personalizzato</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Oggetto
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Oggetto dell'email..."
                />
              </div>

              {/* Body */}
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                  Contenuto
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contenuto dell'email..."
                />
              </div>

              {/* Variables Help */}
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Variabili Disponibili:</h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <div><code>{'{{firstName}}'}</code> - Nome del destinatario</div>
                  <div><code>{'{{lastName}}'}</code> - Cognome del destinatario</div>
                  <div><code>{'{{email}}'}</code> - Email del destinatario</div>
                  <div><code>{'{{teamName}}'}</code> - Nome del team</div>
                  <div><code>{'{{gameSystem}}'}</code> - Sistema di gioco</div>
                  <div><code>{'{{masterName}}'}</code> - Nome del Game Master</div>
                  <div><code>{'{{masterEmail}}'}</code> - Email del Game Master</div>
                  <div><code>{'{{playersList}}'}</code> - Lista giocatori</div>
                  <div><code>{'{{sessionDateInfo}}'}</code> - Informazioni data sessione</div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Anteprima Email</h3>
              
              {/* Recipients */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Destinatari:</h4>
                <div className="space-y-1">
                  {allParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium">{participant.firstName} {participant.lastName}</span>
                      <span className="text-gray-500 ml-2">({participant.email})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview for first participant */}
              <div className="border border-gray-200 rounded-md">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <div className="text-sm">
                    <strong>A:</strong> {allParticipants[0]?.email}
                  </div>
                  <div className="text-sm">
                    <strong>Oggetto:</strong> {replaceVariables(subject, allParticipants[0])}
                  </div>
                </div>
                <div className="p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {replaceVariables(body, allParticipants[0])}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSendEmails}
            disabled={isSending || !subject.trim() || !body.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? 'Invio in corso...' : `Invia a ${allParticipants.length} partecipanti`}
          </button>
        </div>
      </div>
    </div>
  );
}
