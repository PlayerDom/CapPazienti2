sap.ui.define([
	"sap/ui/core/format/DateFormat"
],function(DateFormat) {
	"use strict";

	var formatter = {

		formatEta: function (sDate) {
			let birthDate;
			
			// Verifica se la lingua del browser è italiano
			if (navigator.language.startsWith('it')) {
				// Mappa dei mesi in italiano a quelli in inglese
				const monthMap = {
					"gen": "Jan", "feb": "Feb", "mar": "Mar", "apr": "Apr", 
					"mag": "May", "giu": "Jun", "lug": "Jul", "ago": "Aug", 
					"set": "Sep", "ott": "Oct", "nov": "Nov", "dic": "Dec"
				};
		
				// Spezza la stringa della data e sostituisci il mese con quello in inglese
				let dateParts = sDate.split(' ');
				let day = dateParts[0];
				let month = monthMap[dateParts[1].toLowerCase()];
				let year = dateParts[2];
		
				// Crea la data in formato compatibile
				birthDate = new Date(`${month} ${day}, ${year}`);
			} else {
				// Se la lingua non è italiana, si presuppone il formato sDate sia valido
				birthDate = new Date(sDate);
			}
		
			// Calcolo dell'età
			const today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			const dayDiff = today.getDate() - birthDate.getDate();
		
			// Correzione dell'età se il compleanno non è ancora passato quest'anno
			if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
				age--;
			}
		
			return age;
		},
		
		formatState: function (stato) {
            switch (stato) {
                case "T":
                    return "Error";
                case "I":
                    return "Indication04";
                case "S":
                    return "Indication05";
                case "C":
                    return "Indication03";              
            }
        },

		
		
			
	};

	return formatter;

},  /* bExport= */ true);