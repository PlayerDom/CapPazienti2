sap.ui.define([
    "./BaseController",
    'sap/m/MessageToast',
    './utils/formatter', 
    'sap/ui/model/Filter',
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
                let oModel = oView.getModel();

                // Get the current filters applied to the table
                let oFilter = this.getView().getModel("filtersModel").getData();
                let that = this;

                oModel.read("/Pazienti", {
                    urlParameters: {
                        
                        "$expand": "StatusRapporto"
                    },
                    filters: [oFilter],
                    success: function (oData) {
                        var aCols = that.createColumnConfig(oData.results);
                        var aColumns = oData.results.map(function (item) {
                            var newItem = {};
                            aCols.forEach(function (col) {
                                let value = item[col.property.split('/')[0]]; // Ottieni l'oggetto principale
                                if (value && col.property.includes('/')) {
                                    // Accedi alla proprietà espansa
                                    let expandedProperty = col.property.split('/')[1];
                                    newItem[col.label] = value[expandedProperty];
                                } else if (col.formatter) {
                                    newItem[col.label] = col.formatter(item[col.property]);
                                } else {
                                    newItem[col.label] = item[col.property];
                                }
                            });
                            return newItem;
                        });

                        // Convert the JSON data to a worksheet
                        var ws = XLSX.utils.json_to_sheet(aColumns, { header: aCols.map(col => col.label) });
                        var wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Lista Pazienti");

                        // Imposta le larghezze delle colonne
                        ws['!cols'] = aCols.map(function (col) {
                            return { wch: col.width }; // wch è la larghezza della colonna in caratteri
                        });

                        // Aggiungi AutoFilter a tutte le colonne (da A1 a ultima colonna)
                        var lastColumn = String.fromCharCode(65 + aCols.length - 1); // 65 è il codice ASCII per 'A'
                        ws['!autofilter'] = { ref: "A1:" + lastColumn + "1" };

                        XLSX.writeFile(wb, 'Esportazione tabella controlli.xlsx');
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });
            },

            createColumnConfig: function (data) {
                // Retrieve the resource bundle for internationalization
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oTable = this.byId("tableTest");
                var oItems = data
                var that = this
                var padding = 2;

                // Initialize an object to track the maximum length of each column's content

                var maxLengths = {
                    cognome:0,
                    CF: 0,
                    StatusRapporto: 0,
                    residenza: 0,
                    telefono:0,
                    email: 0,
                };

                // Iterate over table items to calculate the maximum content length for each column
            oItems.forEach(function (oData) {
               let oLabel = that.getView().getModel("i18n").getResourceBundle();
            
            // Access expanded properties

            if (oData.cognome) {
                maxLengths.cognome = Math.max(oLabel.getText("labelNomeCognome").length, oData.cognome.length);
            }

            if (oData.CF) {
                maxLengths.CF = Math.max(oLabel.getText("labelCodiceFiscale").length, oData.CF.length);
            }

            if (oData.StatusRapporto && oData.StatusRapporto.statusText) {
                maxLengths.StatusRapporto = Math.max(oLabel.getText("labelStatusRapporto").length, oData.StatusRapporto.statusText.length);
            }

            if (oData.residenza) {
                maxLengths.residenza = Math.max(oLabel.getText("labelResidenza").length, oData.residenza.length);
            }

            if (oData.telefono) {
                maxLengths.telefono = Math.max(oLabel.getText("labelTelefono").length, oData.telefono.length);
            }

            if (oData.email) {
                maxLengths.email = Math.max(oLabel.getText("labelEmail").length, oData.email.length);
            }
        }
    );

                // Add padding to each column's maximum length
                for (var key in maxLengths) {
                    maxLengths[key] += padding;
                }

                // Create and return the column configuration array
                return [
                    {
                        label: 'Nome e Paziente',
                        property: 'cognome',
                        type: 'string',
                        width: maxLengths.cognome
                    },
                    {
                        label: 'Data di Nascita',
                        property: 'dataNascita',
                        type: 'date',
                        formatter: function (value) {
                            return value ? new Date(value).toLocaleDateString() : '';
                        },
                        width: 15
                    
                    },
                    {
                        label: 'Codice Fiscale',
                        property: 'CF',
                        type: 'string',
                        width: maxLengths.CF
                    },
                    {
                        label: 'Stato del Rapporto',
                        property: 'StatusRapporto/statusText',
                        type: 'string',
                        width: maxLengths.StatusRapporto
                    },
                    {
                        label: 'Residenza',
                        property: 'residenza',
                        type: 'string',
                        width: maxLengths.residenza 
                    },
                    {
                        label: 'Numero di telefono',
                        property: 'telefono',
                        type: 'string',
                        width: maxLengths.telefono
                    },
                    {
                        label: 'Contatto email',
                        property: 'email',
                        type: 'string',
                        width: maxLengths.email
                    },
                    // Aggiungi altre colonne qui
                ];
            }  
            

            
            
            // createColumnConfig: function () {
            //     return [
            //         {
            //             label: 'Nome e Paziente',
            //             property: 'cognome',
            //             type: 'string'
            //         },
            //         {
            //             label: 'Data di Nascita',
            //             property: 'dataNascita',
            //             type: 'date',
            //             formatter: function (value) {
            //                 return value ? new Date(value).toLocaleDateString() : '';
            //             }
            //         },
            //         {
            //             label: 'Codice Fiscale',
            //             property: 'CF',
            //             type: 'string'
            //         },
            //         {
            //             label: 'Stato del Rapporto',
            //             property: 'StatusRapporto/statusText',
            //             type: 'string'
            //         },
            //         {
            //             label: 'Residenza',
            //             property: 'residenza',
            //             type: 'string'
            //         },
            //         {
            //             label: 'Numero di telefono',
            //             property: 'telefono',
            //             type: 'string'
            //         },
            //         {
            //             label: 'Contatto email',
            //             property: 'email',
            //             type: 'string'
            //         },
            //         // Aggiungi altre colonne qui
            //     ];
            // }            




        });
    });
