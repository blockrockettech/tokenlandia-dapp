<template>
  <div class="txt">
    <h1 class="heading">Activity</h1>
    <hr/>
    <div class="row">
      <div class="col">

      </div>
    </div>

    <div v-if="loading">
      <div>
        <small-spinner></small-spinner>
      </div>

      <hr/>

      <div>

        {{results}}

      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {mapGetters, mapState} from "vuex";

    const TokenlandiaJson = require("../truffleconf/token/Tokenlandia.json");
    import axios from 'axios';

    // @ts-ignore
    import * as Web3 from 'web3';

    import SmallSpinner from "@/components/SmallSpinner.vue";

    @Component({
        components: {SmallSpinner},
        computed: {
            ...mapState({
                networkId: 'networkId',
            }),
            ...mapGetters(['etherscanTokenLink']),
        }
    })
    export default class ActivityPane extends Vue {
        loading: boolean = false;
        results: object[] = [];


        networkId!: number;
        web3!: object;

        // FIXME unsubscribe when destroying component
        subscription!: object;

        created() {
            if (!this.web3) {
                this.web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/27742a31ed334a5cb63ef2560e01b621`));
                console.log("this.web", this.web3);
            }

            // this.findPendingTransactions();
            this.findNewMints();
            this.findPreviousMints();
            this.loading = true;
        }

        findPendingTransactions() {
            if (!this.loading) {
                // @ts-ignore
                this.subscription = this.web3.eth
                    .subscribe('pendingTransactions', (error: any, result: any) => {
                        if (error) console.log(error)
                    })
                    .on("data", async (txHash: any) => {
                        console.log(txHash);
                        // @ts-ignore
                        const transaction = await this.web3.eth.getTransaction(txHash);
                        const valid = this.validateTransaction(transaction);
                        if (valid) {
                            this.results.push(transaction);
                        }
                    });
            }
        }

        validateTransaction(transaction: object) {
            console.log(transaction);
            return transaction !== null;
        }

        findNewMints() {
            console.log('Find newly minted');

            // Generate filter options
            const options = {
                filter: {
                    from: "0x0000000000000000000000000000000000000000",
                },
                fromBlock: '5268503',
                toBlock: 'latest'
            };

            // @ts-ignore
            const address = TokenlandiaJson.networks[this.networkId].address;
            console.log(address);

            // @ts-ignore
            const tokenContract = new this.web3.eth.Contract(
                TokenlandiaJson.abi,
                // @ts-ignore
                address
            );

            //Subscribe to Transfer events matching filter criteria
            tokenContract.events.Transfer(options, async (error: any, event: any) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(event);
                return
            })
        }

        findPreviousMints() {
            console.log('Find previous mints');

            // Generate filter options
            const options = {
                filter: {
                    from: "0x0000000000000000000000000000000000000000",
                },
                fromBlock: 0, // FIXME deployed block
                toBlock: 'latest'
            };

            const address = TokenlandiaJson.networks[this.networkId].address;

            // @ts-ignore
            const tokenContract = new this.web3.eth.Contract(TokenlandiaJson.abi, address);

            tokenContract.getPastEvents('Transfer', options, (error: any, events: any[]) => {
                for (let i = 0; i < events.length; i++) {
                    console.log(events[i]);
                    this.results.push(events);
                }
            });

        }

        @Watch('networkId')
        onNetworkIdSet(val: number, oldVal: number) {
            console.log("networkId", val, oldVal);
            if (val !== 1) {
                this.findPreviousMints();
            }
        }


    }
</script>

<style scoped>

</style>
