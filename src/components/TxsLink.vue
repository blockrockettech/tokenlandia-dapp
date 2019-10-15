<template>
    <span v-if="hash">
        <button class="btn btn-link text-muted" @click="visitLink">[View TXS]</button>
    </span>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'txs-link',
        props: [
            'hash'
        ],
        computed: {
            ...mapState(['etherscanBase'])
        },
        methods: {
            visitLink() {
                window.open(`${this.etherscanBase}/tx/${this.hash}`, '_blank');
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
