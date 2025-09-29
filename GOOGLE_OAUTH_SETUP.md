# Configurazione Google OAuth

Per abilitare l'autenticazione con Google, segui questi passaggi:

## 1. Creare un Progetto Google Cloud

1. Vai alla [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona un progetto esistente
3. Abilita l'API Google+ nel [API Library](https://console.cloud.google.com/apis/library)

## 2. Configurare OAuth 2.0

1. Vai a **APIs & Services > Credentials**
2. Clicca **"Create Credentials"** > **"OAuth client ID"**
3. Seleziona **"Web application"**
4. Aggiungi gli URI autorizzati:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

## 3. Configurare le Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto con:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console

# Admin Emails (comma separated) - questi utenti avranno accesso al backoffice
ADMIN_EMAILS=tua-email@gmail.com,altro-admin@gmail.com
```

## 4. Generare NEXTAUTH_SECRET

Puoi generare una chiave segreta sicura con:

```bash
openssl rand -base64 32
```

## 5. Testare l'Autenticazione

1. Avvia l'applicazione: `npm run dev`
2. Vai su `http://localhost:3000`
3. Clicca "Accedi" per testare l'autenticazione Google
4. Se la tua email è nell'elenco ADMIN_EMAILS, avrai accesso al backoffice

## 6. Per la Produzione

Quando deployi in produzione, ricorda di:

1. **Aggiornare NEXTAUTH_URL** con l'URL di produzione
2. **Aggiornare gli URI autorizzati** nella Google Cloud Console
3. **Cambiare NEXTAUTH_SECRET** con una chiave nuova e sicura
4. **Configurare ADMIN_EMAILS** con gli email degli amministratori reali

## Struttura Permessi

- **Utenti non autenticati**: Possono solo compilare il form di prenotazione
- **Utenti autenticati**: Form pre-compilato con i dati Google + esperienza personalizzata
- **Amministratori**: Accesso completo al backoffice per gestire prenotazioni e team

## Troubleshooting

### Errore "redirect_uri_mismatch"
- Verifica che gli URI autorizzati nella Google Cloud Console corrispondano esattamente
- Per sviluppo locale: `http://localhost:3000/api/auth/callback/google`

### Non vedo il pulsante Backoffice
- Verifica che la tua email sia inclusa in ADMIN_EMAILS
- Controlla la console browser per eventuali errori di autenticazione

### Errore di configurazione
- Verifica che GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET siano corretti
- Assicurati che l'API Google+ sia abilitata nel progetto
