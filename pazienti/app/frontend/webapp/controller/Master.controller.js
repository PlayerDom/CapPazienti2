sap.ui.define([
    "./BaseController",
    'sap/m/MessageToast',
    './utils/formatter', 'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageToast, formatter, Filter, FilterOperator, JSONModel) {
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
                // Initialize the array of filters and retrieve values from UI controls to use as filters
                var aTableFilters = [];
                var templateNome = this.byId("idNomeTemplate").getValue();
                var templateCF = this.byId("idCF").getValue();
                var templateResidenza = this.byId("idResidenza").getValue();
                var templateEmail = this.byId("idEmail").getValue();
               

                
                

                if (templateNome) {
                    aTableFilters.push(new Filter({
                        path: "cognome",
                        operator: FilterOperator.Contains,
                        value1: templateNome,
                        caseSensitive: false
                    }));
                }


                if (templateCF != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "CF",
                        operator: FilterOperator.Contains,
                        value1: templateCF,
                        caseSensitive: false
                    }));
                }

                if (templateResidenza != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "residenza",
                        operator: FilterOperator.Contains,
                        value1: templateResidenza,
                        caseSensitive: false
                    }));
                }

                if (templateEmail != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "email",
                        operator: FilterOperator.Contains,
                        value1: templateEmail,
                        caseSensitive: false
                    }));
                }
                

                // Apply the filters to the table and update the model with the filters
                this.oTable = this.getView().byId("tablePazienti");
                this.oTable.getBinding("items").filter(aTableFilters);
                oView.getModel("filtersModel").setData(aTableFilters)
                this.oTable.setShowOverlay(false);

                // Update the UI elements to reflect the current filter state 
                if (this.byId("ButtonTutti").hasStyleClass("btn-custom-cta-table")) {
                    this.byId("ButtonTutti").removeStyleClass("btn-custom-cta-table")
                    this.byId("ButtonTutti").addStyleClass("btn btn-custom")
                    this.byId("ButtonCorso").removeStyleClass("btn btn-custom")
                    this.byId("ButtonCorso").addStyleClass("btn-custom-cta-table")
                    this.byId("ButtonConcluso").removeStyleClass("btn btn-custom")
                    this.byId("ButtonConcluso").addStyleClass("btn-custom-cta-table")
                    this.byId("ButtonSospeso").removeStyleClass("btn btn-custom")
                    this.byId("ButtonSospeso").addStyleClass("btn-custom-cta-table")
                }
            },

            onResetFiltersPress: function () {
                var aTableFilters = [];
                aTableFilters.push(new Filter({
                    path: "Status",
                    operator: FilterOperator.NE,
                    value1: "E"
                }));
                this.oTable = this.getView().byId("tablePazienti");
                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);

                //reset the "Stato" buttons to their original state with "Tutti" selected
                var filterBar = this.getView().byId("filterbar");
                // this.byId("ButtonTutti").removeStyleClass("btn-custom-cta-table").addStyleClass("btn btn-custom").setEnabled(true)          
                // this.byId("ButtonCorso").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)
                // this.byId("ButtonConcluso").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)
                // this.byId("ButtonSospeso").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)
                // this.byId("ButtonTerminato").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)

                var filterItems = filterBar.getAllFilterItems().filter(function (item) {
                    return item.getControl();
                });


                filterItems.forEach(function (item) {
                    var control = item.getControl();

                    // Reset the value of the control depending on its type
                    if (control.setValue) {
                        control.setValue("");
                    } else if (control.setSelectedKey) {
                        control.setSelectedKey("");
                    } else if (control.setSelectedKeys) {
                        control.setSelectedKeys([]);
                    } else if (control.setSelected) {
                        control.setSelected(false);
                    } else if (control.setState) {
                        control.setState(false);
                    }
                });
            },
        
            onStatusButtonPress: function (oEvent) {
                var oView = this.getView();

                if(oEvent.getSource().hasStyleClass("btn btn-custom")){
                    return
                } else {
                    for(var i = 0 ; i< oEvent.getSource().getParent().getItems().length;i++){
                        if(oEvent.getSource().getParent().getItems()[i].hasStyleClass("btn btn-custom")){
                            oEvent.getSource().getParent().getItems()[i].removeStyleClass("btn btn-custom")
                            oEvent.getSource().getParent().getItems()[i].addStyleClass("btn-custom-cta-table")
                            
                        }
                    }
                    oEvent.getSource().removeStyleClass("btn-custom-cta-table")
                    oEvent.getSource().addStyleClass("btn btn-custom")
                    
                }
                var sState = oEvent.getSource().getCustomData()[0].getValue();
                var aCurrentFilters = oView.getModel("filtersModel").getData();
                var aFilters = aCurrentFilters.filter(function(oFilter) {
                    return oFilter.sPath !== "StatusRapporto/statusCode";
                });
            
                if (sState && sState !== "tutti") {
                    aFilters.push(new Filter("StatusRapporto/statusCode", FilterOperator.EQ, sState));
                }
                if (sState && sState == "tutti") {
                    aFilters.push(new Filter("StatusRapporto/statusCode", FilterOperator.NE, "T"));
                }
            
                oView.getModel("filtersModel").setData(aFilters);
            
                this.oTable = oView.byId("tablePazienti");
                this.oTable.getBinding("items").filter(aFilters);
                this.oTable.setShowOverlay(false);
            },



        });
    });
