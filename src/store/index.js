import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loaded: false,
    products: []
  },
  getters: {
    getProducts: state => {
      return state.products;
    },
    getStatus: state => {
      return state.loaded;
    },
    getLengthOfProducts: state => {
      return state.products.length;
    }
  },
  mutations: {
    setProducts(state, array) {
      state.products = array;
      state.loaded = true;
    },
    deleteProductByIndex(state, index) {
      state.products.splice(index, 1);
    },
    deleteProductById(state, id) {
      let index = state.products.findIndex(el => el.id === id);
      state.products.splice(index, 1);
    }
  },
  actions: {
    async deleteProduct({ commit }, id) {
      this._vm
        .$deleteProducts()
        .then(resolve => {
          console.log(resolve);
          commit("deleteProductById", id);
        })
        .catch(error => {
          alert(`Ops,you should did it again`);
          console.log(error);
        });
    },
    async deleteProducts({ commit }, ides) {
      this._vm
        .$deleteProducts()
        .then(resolve => {
          console.log(resolve);
          for (let id of ides) {
            commit("deleteProductById", id);
          }
        })
        .catch(error => {
          alert(`Ops,you should did it again`);
          console.log(error);
        });
    }
  },
  modules: {}
});
