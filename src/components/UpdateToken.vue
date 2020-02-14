<template>
  <div class="txt">
    <h1 class="heading">Update General Product Token</h1>
    <hr/>
    <div class="row">
      <div class="col">
        <b-form inline class="my-2">

          <b-input-group prepend="Token ID" class="mb-2 mr-sm-2 mb-sm-0 fixed-width-input">
            <b-input placeholder="1..."
                     v-model="tokenId">
            </b-input>
          </b-input-group>

          <b-button class="ml-2"
                    @click="performTokenSearch"
                    variant="primary"
                    v-if="!searching"
                    :disabled="!tokenId">
            Search
          </b-button>

          <b-button class="ml-2"
                    variant="primary"
                    v-if="searching && tokenId" disabled>
            <SmallSpinner/>
          </b-button>
        </b-form>
      </div>
    </div>
    <div v-if="ipfsData && ipfsDataRetrieved">
      <div class="row">
        <div class="col">
          <div class="my-3">
            <h3 class="text-left">Token Summary</h3>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3">
          <b-card title="Name:" body-bg-variant="primary" class="text-white min-height-card">
            <b-card-body class="text-white">
              <div>
                {{ipfsData.name}}
              </div>
            </b-card-body>
          </b-card>
        </div>
        <div class="col-lg-3">
          <b-card title="Token ID:" body-bg-variant="primary" class="text-white min-height-card">
            <b-card-body class="text-white">
              <div>
                {{foundTokenId}}
              </div>
            </b-card-body>
          </b-card>
        </div>
        <div class="col-lg-3">
          <b-card title="Product ID:" body-bg-variant="primary" class="text-white min-height-card">
            <b-card-body class="text-white">
              <div>
                {{ipfsData.attributes.product_id}}
              </div>
            </b-card-body>
          </b-card>
        </div>
        <div class="col-lg-3">
          <b-card no-body title="Image:" bg-variant="primary" class="text-white min-height-card p-2">
            <img :src="ipfsData.image" style="max-height: 150px;" class="m-auto"/>
          </b-card>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="my-4">
            <h3 class="text-left">Update Provenance Information</h3>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <vue-form :state="formState" @submit.prevent="onSubmit">
            <div class="form-group row">
              <label for="purchaseLocation" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.purchase_location }">
                Purchase Location
              </label>
              <div class="col-sm-9">
                <input type="text"
                       name="purchaseLocation"
                       maxlength="40"
                       id="purchaseLocation"
                       class="form-control"
                       v-model="model.purchase_location"/>
              </div>
            </div>

            <div class="form-group row">
              <label for="purchDate" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.purchase_date }">
                Purchase Date
              </label>
              <div class="col-sm-9">
                <datepicker name="purchDate"
                            id="purchDate"
                            placeholder="YYYY-MM-DD"
                            input-class="form-control bg-white"
                            :typeable="false"
                            :required="true"
                            format="yyyy-MM-dd"
                            :disabled-dates="disabledDates()"
                            v-model="model.purchase_date">
                </datepicker>
              </div>
            </div>

            <div class="form-group row">
              <label for="customiseLocation" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.customization_location }">
                Customization Location
              </label>
              <div class="col-sm-9">
                <input type="text"
                       name="customiseLocation"
                       maxlength="40"
                       id="customiseLocation"
                       class="form-control"
                       v-model="model.customization_location"/>
              </div>
            </div>

            <div class="form-group row">
              <label for="customiseDate" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.customisation_date }">
                Customization Date
              </label>
              <div class="col-sm-9">
                <datepicker name="customiseDate"
                            id="customiseDate"
                            placeholder="YYYY-MM-DD"
                            input-class="form-control bg-white"
                            :typeable="false"
                            :required="true"
                            :disabled-dates="disabledDates()"
                            format="yyyy-MM-dd"
                            v-model="model.customisation_date">
                </datepicker>
              </div>
            </div>

            <h4 class="heading text-left my-3">Materials Used</h4>

            <div class="form-group row">
              <label for="material1" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.material_1 }">
                Material 1
              </label>
              <div class="col-sm-9">
                <input type="text"
                       name="material2"
                       maxlength="40"
                       id="material1"
                       class="form-control"
                       v-model="model.material_1"/>
              </div>
            </div>

            <div class="form-group row">
              <label for="material2" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.material_2 }">
                Material 2
              </label>
              <div class="col-sm-9">
                <input type="text"
                       name="material2"
                       maxlength="40"
                       id="material2"
                       class="form-control"
                       v-model="model.material_2"/>
              </div>
            </div>

            <div class="form-group row">
              <label for="material3" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.material_3 }">
                Material 3
              </label>
              <div class="col-sm-9">
                <input type="text"
                       name="material3"
                       maxlength="40"
                       id="material3"
                       class="form-control"
                       v-model="model.material_3"/>
              </div>
            </div>

            <div class="form-group row">
              <label for="material4" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.material_4 }">
                Material 4
              </label>
              <div class="col-sm-9">
                <input type="text"
                       name="material4"
                       maxlength="40"
                       id="material4"
                       class="form-control"
                       v-model="model.material_4"/>
              </div>
            </div>

            <div class="form-group row">
              <label for="material5" class="col-sm-3 col-form-label text-right"
                     v-bind:class="{ 'text-success': model.material_5 }">
                Material 5
              </label>
              <div class="col-sm-9">
                <input type="text"
                       maxlength="40"
                       name="material5"
                       id="material5"
                       class="form-control"
                       v-model="model.material_5"/>
              </div>
            </div>

            <FormFooter
              :saving="saving"
              :transactionHash="null"
              :isActionBtnDisabled="false"
              actionBtnTxt="Update"
              :formState="formState"
              :generalFormStateInvalid="false"
              invalidFormStateText="Please complete the form above before you can update."
              :ipfsDataHash="null"
              :ipfsPayload="{}" />
          </vue-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from "axios";

    // @ts-ignore
    import Datepicker from 'vuejs-datepicker';
    import SmallSpinner from "./SmallSpinner";
    import FormFooter from "@/components/FormFooter.vue";

    export default {
        name: "UpdateToken",
        components: {SmallSpinner, Datepicker, FormFooter},
        data() {
          return {
            tokenId: null,
            searching: false,
            saving: false,
            ipfsData: null,
            ipfsDataRetrieved: false,
            attributes: null,
            ownerOf: '',
            noResultFound: false,
            foundTokenId: '',
            model: {
              purchase_location: '',
              purchase_date: '',
              customization_location: '',
              customisation_date: '',
              material_1: '',
              material_2: '',
              material_3: '',
              material_4: '',
              material_5: ''
            },
            formState: {}
          }
        },
        methods: {
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
          },
          findInformationForTokenId(tokenId) {
            this.foundTokenId = tokenId;
            this.$store.dispatch('findInformationForTokenId', tokenId)
              .then(({attributes, ownerOf}) => {
                this.attributes = attributes;
                this.ownerOf = ownerOf;
                this.productId = "";
                this.tokenId = "";
                this.currentTokenId = tokenId;

                axios.get(attributes._ipfsUrl)
                  .then((response) => {
                    if (response && response.status === 200) {
                      this.ipfsData = response.data;
                      this.ipfsDataRetrieved = true;
                      this.searching = false;
                    } else {
                      alert(`Unable to retrieve IPFS data for ${this.productId.trim()}`);
                    }
                  });
              })
              .catch(() => {
                this.searching = false;
                this.noResultFound = true;
              });
          },
          disabledDates() {
            const today = new Date();
            return {
              from: today
            }
          },
          onSubmit() {
            alert('update clicked');
          }
        }
    }
</script>

<style scoped>
  .min-height-card {
    min-height: 180px;
  }
</style>
