namespace my.validexample;
using {cuid,managed} from '@sap/cds/common';

entity Users : cuid,managed {
  username: String(100) @title: 'Username';
  password: String(100) @title: 'Password';
}

entity Pazienti : cuid {
  cognome: String(100) @title: 'Cognome';
  dataNascita: Date @title: 'Data di Nascita';
  CF: String(16) @title: 'Codice Fiscale';
  StatusRapporto: Association to StatusRapporto;
  residenza: String(255) @title: 'Residenza';
  medicoDiRiferimento: String(100) @title: 'Medico di Riferimento';
  telefono: String(15) @title: 'Telefono';
  email: String(100) @title: 'Email';
  
  // Associazione con raccolta_anamnestica
  raccoltaAnamnestica: Association to RaccoltaAnamnestica;
  
  // Associazione con anamnesi_remota
  anamnesiRemota: Association to AnamnesiRemota;
  
  // Associazione con prime_fasi
  primeFasi: Association to PrimeFasi;
  
  // Associazione con anamnesi_fisiologica
  anamnesiFisiologica: Association to AnamnesiFisiologica;
  
  // Associazione con interessi
  interessi: Association to Interessi;
}

entity RaccoltaAnamnestica : cuid  {
  motivoVisita: String(255) @title: 'Motivo Visita';
  visitaNpi: String(255) @title: 'Visita NPI';
  visitaOdontoiatrica: String(255) @title: 'Visita Odontoiatrica';
  visitaOrl: String(255) @title: 'Visita ORL';
  audiometria: String(255) @title: 'Audiometria';
  asiloNido: String(255) @title: 'Asilo Nido';
  numeroBambiniFamiglia: Integer @title: 'Numero Bambini Famiglia';
  lavoroGenitori: String(255) @title: 'Lavoro Genitori';
  tempoBambino: String(255) @title: 'Tempo Bambino';

  // Associazione con Pazienti
  paziente: Association to Pazienti;
}

entity AnamnesiRemota : cuid {
  gravidanza: String(255) @title: 'Gravidanza';
  parto: String(255) @title: 'Parto';
  allattamento: String(255) @title: 'Allattamento';
  svezzamento: String(255) @title: 'Svezzamento';
  deambulazione: String(255) @title: 'Deambulazione';
  lallazione: String(255) @title: 'Lallazione';
  primeParole: String(255) @title: 'Prime Parole';

  // Associazione con Pazienti
  paziente: Association to Pazienti;
}

entity PrimeFasi : cuid {
  note: String(255) @title: 'Note';

  // Associazione con Pazienti
  paziente: Association to Pazienti;
}

entity AnamnesiFisiologica : cuid {
  abitudiniViziate: String(255) @title: 'Abitudini Viziate';
  raffreddori: String(255) @title: 'Raffreddori';
  otiti: String(255) @title: 'Otiti';
  sonno: String(255) @title: 'Sonno';
  alimentazione: String(255) @title: 'Alimentazione';
  allergieIntolleranze: String(255) @title: 'Allergie e Intolleranze';
  visiteSpecialistiche: String(255) @title: 'Visite Specialistiche';
  attenzione: String(255) @title: 'Attenzione';
  capacitaSociali: String(255) @title: 'Capacità Sociali';
  capacitaRazionali: String(255) @title: 'Capacità Razionali';
  gioco: String(255) @title: 'Gioco';
  comunicazione: String(255) @title: 'Comunicazione';
  apparecchioAcustico: String(255) @title: 'Apparecchio Acustico';
  occhiali: String(255) @title: 'Occhiali';
  apparecchioDentale: String(255) @title: 'Apparecchio Dentale';
  apprendimento: String(255) @title: 'Apprendimento';
  sport: String(255) @title: 'Sport';

  // Associazione con Pazienti
  paziente: Association to Pazienti;
}

entity Interessi : cuid {
  giocoPreferito: String(255) @title: 'Gioco Preferito';
  colorePreferito: String(255) @title: 'Colore Preferito';
  animalePreferito: String(255) @title: 'Animale Preferito';

  // Associazione con Pazienti
  paziente: Association to Pazienti;
}

entity StatusRapporto : cuid {
  statusCode: String (25) @title: 'Codice dello stato';
  statusText: String(255) @title: 'Testo dello stato';
}

@cds.persistence.skip
entity UserAuthorizations {
  key user : String;
  isAdmin : Boolean;
  isUser : Boolean;
}