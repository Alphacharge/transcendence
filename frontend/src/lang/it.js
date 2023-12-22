export default {
  // NAVBAR
  Game: "Gioco",
  LocalGame: "Gioco in Locale",
  Tournament: "Torneo",
  Statistics: "Statistiche",
  Profile: "Profilo",
  LogIn: "Accedi",
  SignUp: "Registrati",
  About: "Informazioni",
  Logout: "Disconnetti",
  currentLanguage: "IT",

  // PONG GAME
  EnterQueue: "Mettiti in Coda per giocare online",
  LeaveQueue: "Abbandona",
  StartLocalGame: "Giocare a due sulla stessa tastiera",
  EnterTournament: "Iscriviti al torneo online",
  LeaveTournament: "Abbandona il torneo",
  LocalGameExplanationLeft: "Muovi con i tasti W e S",
  LocalGameExplanationRight: "Muovi con i tasti freccia su e freccia giù",
  Player: "Giocatore",
  wins: "vince",
  RegisteredPlayers: "Giocatori registrati",

  // SIGNUP & LOGIN & PASSWORD
  Username: "Nome utente",
  Password: "Password",
  RepeatPassword: "Ripeti Password",
  Submit: "Invia",
  or: "o",
  loginWithIntra: "Continua con 42",
  signupWithIntra: "Continua con 42",
  NewPassword: "Nuova Password",
  RepeatNewPassword: "Ripeti la nuova password",
  OldPassword: "Vecchia password",
  ChangePassword: "Modifica password",

  // STATISTICS
  User: "Utente",
  Matches: "Partite",
  Wins: "Vittorie",
  Losses: "Sconfitte",
  TournamentMatches: "Torneo - Partite",
  TournamentWins: "Torneo - Vittorie",
  LongestGame: "Partita più lunga",
  LongestBreak: "Raduno più lungo",
  MostContacts: "Maggioranza contatto palla",
  ShortestGame: "Partita più breve",
  HighestWin: "Massima vittoria",
  LeastContacts: "Contatto palla minimo",
  ballContacts: "Contatto palla",
  graphDescription:
    "Seleziona la legenda dell'istogramma per filtrare, scorri col mouse sui grafici per più dettagli.",
  Graphs: "Grafici",
  Milestones: "Pietre miliari",

  //Profile
  profileWins: "Vittorie",
  profileLos: "Sconfitte",
  profileMatches: "Partite",
  profileTournament: "Tornei",
  profileContacts: "Contatti palla",
  profileTourWins: "Tornei vinti",
  profileRegister: "Registrato dal",
  nicknameError: "Il nome utente è preso",
  AddFriends: "Aggiungi amici",
  closeList: "Vicino",

  //2fa
  twoFAenable: "abilitare",
  twoFAdisable: "disabilitare",
  twoFAenabled: "abilitato",
  twoFAdisabled: "disabilitato",
  twoFAEnterCode: "Inserisci il tuo codice OTP",
  twoFAVerify: "verifica",
  CodeInvalid: "Codice non valido. Si prega di riprovare.",
  TwoFactorAuthEnabled: "Autenticazione a due fattori attivata con successo.",

  //About
  aboutTitle: "Transcendence",
  aboutText1:
    "Questo è il progetto Transcendence della scuola di programmazione 42. Abbiamo iniziato il progetto l'8 settembre ed è stata un'incredibile avventura. I contributori includono:",
  aboutText2:
    "L'inizio è stato impegnativo, e abbiamo dovuto imparare molte nuove nozioni. Dopo circa 8 settimane, abbiamo finalmente trovato un percorso per approfondire le conoscenze appena acquisite. È iniziata la seconda parte.",
  aboutText3:
    "Secondo me, è vantaggioso per tutti se ciascuna persona è coinvolta in tutti gli aspetti del progetto. Potrebbe richiedere più tempo, ma qui nella scuola è chiaramente visibile il vantaggio di imparare SQL, backend, frontend e styling.",
  aboutText4:
    "Desidero esprimere la mia gratitudine all'intero team per questo viaggio gratificante e auguro a tutti un piacevole periodo dopo il completamento della scuola.",

  //API
  ApiTest: "Test API",
  ApiTestCreate: "Crea Gioco",
  ApiTestLeftUp: "Alza la Racchetta Sinistra",
  ApiTestLeftDown: "Abbassa la Racchetta Sinistra",
  ApiTestRightUp: "Alza la Racchetta Destra",
  ApiTestRightDown: "Abbassa la Racchetta Destra",
  ApiTestUpdate: "Aggiorna Gioco",

  //Error
  Error: "Errore",
  ServerError: "Il server ha riscontrato un errore.",
  redirect: "Reindirizzamento alla pagina di accesso in:",
  error: {
    //Auth
    0: "",
    1: "Il nome utente è già in uso.",
    2: "Credenziali non corrette.",
    3: "La password deve essere lunga almeno 8 caratteri.",
    4: "La password contiene caratteri vietati.",
    5: "API non raggiungibile.",
    6: "Utente o password errati!",
    7: "Utente non trovato.",
    8: "Credenziali già in uso.",
    10: "Utente non autenticato.",
    11: "Il nome utente deve essere lungo almeno 4 caratteri.",
    12: "Il nome utente non può essere più lungo di 16 caratteri.",
    13: "Utente / Nickname contiene caratteri vietati.",
    //Database
    50: "Database non raggiungibile.",
    //Server
    60: "Timeout del server. Si prega di riprovare.",
    //Positive Codes
    99: "Password cambiata con successo.",
  },
};
