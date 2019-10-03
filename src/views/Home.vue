<template>
  <div class="home">
    <TokenLandiaGenerator />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TokenLandiaGenerator from '@/components/TokenLandiaGenerator.vue';

@Component({
  components: {
    TokenLandiaGenerator,
  },
})
export default class Home extends Vue {}
</script>
