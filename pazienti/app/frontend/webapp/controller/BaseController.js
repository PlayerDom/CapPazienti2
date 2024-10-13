sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function(Controller, History, UIComponent) {
	"use strict";

	return Controller.extend("frontend.controller.BaseController", {

		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * 
		CONVENTIONS
    	Implement a global onNavBack handler for back navigation in your app
		Query the history and go to the home page if there is no history available for the current app
		 */
		onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("RouteMaster", {}, true /*no history*/);
			}
		},
		_getText : function (sTextId) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId);
		},

	});

});
