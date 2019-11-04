<template>
  <div class="user-account-container">
    <h1>Your Web 3 account</h1>
    <hr />
  </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class UserAccount extends Vue {}
</script>

<style scoped>
  .user-account-container {
    height: calc(100vh - 100px);
  }
</style>
