import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { getProducts } from "@/request.js";
import { deleteProducts } from "@/request.js";
// import { test } from "@/request.js";
/* store */

// test.foo();
// getProducts().then(result => console.log(result));
Vue.config.productionTip = false;
Vue.prototype.$getProducts = getProducts;
Vue.prototype.$deleteProducts = deleteProducts;
// console.log(getProducts().then(result => console.log(result)));
// console.log(deleteProducts);

// fetch data and save to vuex

// export default class Assistant {
//   // constructor() {
//   //   this.data = [];
//   // }
//   // console.log('check one')`

//   async fetchData() {

// }

// async function testData() {
//   let data = [];

//   do {
//     try {
//       data = await getProducts();
//       console.log("good luck");
//     } catch (error) {
//       console.log(error);
//       console.log(
//         `oh, no-o-o, this time luck is not on our side, try next time friend`
//       );
//     }
//   } while (!data);

//   store.commit("setProducts", data);
// }

// testData();

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
