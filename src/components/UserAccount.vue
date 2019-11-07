<template>
  <div class="user-account-container text-left">
    <h1 class="text-center">My Account</h1>
    <hr/>
    <TransferToken :tokens="tokenSummaryToIdMapArray"/>
    <br/>
    <h3 class="text-left">My Tokens</h3>
    <hr/>
    <div v-for="(token, idx) in tokenSummaryToIdMapArray" :key="idx">{{token.text}}</div>
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

        tokenIds: string[] = [];
        tokenSummaryToIdMapArray: any[] = [];

        async fetchTokenInfoFromTokenIDs(tokenIds: string[]) {
            this.tokenIds = tokenIds;
            this.tokenSummaryToIdMapArray = await Promise.all(
                tokenIds.map(async (tokenId: string) => {
                    const attributes = await this.$store.dispatch('attributesForTokenId', tokenId);
                    return {
                        text: `#${tokenId} / ${attributes._productId}`,
                        value: tokenId,
                    }
                })
            );
        }

        @Watch('account')
        onAccountChange(newVal: any, oldVal: any) {
            if (newVal !== oldVal) {
                this.$store.dispatch('tokensOfOwner', newVal)
                    .then(data => this.fetchTokenInfoFromTokenIDs(data));
            }
        }
    }
</script>

<style scoped>

</style>
