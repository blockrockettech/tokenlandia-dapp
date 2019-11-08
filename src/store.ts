import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger'

// @ts-ignore
import * as Web3 from 'web3';

const {getNetworkName} = require("@blockrocket/utils");
const TokenlandiaJson = require("./truffleconf/token/Tokenlandia.json");

Vue.use(Vuex);

let tokenLandiaContract: any = {};

function getWhitelistedAddresses({addedEventName, removedEventName, tokenContract, options, resolve, reject}: any) {
  tokenContract.getPastEvents(addedEventName, options, (error: any, events: any[]) => {
    if (error) reject(error);
    if (!events) reject(new Error(`${addedEventName} events came back undefined`));
    if (!events.length) resolve([]);

    const whitelistedAddedCount: any = {};
    const addedAddresses = events.map((event: any) => {
      const address = event.returnValues.account;
      whitelistedAddedCount[address] =
        whitelistedAddedCount[address] ? whitelistedAddedCount[address] + 1 : 1;
      return address;
    });

    // eslint-disable-next-line no-shadow
    tokenContract.getPastEvents(removedEventName, options, (error: any, events: any[]) => {
      if (error) reject(error);
      if (!events) reject(new Error(`${removedEventName} events came back undefined`));
      if (!events.length) resolve(addedAddresses);

      const whitelistedRemoveCount: any = {};
      events.forEach((event: any) => {
        const address = event.returnValues.account;
        whitelistedRemoveCount[address] =
          whitelistedRemoveCount[address] ? whitelistedRemoveCount[address] + 1 : 1;
      });

      const currentlyWhitelistedAddresses: string[] = [];
      Object.keys(whitelistedAddedCount).forEach((address: string) => {
        const addedCount = whitelistedAddedCount[address];
        const removedCount = whitelistedRemoveCount[address] ?
          whitelistedRemoveCount[address] : 0;

        if (addedCount > removedCount) {
          currentlyWhitelistedAddresses.push(address);
        }
      });

      resolve(currentlyWhitelistedAddresses);
    });
  });
}

export default new Vuex.Store({
  plugins: [createLogger()],
  state: {
    // Network
    networkId: 1,
    networkName: 'Mainnet',
    etherscanBase: 'https://etherscan.io',

    // Account
    account: null,
    accountProperties: {
      canMint: null,
    },

    // Countracts
    web3: null,
    tokenLandiaContract: tokenLandiaContract,
  },
  mutations: {
    networkDetails(state, {networkId, networkName, etherscanBase}) {
      state.networkId = networkId;
      state.networkName = networkName;
      state.etherscanBase = etherscanBase;
      // @ts-ignore
      state.tokenLandiaContract = new state.web3.eth.Contract(TokenlandiaJson.abi, TokenlandiaJson.networks[state.networkId].address);
    },
    account(state, account) {
      state.account = account;
    },
    web3(state, web3) {
      state.web3 = web3;
    },
    updateCanCurrentAccountMint(state, canMint) {
      state.accountProperties.canMint = canMint;
    },
  },
  getters: {
    isConnected() {
      // @ts-ignore
      return window.web3 !== undefined;
    },
    etherscanTokenLink: state => (tokenId: number) => {
      const networkAddress = TokenlandiaJson.networks[state.networkId].address;
      return `${state.etherscanBase}/token/${networkAddress}?a=${tokenId}`;
    },
    accountProperties: state => state.accountProperties,
  },
  actions: {

    bootstrap({dispatch}, provider) {
      dispatch('loginWeb3', provider);
    },

    /////////////////////////
    // Web3 initialisation //
    /////////////////////////

    async loginWeb3({dispatch, state}, provider) {
      if (!state.account) {
        // @ts-ignore
        /* if (window.ethereum) {
           console.log('Init modern web3');
           try {
             // @ts-ignore
             window.web3 = new Web3(ethereum);
             // Request account access if needed
             // @ts-ignore
             await ethereum.enable();
             // @ts-ignore
             dispatch('initWeb3', window.web3);
           } catch (error) {
             console.log(error);
             alert('Access denied - we need access to your wallet to fully connect to the site');
             dispatch('setupStaticWeb');
           }
         }
         // Legacy dapp browsers...
         // @ts-ignore
         else if (window.web3) {
           console.log('Init legacy web3');
           // @ts-ignore
           window.web3 = new Web3(web3.currentProvider);
           // @ts-ignore
           dispatch('initWeb3', window.web3);
         } else {
           console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
           dispatch('setupStaticWebs');
         }*/
        // @ts-ignore
        window.web3 = new Web3(provider);
        // @ts-ignore
        dispatch('initWeb3', window.web3);
      }
    },

    initWeb3({commit, dispatch}, web3) {
      commit('web3', web3);

      dispatch('getNetwork').then(() => {
        web3.eth.getAccounts((error: any, accounts: any) => {
          if (!error) {
            const account = accounts[0];
            commit('account', account);

            dispatch('checkCanMint', account)
              .then((data) => {
                commit('updateCanCurrentAccountMint', data);
              })
              .catch(() => commit('updateCanCurrentAccountMint', false));
          } else {
            console.log(`Error getting accounts`, error);
          }
        });
      });
    },

    setupStaticWeb3({dispatch, commit}) {
      console.log(`No web3 provider found, defaulting to static web3 instance`);
      const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/27742a31ed334a5cb63ef2560e01b621`));
      // @ts-ignore
      window.web3 = web3;
      dispatch('initWeb3', web3);
    },

    async getNetwork({commit, dispatch}) {
      const networkId = await dispatch('getNetworkId');
      const networkName = await getNetworkName(networkId);
      const etherscanBase = await dispatch('getEtherscanAddress', networkId);
      return commit('networkDetails', {networkId, networkName, etherscanBase});
    },

    getNetworkId({state}) {
      // @ts-ignore
      return state.web3.eth.net.getId();
    },

    getEtherscanAddress({}, networkId) {
      switch (networkId) {
        case 1:
          return 'https://etherscan.io';
        case 4:
          return 'https://rinkeby.etherscan.io';
        default:
          return '';
      }
    },

    ////////////////////
    // Contract calls //
    ////////////////////

    tokenIdForProductId({state}, productId) {
      try {
        return state.tokenLandiaContract.methods.tokenIdForProductId(productId).call();
      } catch (e) {
        return Promise.reject(null);
      }
    },

    findInformationForTokenId({state}, tokenId) {
      try {
        return Promise.all([
          state.tokenLandiaContract.methods.attributes(tokenId).call(),
          state.tokenLandiaContract.methods.ownerOf(tokenId).call(),
        ])
          .then(([attributes, ownerOf]) => {
            return {attributes, ownerOf};
          })
      } catch (e) {
        return Promise.reject(false);
      }
    },

    attributesForTokenId({state}, tokenId) {
      return state.tokenLandiaContract.methods.attributes(tokenId).call();
    },

    mintToken({state}, {tokenId, recipient, productCode, ipfsHash}) {
      return new Promise((resolve, reject) => {
        state.tokenLandiaContract.methods.mintToken(tokenId, recipient, productCode, ipfsHash)
          .send({
            from: state.account
          })
          .once('transactionHash', resolve)
          .on('error', reject);
      });
    },

    transferToken({state}, {recipient, tokenId}) {
      return new Promise((resolve, reject) => {
        const from = state.account;
        state.tokenLandiaContract.methods.transferFrom(from, recipient, tokenId)
          .send({from})
          .once('transactionHash', resolve)
          .on('error', reject);
      });
    },

    checkIsAdmin({state, commit, dispatch}, ethAddress) {
      try {
        return state.tokenLandiaContract.methods.isWhitelistAdmin(ethAddress).call();
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    checkCanMint({state, commit, dispatch}, ethAddress) {
      try {
        return state.tokenLandiaContract.methods.isWhitelisted(ethAddress).call();
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    tokensOfOwner({state, commit, dispatch}, ethAddress) {
      try {
        return state.tokenLandiaContract.methods.tokensOfOwner(ethAddress).call();
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    addWhitelisted({state}, ethAddress) {
      return new Promise((resolve, reject) => {
        state.tokenLandiaContract.methods.addWhitelisted(ethAddress)
          .send({
            from: state.account
          })
          .once('transactionHash', resolve)
          .on('error', reject);
      });
    },

    removeWhitelisted({state}, ethAddress) {
      return new Promise((resolve, reject) => {
        state.tokenLandiaContract.methods.removeWhitelisted(ethAddress)
          .send({
            from: state.account
          })
          .once('transactionHash', resolve)
          .on('error', reject);
      });
    },

    addWhitelistAdmin({state}, ethAddress) {
      return new Promise((resolve, reject) => {
        state.tokenLandiaContract.methods.addWhitelistAdmin(ethAddress)
          .send({
            from: state.account
          })
          .once('transactionHash', resolve)
          .on('error', reject);
      });
    },

    renounceWhitelistAdmin({state}) {
      return new Promise((resolve, reject) => {
        state.tokenLandiaContract.methods.renounceWhitelistAdmin()
          .send({
            from: state.account
          })
          .once('transactionHash', resolve)
          .on('error', reject);
      });
    },

    fetchAllWhitelistedAddresses({state}) {
      return new Promise((resolve, reject) => {
        const options = {
          fromBlock: 0, // FIXME deployed block
          toBlock: 'latest',
        };
        // @ts-ignore
        const tokenContract = state.tokenLandiaContract;
        getWhitelistedAddresses({
          addedEventName: 'WhitelistedAdded',
          removedEventName: 'WhitelistedRemoved',
          tokenContract,
          options,
          resolve,
          reject
        })
      });
    },

    fetchAllAdminWhitelistedAddresses({state}) {
      return new Promise((resolve, reject) => {
        const options = {
          fromBlock: 0, // FIXME deployed block
          toBlock: 'latest',
        };
        // @ts-ignore
        const tokenContract = state.tokenLandiaContract;
        getWhitelistedAddresses({
          addedEventName: 'WhitelistAdminAdded',
          removedEventName: 'WhitelistAdminRemoved',
          tokenContract,
          options,
          resolve,
          reject
        })
      });
    },

  }
});
