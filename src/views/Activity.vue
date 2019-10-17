<template>
  <div class="verify">
    <ActivityPane />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ActivityPane from '@/components/ActivityPane.vue';

@Component({
  components: {
      ActivityPane,
  },
})
export default class Activity extends Vue {}
</script>
