sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	'./utils/formatter',
	'sap/m/MessageBox'

], function (BaseController, JSONModel, formatter, MessageBox) {
	"use strict";
	/**
	 * Available Keys for the icon tab bar sections
	 */
	var _aValidTabKeys = ["All", "Bio", "Admin"];
	return BaseController.extend("frontend.controller.Author", {
		formatter: formatter,
		onInit: async function () {
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("author").attachMatched(this._onRouteMatched, this);
			await this._setVisibility();

		},

		_setVisibility: function () {

			return new Promise((resolve, reject) => {
				let oView = this.getView();
				let that = this;

				oView.byId("adminTab").bindElement({
					path: "/UserAuthorizations/0",
					events: {
						//change: this._onBindingChange.bind(this),
						dataRequested: function (oEvent) {
							oView.setBusy(true);
						},
						dataReceived: function (oEvent) {
							if (oEvent.getParameters().error) {

								MessageBox.error(that._getText('errorText'));

							}
							oView.setBusy(false);
							resolve();

						}
					}
				});
			});
		},

		_onRouteMatched: function (oEvent) {
			var oArgs, oView, oRouter, oQuery;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oRouter = this.getRouter();

			oView.bindElement({
				path: "/Authors(" + oArgs.authorId + ")",
				events: {
					//change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						if (oEvent.getParameters().error) oRouter.getTargets().display("notFound");
						oView.setBusy(false);
					}
				}
			});


			/**
			 * Manage the icon tab bar target
			 */
			oQuery = oArgs["?query"];
			if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1) {
				oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
			} else {
				// the default query param should be visible at all time
				this.getRouter().navTo("author", {
					authorId: oArgs.authorId,
					"?query": {
						tab: _aValidTabKeys[0]
					}
				}, true /*no history*/);
			}
		},
		_onBindingChange: function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		onTabSelect: function (oEvent) {
			var oCtx = this.getView().getBindingContext();
			this.getRouter().navTo("author", {
				authorId: oCtx.getProperty("ID"),
				"?query": {
					tab: oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/);
		}
	});



});
