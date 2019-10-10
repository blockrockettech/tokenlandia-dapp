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
            <p v-if="tokenData.assistant">
              <strong>Assistant:</strong> {{tokenData.assistant}}
            </p>
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
          <h4 class="heading">Unique Identifier: {{tokenData.productId}}</h4>
          <div class="img-container">
            <img class="img" :src="ipfsData.image" alt=""/>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!results && !searching">
      <p v-bind:class="{ 'text-danger': this.error }">
        Please fill in one field from the search form above.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from "vuex";
import axios from 'axios';

import Spinner from './Spinner.vue';

@Component({
    components: { Spinner },
    computed: {
        ...mapGetters('drizzle', ['isDrizzleInitialized']),
        ...mapGetters('contracts', ['getContractData']),
        ...mapGetters(['contractName', 'baseIpfsUrl']),
    }
})
export default class VerifyToken extends Vue {
  getContractData: any;
  isDrizzleInitialized!: boolean;
  contractName!: string;
  baseIpfsUrl!: string;

  searching: boolean = false;

  error: boolean = false;

  productId: string = '';

  tokenId: string = '';

  ipfsURL: string = '';
  ipfsHash: string = '';
  ipfsData: any = {};
  ipfsDataRetrieved: boolean = false;

  performSearch() {
    if (this.productId.trim() !== '') {
      this.error = false;
      this.ipfsDataRetrieved = false;
      this.searching = true;

      this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
          contractName: this.contractName,
          method: 'ipfsUrlForProductId',
          methodArgs: [this.productId]
      });
    } else if (this.tokenId.trim() !== '' && !isNaN(Number(this.tokenId))) {
      this.error = false;
      this.ipfsDataRetrieved = false;
      this.searching = true;

      this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
          contractName: this.contractName,
          method: 'attributes',
          methodArgs: [Number(this.tokenId)]
      });
    } else {
      this.error = true;
      this.searching = false;
      this.ipfsDataRetrieved = false;
    }
  }

  processInfuraResponse(response: any) {
      if (response && response.status === 200) {
          console.log(response);
          this.ipfsData = response.data;
          this.ipfsDataRetrieved = true;
          this.searching = false;
      } else {
          alert(`Unable to retrieve IPFS data for ${this.productId.trim()}`);
      }
  }

  get results(): boolean {
      if (this.searching && this.isDrizzleInitialized) {
          let ipfsUrl = 'loading';
          if (this.productId.trim() !== '') {
              ipfsUrl = this.getContractData({
                  contract: this.contractName,
                  method: 'ipfsUrlForProductId',
                  methodArgs: [this.productId]
              });
          } else if (this.tokenId.trim() !== '' && !isNaN(Number(this.tokenId))) {
              const attributes = this.getContractData({
                  contract: this.contractName,
                  method: 'attributes',
                  methodArgs: [Number(this.tokenId)]
              });

              if (typeof attributes !== 'string' && attributes['_ipfsUrl']) {
                  console.log(attributes);
                  ipfsUrl = attributes._ipfsUrl;
              }
          } else {
              alert("An unknown error has occurred whilst searching - check the search form");
          }

          if (ipfsUrl !== 'loading') {
              this.ipfsURL = ipfsUrl;
              this.ipfsHash = ipfsUrl.replace(this.baseIpfsUrl, '');

              axios.get(ipfsUrl).then(this.processInfuraResponse);

              return this.ipfsDataRetrieved;
          }
      }
      return this.ipfsDataRetrieved;
  }

  get tokenData() {
    const {name, description, attributes} = this.ipfsData;

    const data: any = {
      name: name,
      description: description,
      productId: attributes.productId,
      purchase: {
        date: attributes.purchase_date,
        location: attributes.purchase_location,
      },
      customisation: {
        date: attributes.customisation_date,
        location: attributes.customisation_location,
      },
      brand: attributes.brand,
      model: attributes.model,
      artist: attributes.artist,
      materialsUsed: [],
    };

    data['assistant'] = attributes.artistAssistant ? attributes.artistAssistant : null;

    Object.keys(attributes).forEach(key => {
       if (key.indexOf('material') !== -1) {
           data.materialsUsed.push(attributes[key]);
       }
    });

    return data;
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
