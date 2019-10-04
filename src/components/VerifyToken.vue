<template>
  <div class="txt">
    <h1 class="heading">NFT Verification</h1>
    <hr/>
    <div class="row">
      <div class="searchContainer">
        <label for="productId" class="searchLabel">Product ID:&nbsp;</label>
        <input id="productId" class="long-input" type="text" v-model="productId"/>

        <label for="tokenId" class="searchLabel">Token ID:&nbsp;</label>
        <input id="tokenId" class="long-input" type="text" v-model="tokenId" />

        <b-button class="cta-tokenlandia ml-2" @click="performSearch">Search</b-button>
      </div>
    </div>
    <hr/>
    <div id="searchResults" v-if="search">
      <div class="row">
        <div class="col text-left">
          <div>
            <p><strong>Name:</strong> {{tokenData.name}}</p>
          </div>
          <div>
            <p><strong>Description:</strong> {{tokenData.description}}</p>
          </div>
          <div>
            <span class="d-inline-block dateLabel">
              <strong>Purchase Date:</strong> {{tokenData.purchase.date}}
            </span>
            <span><strong>Purchase Location:</strong> {{tokenData.purchase.location}}</span>
          </div>
          <div class="mt-1">
            <span class="d-inline-block dateLabel">
              <strong>Customisation Date:</strong> {{tokenData.customisation.date}}
            </span>
            <span>
              <strong>Customisation Location:</strong> {{tokenData.customisation.location}}
            </span>
          </div>
          <div class="mt-3">
            <p><strong>Brand:</strong> {{tokenData.brand}}</p>
            <p><strong>Model:</strong> {{tokenData.model}}</p>
            <p><strong>Artist:</strong> {{tokenData.artist}}</p>
          </div>
          <div class="mt-3">
            <span>
              <strong>Materials Used:</strong>
              <ul>
                <li v-for="(material, idx) in tokenData.materialsUsed" :key="idx">
                  {{material}}
                </li>
              </ul>
            </span>
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
    <div v-else>
      <p v-bind:class="{ 'text-danger': this.error }">Please fill in the search form above.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class VerifyToken extends Vue {
  search: boolean = false;

  error: boolean = false;

  productId: string = '';

  tokenId: string = '';

  performSearch() {
    if (this.productId.trim() !== '' && this.tokenId.trim() !== '') {
      this.error = false;
      this.search = !this.search;
    } else {
      this.error = true;
    }
  }

  get tokenData() {
    return {
      uniqueItemId: `${this.productId}-${this.tokenId}`,
      name: 'Shogos Sneakers',
      description: 'Legendary Shogo puts his stamp on a classic',
      purchase: {
        date: '02/09/19',
        location: 'London',
      },
      customisation: {
        date: '07/09/19',
        location: 'Glasgow',
      },
      brand: 'Nike',
      model: 'AirMax',
      artist: 'Shogo',
      materialsUsed: [
        'Material 1',
        'Material 2',
        'Material 3',
        'Material 4',
        'Material 5',
      ],
    };
  }
}
</script>

<style scoped>
  .img-container {
    margin: 2rem 0;
  }

  .searchLabel {
    margin: 0.70rem;
  }

  .searchContainer {
    margin-left: auto;
    margin-right: 2rem;
  }

  .long-input {
    width: 215px;
  }

  .dateLabel {
    width: 265px;
  }
</style>
