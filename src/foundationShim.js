window.angular = require('angular');

let module = 'foundation';

require('foundation-apps/js/angular/services/foundation.core.animation');
require('foundation-apps/js/angular/services/foundation.core');
require('foundation-apps/js/angular/services/foundation.mediaquery');
require('foundation-apps/js/angular/services/foundation.dynamicRouting');
require('foundation-apps/js/angular/components/accordion/accordion');
require('foundation-apps/js/angular/components/actionsheet/actionsheet');
require('foundation-apps/js/angular/components/common/common');
require('foundation-apps/js/angular/components/iconic/iconic');
require('foundation-apps/js/angular/components/interchange/interchange');
require('foundation-apps/js/angular/components/modal/modal');
require('foundation-apps/js/angular/components/notification/notification');
require('foundation-apps/js/angular/components/offcanvas/offcanvas');
require('foundation-apps/js/angular/components/panel/panel');
require('foundation-apps/js/angular/components/popup/popup');
require('foundation-apps/js/angular/components/tabs/tabs');
require('foundation-apps/js/angular/foundation');
require('foundation-apps/dist/js/foundation-apps-templates');


export { module, module as default }