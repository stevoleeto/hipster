/*
 * FileName: app.js
 * Authors: Joe d'Eon, Michael Cho (if you edit this file, add your name to this list)
 * Description: This file assigns the main angular module into a variable called app. The module
                is called 'myApp' and contains the following dependencies:
                
                    -'ui.calendar'
                    -'ui.bootstrap'
                    -'angular-loading-bar'
 *
 * Attributes: app     - angular module that is copy of myApp module.
 *            
 *
*/

var app = angular.module("myApp", ['ui.calendar', 'ui.bootstrap', 'angular-loading-bar']);