<template>
  <div class="txt">
    <h1 class="heading">NFT Verification</h1>
    <hr/>
    <div class="row">
      <div class="col">

        <b-form inline>

          <b-input-group prepend="Product ID" class="mb-2 mr-sm-2 mb-sm-0">
            <b-input
              id="productId"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="ABC-001..."
              v-model="productId"
            ></b-input>
          </b-input-group>

          <b-input-group prepend="Token ID" class="mb-2 mr-sm-2 mb-sm-0">
            <b-input placeholder="1..."
                     v-model="tokenId">
            </b-input>
          </b-input-group>

          <b-button class="cta-tokenlandia ml-2"
                    @click="performSearch"
                    v-if="!searching"
                    :disabled="!tokenId && !productId">
            Search
          </b-button>

          <b-button class="cta-tokenlandia ml-2"
                    v-if="searching" disabled>
            <SmallSpinner/>
          </b-button>

        </b-form>
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
          <strong>Customization Date:</strong> {{tokenData.customisation.date}}
        </span>
            <span>
          <strong>Customization Location:</strong> {{tokenData.customisation.location}}
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
          <div class="mt-3">
            <a :href="this.attributes._ipfsUrl" class="btn-link" target="_blank">View IPFS data</a>
          </div>
          <div class="mt-3">
            <a :href="etherscanTokenLink(tokenId)" class="btn-link" target="_blank">View on
              Etherscan</a>
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
      <p>
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
        computed: {
            ...mapGetters(['etherscanTokenLink']),
        }
    })
    export default class VerifyToken extends Vue {
        searching: boolean = false;
        noResultFound: boolean = false;

        productId: string = '';
        tokenId: string = '';
        foundTokenId: string = '';

        attributes: any = {};
        ownerOf: string = '';

        ipfsData: any = {};
        ipfsDataRetrieved: boolean = false;

        performSearch() {
            this.ipfsDataRetrieved = false;
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

        get results(): boolean {
            if (this.searching && this.attributes && this.attributes._ipfsUrl) {
                axios.get(this.attributes._ipfsUrl)
                    .then((response: any) => {
                        if (response && response.status === 200) {
                            this.ipfsData = response.data;
                            this.ipfsDataRetrieved = true;
                            this.searching = false;
                        } else {
                            alert(`Unable to retrieve IPFS data for ${this.productId.trim()}`);
                        }
                    });
            }
            return this.ipfsDataRetrieved;
        }

        get tokenData() {
            const {name, description, attributes} = this.ipfsData;

            const data: any = {
                name: name,
                description: description,
                productId: attributes.product_id,
                purchase: {
                    date: attributes.purchase_date,
                    location: attributes.purchase_location,
                },
                customisation: {
                    date: attributes.customization_date,
                    location: attributes.customisation_location,
                },
                brand: attributes.brand,
                model: attributes.model,
                artist: attributes.artist,
                materialsUsed: [],
            };

            data['assistant'] = attributes.artist_assistant ? attributes.artist_assistant : null;

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

  .long-input {
    width: 215px;
  }

  .dateLabel {
    width: 265px;
  }
</style>
