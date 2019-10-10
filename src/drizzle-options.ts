import Tokenlandia from "@/truffleconf/token/Tokenlandia.json";

const options = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:9545'
        }
    },

    // The contracts to monitor
    contracts: [Tokenlandia],
    polls: {
        // check accounts every 5 seconds
        accounts: 5000
    }
};

export default options;
