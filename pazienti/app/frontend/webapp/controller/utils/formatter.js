sap.ui.define([
	"sap/ui/core/format/DateFormat"
],function(DateFormat) {
	"use strict";

	var formatter = {

		formatEta: function (sDate) {
			let birthDate;
			
			// Verifica se la lingua del browser è italiano
		
				// Se la lingua non è italiana, si presuppone il formato sDate sia valido
				birthDate = new Date(sDate);
			
		
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