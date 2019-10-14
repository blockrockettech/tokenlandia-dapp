import Tokenlandia from "@/truffleconf/token/Tokenlandia.json";

const options = {
  web3: {
    block: false,
    fallback: false
    // fallback: {
    //     type: 'ws',
    //     url: 'wss://rinkeby.infura.io/ws/v3/27742a31ed334a5cb63ef2560e01b621'
    // }
  },

  // The contracts to monitor
  contracts: [Tokenlandia],
  polls: {
    // check accounts every 5 seconds
    accounts: 5000
  }
};

export default options;
