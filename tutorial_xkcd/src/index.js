"use strict";
exports.__esModule = true;
require("../style/index.css");
/**
 * Initialization data for the tutorial xks extension.
 */
var extension = {
    id: 'tutorial xks',
    autoStart: true,
    activate: function (app) {
        console.log('JupyterLab extension tutorial xks is activated!');
    }
};
exports["default"] = extension;
// "compilerOptions": {
//     "noUnusedLocals": false;
//   },
