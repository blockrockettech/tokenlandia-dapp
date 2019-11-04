<template>
  <div class="user-account-container text-left">
    <h1 class="text-center">Your Web 3 account</h1>
    <hr />
    <TransferToken :tokens="tokenSummaryToIdMap" />
    <br/>
    <h3 class="text-left">All tokens</h3>
    <hr />
    <div v-for="(token, idx) in tokenSummaryToIdMap" :key="idx">{{token.text}}</div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import TransferToken from '@/components/TransferToken.vue';
    import {mapState} from "vuex";

    @Component({
        components: {
            TransferToken,
        },
        computed: {
            ...mapState(['account']),
        }
    })
    export default class UserAccount extends Vue {
        account: any;
        initialised: boolean = false;

        tokenIds: string[] = [];
        tokenSummaryToIdMap: any[] = [];

        async fetchTokenInfoFromTokenIDs(tokenIds: string[]) {
            this.tokenIds = tokenIds;
            this.tokenSummaryToIdMap = tokenIds.map((tokenId: string) => (
                    {
                        text: `#${tokenId} / JPN-JSH`,
                        value: tokenId,
                    }
                )
            )
        }

        @Watch('account')
        onAccountChange(newVal: any) {
            if (!this.initialised && newVal) {
                this.$store.dispatch('tokensOfOwner', newVal)
                    .then(data => this.fetchTokenInfoFromTokenIDs(data));
                this.initialised = true;
            }
        }
    }
</script>

<style scoped>
  /*.user-account-container {
    height: calc(100vh - 100px);
  }*/
</style>
