sap.ui.define([
    "./BaseController",
    'sap/m/MessageToast',
    './utils/formatter', 'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Sorter',

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageToast, formatter, Filter, FilterOperator, JSONModel, Sorter) {
        "use strict";

        return BaseController.extend("frontend.controller.Master", {
            formatter: formatter,
            onInit: function () {
                var oView = this.getView();
                var oFilterModel = new JSONModel([]);
                oView.setModel(oFilterModel, "filtersModel");
            },
            onNavToBooks: function () {
                this.getRouter().navTo("books");
            },
            onListItemPressed: function (oEvent) {
                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();
                this.getRouter().navTo("author", {
                    authorId: oCtx.getProperty("ID")
                });
            },
            onSearch: function () {
                var oView = this.getView();
                // Inizializza l'array di filtri
                var aTableFilters = [];
                
                // Recupera i valori dai controlli UI
                var templateNome = encodeURIComponent(this.byId("idNomeTemplate").getValue());
                var templateCF = encodeURIComponent(this.byId("idCF").getValue());
                var templateResidenza = encodeURIComponent(this.byId("idResidenza").getValue());
                var templateEmail = encodeURIComponent(this.byId("idEmail").getValue());
            
                // Applica il filtro se il campo non è vuoto o non è "tutti"
                if (templateNome) {
                    aTableFilters.push(new Filter({
                        path: "cognome",
                        operator: FilterOperator.Contains,
                        value1: templateNome,
                        caseSensitive: false
                    }));
                }
            
                if (templateCF && templateCF !== "tutti") {
                    aTableFilters.push(new Filter({
                        path: "CF",
                        operator: FilterOperator.Contains,
                        value1: templateCF,
                        caseSensitive: false
                    }));
                }
            
                if (templateResidenza && templateResidenza !== "tutti") {
                    aTableFilters.push(new Filter({
                        path: "residenza",
                        operator: FilterOperator.Contains,
                        value1: templateResidenza,
                        caseSensitive: false
                    }));
                }
            
                if (templateEmail && templateEmail !== "tutti") {
                    aTableFilters.push(new Filter({
                        path: "email",
                        operator: FilterOperator.Contains,
                        value1: templateEmail,
                        caseSensitive: false
                    }));
                }
            
                // Applica i filtri alla tabella
                this.oTable = this.getView().byId("tablePazienti");
                this.oTable.getBinding("items").filter(aTableFilters);
                oView.getModel("filtersModel").setData(aTableFilters);
                this.oTable.setShowOverlay(false);
            
                // Aggiorna l'interfaccia utente per riflettere lo stato attuale dei filtri
                this._updateFilterButtonStyles();
            },
            
            // Funzione per aggiornare lo stile dei bottoni
            _updateFilterButtonStyles: function() {
                if (this.byId("ButtonTutti").hasStyleClass("btn-custom-cta-table")) {
                    this.byId("ButtonTutti").removeStyleClass("btn-custom-cta-table")
                        .addStyleClass("btn btn-custom");
                    this.byId("ButtonCorso").removeStyleClass("btn btn-custom")
                        .addStyleClass("btn-custom-cta-table");
                    this.byId("ButtonConcluso").removeStyleClass("btn btn-custom")
                        .addStyleClass("btn-custom-cta-table");
                    this.byId("ButtonSospeso").removeStyleClass("btn btn-custom")
                        .addStyleClass("btn-custom-cta-table");
                }
            },            

            onResetFiltersPress: function () {
                var aTableFilters = [];
                // Aggiungi il filtro per escludere lo stato "E"
                aTableFilters.push(new Filter({
                    path: "Status",
                    operator: FilterOperator.NE,
                    value1: "E"
                }));
                
                // Applica i filtri alla tabella
                this.oTable = this.getView().byId("tablePazienti");
                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            
                // Reset dei controlli UI ai valori predefiniti
                var filterBar = this.getView().byId("filterbar");
                var filterItems = filterBar.getAllFilterItems().filter(function (item) {
                    return item.getControl();
                });
            
                // Reset dei valori dei controlli
                filterItems.forEach(function (item) {
                    var control = item.getControl();
                    if (control.setValue) {
                        control.setValue(""); // per campi input
                    } else if (control.setSelectedKey) {
                        control.setSelectedKey(""); // per select
                    } else if (control.setSelectedKeys) {
                        control.setSelectedKeys([]); // per multiselect
                    } else if (control.setSelected) {
                        control.setSelected(false); // per checkbox
                    } else if (control.setState) {
                        control.setState(false); // per switch
                    }
                });
            },
            
        
            onStatusButtonPress: function (oEvent) {
                var oView = this.getView();
                var sState = oEvent.getSource().getCustomData()[0].getValue();
                
                // Verifica se il bottone è già selezionato
                if (oEvent.getSource().hasStyleClass("btn btn-custom")) {
                    return;
                }
            
                // Rimuovi lo stile dai bottoni non selezionati
                var aItems = oEvent.getSource().getParent().getItems();
                for (var i = 0; i < aItems.length; i++) {
                    if (aItems[i].hasStyleClass("btn btn-custom")) {
                        aItems[i].removeStyleClass("btn btn-custom")
                            .addStyleClass("btn-custom-cta-table");
                    }
                }
            
                // Cambia lo stile del bottone selezionato
                oEvent.getSource().removeStyleClass("btn-custom-cta-table")
                    .addStyleClass("btn btn-custom");
            
                // Crea i filtri basati sullo stato selezionato
                var aFilters = [];
                if (sState && sState !== "tutti") {
                    aFilters.push(new Filter({
                        path: "StatusRapporto/statusCode",
                        operator: FilterOperator.EQ,
                        value1: sState
                    }));
                } else if (sState === "tutti") {
                    // Se "tutti", esclude il filtro su "StatusRapporto/statusCode"
                    aFilters.push(new Filter({
                        path: "StatusRapporto/statusCode",
                        operator: FilterOperator.NE,
                        value1: "T"
                    }));
                }
            
                // Applica i filtri alla tabella
                oView.getModel("filtersModel").setData(aFilters);
                this.oTable = oView.byId("tablePazienti");
                this.oTable.getBinding("items").filter(aFilters);
                this.oTable.setShowOverlay(false);
            },            

            onOrderTable: function (oEvent) {
                var oTable = this.byId("tablePazienti"),
                    oBinding = oTable.getBinding("items"),
                    sPath = oEvent.getSource().getCustomData()[0].getValue(),
                    bDescending,
                    aSorters = [];

                if (oBinding.aSorters[0] && oBinding.aSorters[0].sPath == sPath) {
                    bDescending = oBinding.aSorters[0].bDescending ? false : true
                } else {
                    bDescending = true;
                }

                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },

            onExport: function () {
                let oView = this.getView();
                let oModel = oView.getModel();  // Assicurati che questo sia il modello OData V4
                let that = this;
            
                // Controlla se il modello è effettivamente OData V4
                if (oModel && oModel.isA("sap.ui.model.odata.v4.ODataModel")) {
            
                    // Definisci il contesto per l'export
                    let oListBinding = oModel.bindList("/Pazienti", undefined, undefined, undefined, {
                        $filter: this.getView().getModel("filtersModel").getData(),
                        $expand: "StatusRapporto"  // Effettua l'expand della proprietà CartellaClinica
                    });
            
                    oListBinding.requestContexts().then(function (aContexts) {
                        let aData = aContexts.map(function (oContext) {
                            return oContext.getObject();
                        });
            
                        // Crea la configurazione delle colonne
                        var aCols = that.createColumnConfig();
                        
                        // Prepara l'array per il contenuto del foglio Excel
                        var aRows = [];
            
                        // Aggiungi l'intestazione delle colonne
                        var aHeader = aCols.map(function (col) {
                            return col.label;
                        });
                        aRows.push(aHeader);
            
                        // Aggiungi i dati delle righe
                        aData.forEach(function (item) {
                            // Inizializza un nuovo array per la riga
                            var aRow = aCols.map(function (col) {
                                let value = item[col.property.split('/')[0]]; // Ottieni l'oggetto principale
                                if (value && col.property.includes('/')) {
                                    // Accedi alla proprietà espansa
                                    let expandedProperty = col.property.split('/')[1];
                                    return value[expandedProperty];  // Restituisci la proprietà espansa
                                } else if (col.formatter) {
                                    // Applica un formatter se esiste
                                    return col.formatter(item[col.property]);
                                } else {
                                    // Restituisci il valore direttamente
                                    return item[col.property];
                                }
                            });
                            aRows.push(aRow);
                        });
            
                        // Converte i dati in un foglio Excel
                        var ws = XLSX.utils.aoa_to_sheet(aRows);
            
                        // Imposta larghezze automatiche per le colonne basate sul contenuto
                        var colWidths = aCols.map(function (col, index) {
                            var maxLength = Math.max(col.label.length, ...aData.map(function (item) {
                                var value = item[col.property];
                                return value ? String(value).length : 0;
                            }));
                            return { wpx: maxLength * 10 };  // Imposta la larghezza in pixel
                        });
                        ws['!cols'] = colWidths;
            
                        // Aggiungi l'AutoFilter
                        ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: aHeader.length - 1, r: aRows.length - 1 } }) };
            
                        // Crea il workbook e scarica il file Excel
                        var wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Lista Pazienti");
                        XLSX.writeFile(wb, 'Excel lista pazienti.xlsx');
            
                    }).catch(function (oError) {
                        console.error(oError);
                    });
                } else {
                    console.error("Modello OData V4 non trovato o non corretto.");
                }
            },
            
            
            createColumnConfig: function () {
                return [
                    {
                        label: 'Nome e Paziente',
                        property: 'cognome',
                        type: 'string'
                    },
                    {
                        label: 'Data di Nascita',
                        property: 'dataNascita',
                        type: 'date',
                        formatter: function (value) {
                            return value ? new Date(value).toLocaleDateString() : '';
                        }
                    },
                    {
                        label: 'Codice Fiscale',
                        property: 'CF',
                        type: 'string'
                    },
                    {
                        label: 'Stato del Rapporto',
                        property: 'StatusRapporto/statusText',
                        type: 'string'
                    },
                    {
                        label: 'Residenza',
                        property: 'residenza',
                        type: 'string'
                    },
                    {
                        label: 'Numero di telefono',
                        property: 'telefono',
                        type: 'string'
                    },
                    {
                        label: 'Contatto email',
                        property: 'email',
                        type: 'string'
                    },
                    // Aggiungi altre colonne qui
                ];
            }            




        });
    });
