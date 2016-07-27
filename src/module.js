import angular from 'angular';
import foundationShim from './foundationShim';
import 'ngcomponentrouter';
import social from 'angular-socialshare';
import sanitizer from 'angular-sanitize';
import routerIsActive from 'angular-component-router-active';
import {name as analytics} from 'angular-google-analytics';

const moduleName = 'StoriesFromSyria';

const dependencies = ['ngComponentRouter', sanitizer, routerIsActive, social, foundationShim, analytics];

const module = angular.module(moduleName, dependencies);

export { module, moduleName, module as default }