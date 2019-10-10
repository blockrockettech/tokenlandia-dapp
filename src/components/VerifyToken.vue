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
          <h4 class="heading">Unique Identifier: {{productId}}</h4>
          <div class="img-container">
            <img class="img" :src="ipfsData.image" alt=""/>
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

  productCode: string = '';

  tokenId: string = '';

  ipfsURL: string = '';
  ipfsHash: string = '';
  ipfsData: any;
  ipfsDataRetrieved: boolean = false;

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
              this.ipfsHash = ipfsUrl.replace(this.baseIpfsUrl, '');

              axios.get(ipfsUrl).then(response => {
                  if (response && response.status === 200) {
                      this.ipfsData = response.data;
                      this.ipfsDataRetrieved = true;
                      this.searching = false;
                  } else {
                      alert(`Unable to retrieve IPFS data for ${this.productId.trim()}`);
                  }
              });

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
      materialsUsed: [
          attributes.material_1,
          attributes.material_2,
          attributes.material_3,
          attributes.material_4,
          attributes.material_5,
      ],
    };

    data['assistant'] = attributes.artistAssistant ? attributes.artistAssistant : null;

    return data;
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
