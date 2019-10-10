<template>
  <div class="txt">
    <h1 class="heading">NFT Verification</h1>
    <hr/>
    <div class="row">
      <div class="searchContainer">
        <label for="productCode" class="searchLabel">Product Code:&nbsp;</label>
        <input id="productCode" class="long-input" type="text" v-model="productCode"/>

        <label for="tokenId" class="searchLabel">Token ID:&nbsp;</label>
        <input id="tokenId" class="long-input" type="text" v-model="tokenId" />

        <b-button class="cta-tokenlandia ml-2" @click="performSearch">Search</b-button>
      </div>
    </div>
    <hr/>
    <div v-if="searching">
      <Spinner />
    </div>
    <div id="searchResults" v-if="results">
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
          <h4 class="heading">Unique Identifier: {{productId}}</h4>
          <div class="img-container">
            <img class="img" :src="ipfsURL" alt=""/>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!results && !searching">
      <p v-bind:class="{ 'text-danger': this.error }">Please fill in the search form above.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from "vuex";

import Spinner from './Spinner.vue';

@Component({
    components: { Spinner },
    computed: {
        ...mapGetters('drizzle', ['isDrizzleInitialized']),
        ...mapGetters('contracts', ['getContractData']),
        ...mapGetters(['contractName']),
    }
})
export default class VerifyToken extends Vue {
  getContractData: any;
  isDrizzleInitialized!: boolean;
  contractName!: string;

  searching: boolean = false;

  error: boolean = false;

  productCode: string = '';

  tokenId: string = '';

  ipfsURL: string = '';
  ipfsHash: string = '';

  performSearch() {
    if (this.productId.trim() !== '-') {
      this.error = false;
      this.searching = true;

      this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
          contractName: this.contractName,
          method: 'ipfsUrlForProductId',
          methodArgs: [this.productId]
      });
    } else {
      this.error = true;
    }
  }

  get results(): boolean {
      if (this.searching && this.isDrizzleInitialized) {
          const ipfsUrl = this.getContractData({
              contract: this.contractName,
              method: 'ipfsUrlForProductId'
          });

          if (ipfsUrl !== 'loading') {
              this.ipfsURL = ipfsUrl;
              this.ipfsHash = ipfsUrl.replace('https://ipfs.globalupload.io/', '');
              this.searching = false;
              return true;
          }
      }
      return false;
  }

  get tokenData() {
    return {
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

  get productId(): string {
      return `${this.productCode}-${this.tokenId}`;
  }
}
</script>

<style scoped>
  .img-container {
    margin: 2rem 0;
  }

  .img {
    height: 345px;
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
