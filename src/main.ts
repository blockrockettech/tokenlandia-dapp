import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import VueForm from 'vue-form';
import VueMoment from 'vue-moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileUpload, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import store from './store';

library.add(faFileUpload);
library.add(faBars);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueMoment);
Vue.use(VueForm, {
  inputClasses: {
    valid: 'form-control-success',
    invalid: 'form-control-danger',
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
