<template>
  <div class="txt">
    <h1 class="heading">NFT Verification</h1>
    <hr/>
    <div class="row">
      <div class="searchContainer">
        <label for="productId" class="searchLabel">Product ID:&nbsp;</label>
        <input id="productId" class=" long-input" type="text" v-model="productId"/>

        <label for="tokenId" class="searchLabel">Token ID:&nbsp;</label>
        <input id="tokenId" class=" long-input" type="number" v-model="tokenId"/>
        <b-button class="cta-tokenlandia ml-2"
                  @click="performSearch"
                  v-if="!searching">
          Search
        </b-button>
        <b-button class="cta-tokenlandia ml-2"
                  v-if="searching" disabled>
          <SmallSpinner/>
        </b-button>
      </div>
    </div>
    <hr/>
    <div v-if="searching && !noResultFound">
      <Spinner/>
    </div>
    <div id="searchResults" v-if="results">
      <div class="row">
        <div class="col text-left">
          <div>
            <p><strong>Owner:</strong> {{ownerOf}}</p>
          </div>
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
          <h4 class="heading">Product ID: {{tokenData.productId}}</h4>
          <h4 class="heading">Token ID: {{foundTokenId}}</h4>
          <div class="img-container">
            <img class="img" :src="ipfsData.image" alt=""/>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!results && !searching && !noResultFound">
      <p v-bind:class="{ 'text-danger': this.error }">
        Please fill in one field from the search form above.
      </p>
    </div>
    <div v-if="noResultFound">
      <p class="text-info">
        No results found
      </p>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters} from "vuex";
    import axios from 'axios';

    import Spinner from './Spinner.vue';
    import SmallSpinner from "@/components/SmallSpinner.vue";

    @Component({
        components: {SmallSpinner, Spinner},
    })
    export default class VerifyToken extends Vue {
        searching: boolean = false;

        error: boolean = false;

        noResultFound: boolean = false;

        productId: string = '';

        tokenId: string = '';
        foundTokenId: string = '';

        attributes: any = {};
        ownerOf: string = '';

        ipfsURL: string = '';
        ipfsData: any = {};
        ipfsDataRetrieved: boolean = false;

        performSearch() {
            this.ipfsDataRetrieved = false;
            this.error = false;
            this.searching = true;
            this.attributes = {};
            this.ownerOf = '';
            this.noResultFound = false;

            const isProductIdSearch = this.productId.trim() !== '';
            const isTokenIdSearch = this.tokenId.trim() !== '' && !isNaN(Number(this.tokenId));

            if (isProductIdSearch) {
                this.$store.dispatch('tokenIdForProductId', this.productId)
                    .then((tokenId) => {
                        this.findInformationForTokenId(tokenId);
                    })
                    .catch(() => {
                        this.noResultFound = true;
                        this.searching = false;
                    });
            } else if (isTokenIdSearch) {
                this.findInformationForTokenId(this.tokenId);
            }
        }

        findInformationForTokenId(tokenId: any) {
            this.foundTokenId = tokenId;

            this.$store.dispatch('findInformationForTokenId', tokenId)
                .then(({attributes, ownerOf}) => {
                    this.attributes = attributes;
                    this.ownerOf = ownerOf;
                })
                .catch(() => {
                    this.searching = false;
                    this.noResultFound = true;
                });
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
            if (this.searching && this.attributes) {
                this.ipfsURL = this.attributes._ipfsUrl;
                axios.get(this.ipfsURL).then(this.processInfuraResponse);
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
