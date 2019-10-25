import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  data: {
    apiUrl: "http://localhost:8090"
  }
}).$mount("#app");
