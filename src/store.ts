import Vue from 'vue';
import Vuex from 'vuex';

const ethers = require("ethers");
const TokenlandiaJson = require("./truffleconf/token/Tokenlandia.json");

Vue.use(Vuex);

const ethersStaticProvider = new ethers.providers.InfuraProvider("rinkeby", "27742a31ed334a5cb63ef2560e01b621");

export default new Vuex.Store({
  state: {
    tokenLandiaContract: new ethers.Contract(TokenlandiaJson.networks['4'].address, TokenlandiaJson.abi, ethersStaticProvider)
  },
  mutations: {},
  actions: {
    checkCanMint({state, commit, dispatch}, ethAddress) {
      try {
        return state.tokenLandiaContract.isWhitelisted(ethAddress);
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    tokenIdForProductId({state, commit, dispatch}, productId) {
      try {
        return state.tokenLandiaContract.tokenIdForProductId(productId);
      } catch (e) {
        return Promise.reject(null);
      }
    },

    findInformationForTokenId({state, commit, dispatch}, tokenId) {
      try {
        return Promise.all([
          state.tokenLandiaContract.attributes(tokenId),
          state.tokenLandiaContract.ownerOf(tokenId),
        ])
          .then(([attributes, ownerOf]) => {
            return {attributes, ownerOf};
          })
      } catch (e) {
        return Promise.reject(false);
      }
    },

    checkIsAdmin({state, commit, dispatch}, ethAddress) {
      try {
        return state.tokenLandiaContract.isWhitelistAdmin(ethAddress);
      } catch (e) {
        return Promise.resolve(false);
      }
    },
  },
  getters: {
    contractName: () => {
      return 'Tokenlandia';
    },
    baseIpfsUrl: () => {
      return 'https://ipfs.infura.io/ipfs/';
    },
    isConnected() {
      // @ts-ignore
      return window.web3 !== undefined && window.web3.isConnected()
    }
  }
});
