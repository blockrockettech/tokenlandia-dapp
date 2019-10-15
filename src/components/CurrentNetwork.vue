<template>
    <div>
      [{{ networkName }}] <span v-if="account">| Account <a :href="`${etherscanBase}/address/${account}`" v-if="account">{{account}}</a></span>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'currentNetwork',
        computed: {
            ...mapState([
                'networkName',
                'account',
                'etherscanBase'
            ])
        },
    };
</script>

<style lang="scss" scoped>
    @import "../colours.scss";
</style>
