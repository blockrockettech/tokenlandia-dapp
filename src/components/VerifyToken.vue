<template>
  <div class="txt">
    <h1 class="heading">NFT Verification</h1>
    <hr/>
    <div>
      Search
    </div>
    <hr/>
    <div class="row">
      <div class="col text-left">
        <div>
          <p>Name: {{tokenData.name}}</p>
        </div>
        <div>
          <p>Description: {{tokenData.description}}</p>
        </div>
      </div>
      <div class="col">
        <h4 class="heading">Unique Identifier: {{tokenData.uniqueItemId}}</h4>
        <div class="img-container">
          <img src="http://placekitten.com/200/300" alt=""/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class VerifyToken extends Vue {
  // eslint-disable-next-line class-methods-use-this
  get tokenData() {
    return {
      uniqueItemId: 'JPN-JSH-004-0002-1',
      name: 'Shogos Sneakers',
      description: 'Legendary Shogo puts his stamp on a classic',
    };
  }
}
</script>

<style scoped>
  .img-container {
    margin: 1rem 0;
  }
</style>
