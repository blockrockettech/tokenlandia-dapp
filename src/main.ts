import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import VueForm from 'vue-form';
import VueMoment from 'vue-moment';
import App from './App.vue';
import router from './router';
import store from './store';

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
