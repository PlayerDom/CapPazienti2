sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("frontend.controller.NotFound", {
        /**
         * 
        CONVENTIONS:
        Always configure the bypassed property in the router config in manifest.json
        and a corresponding target
        Use the sap.m.MessagePage control to display routing related error messages
         */
        
		onInit: function () {

		}

	});

});
