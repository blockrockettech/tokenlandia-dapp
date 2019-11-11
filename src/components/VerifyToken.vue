<template>
  <div class="verify-container txt">
    <h1 class="heading">NFT Verification</h1>
    <hr/>
    <div class="row">
      <div class="col">

        <b-form inline class="my-2">

          <b-input-group prepend="Product ID" class="mb-2 mr-sm-2 mb-sm-0">
            <b-input
              id="productId"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="ABC-001..."
              v-model="productId"
            ></b-input>
          </b-input-group>

          <b-button class="cta-tokenlandia ml-2"
                    @click="performProductSearch"
                    v-if="!searching"
                    :disabled="!productId">
            Search
          </b-button>

          <b-button class="cta-tokenlandia ml-2"
                    v-if="searching && productId" disabled>
            <SmallSpinner/>
          </b-button>
        </b-form>

        <b-form inline class="my-2">

          <b-input-group prepend="Token ID" class="mb-2 mr-sm-2 mb-sm-0">
            <b-input placeholder="1..."
                     v-model="tokenId">
            </b-input>
          </b-input-group>

          <b-button class="cta-tokenlandia ml-2"
                    @click="performTokenSearch"
                    v-if="!searching"
                    :disabled="!tokenId">
            Search
          </b-button>

          <b-button class="cta-tokenlandia ml-2"
                    v-if="searching && tokenId" disabled>
            <SmallSpinner/>
          </b-button>
        </b-form>
      </div>
    </div>

    <div v-if="searching && !noResultFound">
      <Spinner/>
    </div>

    <div id="searchResults" v-if="results" class="my-4">
      <div class="row">
        <div class="col text-left">

          <h4 class="heading text-center">Product ID: {{tokenData.productId}}</h4>
          <table class="table table-striped table-borderless">
            <tbody>
              <tr>
                <td>Token ID</td>
                <td>{{foundTokenId}}</td>
              </tr>
              <tr>
                <td>Owner</td>
                <td class="small">{{ownerOf}}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{{tokenData.name}}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{{tokenData.description}}</td>
              </tr>
              <tr>
                <td>Purchase Date</td>
                <td>{{tokenData.purchase.date}}</td>
              </tr>
              <tr>
                <td>Purchase Location</td>
                <td>{{tokenData.purchase.location}}</td>
              </tr>
              <tr>
                <td>Customization Date</td>
                <td>{{tokenData.customisation.date}}</td>
              </tr>
              <tr>
                <td>Customization Location</td>
                <td>{{tokenData.customisation.location}}</td>
              </tr>
              <tr>
                <td>Brand</td>
                <td>{{tokenData.brand}}</td>
              </tr>
              <tr>
                <td>Model</td>
                <td>{{tokenData.model}}</td>
              </tr>
              <tr>
                <td>Artist</td>
                <td>{{tokenData.artist}}</td>
              </tr>
              <tr v-if="tokenData.assistant">
                <td>Assistant</td>
                <td>{{tokenData.assistant}}</td>
              </tr>
            </tbody>
          </table>

          <div>
            <span>
              <strong>Materials Used:</strong>
              <ul>
                <li v-for="(material, idx) in tokenData.materialsUsed" :key="idx">
                  {{material}}
                </li>
              </ul>
            </span>
          </div>

          <div class="row my-2">
            <div class="col">
              <a :href="this.attributes._ipfsUrl" class="btn-link" target="_blank">View IPFS data</a>
            </div>
            <div class="col">
              <a :href="etherscanTokenLink(tokenId)" class="btn-link" target="_blank">View on
                Etherscan</a>
            </div>
          </div>

        </div>
        <div class="col">
          <div class="img-container">
            <img class="img" :src="ipfsData.image" alt=""/>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!results && !searching && !noResultFound" class="mt-4">
      <p>
        Please fill in one field from the search form above.
      </p>
    </div>
    <div v-if="noResultFound" class="mt-4">
        No results found
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

    performTokenSearch() {
      this.ipfsDataRetrieved = false;
      this.searching = true;
      this.attributes = {};
      this.ownerOf = '';
      this.noResultFound = false;

      const isTokenIdSearch = this.tokenId.trim() !== '' && !isNaN(Number(this.tokenId));
      if (isTokenIdSearch) {
        this.findInformationForTokenId(this.tokenId);
      }
    }

    performProductSearch() {
      this.ipfsDataRetrieved = false;
      this.searching = true;
      this.attributes = {};
      this.ownerOf = '';
      this.noResultFound = false;

      const isProductIdSearch = this.productId.trim() !== '';


      if (isProductIdSearch) {
        this.$store.dispatch('tokenIdForProductId', this.productId)
          .then((tokenId) => {
            this.findInformationForTokenId(tokenId);
          })
          .catch(() => {
            this.noResultFound = true;
            this.searching = false;
          });
      }
    }

    findInformationForTokenId(tokenId: any) {
      this.foundTokenId = tokenId;
      this.$store.dispatch('findInformationForTokenId', tokenId)
        .then(({attributes, ownerOf}) => {
          this.attributes = attributes;
          this.ownerOf = ownerOf;
          this.productId = "";
          this.tokenId = "";
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

<style lang="scss" scoped>
  @import "../colours.scss";

  .img-container {
    margin: 2rem 0;
  }

  .img {
    height: 345px;
  }

  .verify-container {
    height: calc(100vh - 170px);
  }

  .dateLabel {
    width: 265px;
  }

  strong {
    color: $gray;
    font-weight: normal;
  }
</style>
