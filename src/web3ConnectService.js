// @ts-ignore
import Web3Connect from "web3connect";

// @ts-ignore
import Portis from "@portis/web3";

// @ts-ignore
const web3Connect = new Web3Connect.Core({
  network: "mainnet", // optional
  providerOptions: {
    portis: {
      package: Portis, // required
      options: {
        id: "b0863293-e454-4941-88ee-4a5eed9577b7" // required
      }
    },
  }
});

export default web3Connect;
