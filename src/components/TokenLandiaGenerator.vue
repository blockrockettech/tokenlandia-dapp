<template>
  <div class="generator-container txt">
    <h1 class="heading">TokenLandia NFT Generator</h1>
    <hr/>
    <h4 class="heading">Unique Identifier:
      <span v-bind:class="{ 'text-success': this.productIdValid }">
        <span v-bind:class="{ 'text-danger': coo === '{COO}' }">{{coo}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': initials === '{INITIALS}' }">{{initials}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': series === '{SERIES}' }">{{series}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': design === '{DESIGN}' }">{{design}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': tokenId === '{TOKEN_ID}' }">{{tokenId}}</span>
      </span>
    </h4>

    <br/>

    <vue-form :state="formState" @submit.prevent="onSubmit">

      <validate auto-label class="form-group required-field d-inline-block mr-3">
        <label for="coo">Country of Origin</label>
        <select name="coo"
                id="coo"
                class="form-control"
                required
                v-model="model.coo">
          <option value="">Please select one</option>
          <option v-for="code in countryCodes" :value="code['alpha-3']">{{code.name}}</option>
        </select>
      </validate>

      <validate auto-label class="form-group required-field d-inline-block mr-3">
        <label for="initials">Artist Initials</label>
        <input type="text"
               name="initials"
               id="initials"
               class="form-control text-uppercase"
               maxlength="4"
               required v-model="model.initials"/>
      </validate>

      <validate auto-label class="form-group required-field d-inline-block mr-3">
        <label for="series">Series</label>
        <input type="number"
               name="series"
               id="series"
               min="1"
               max="999"
               step="1"
               class="form-control"
               required v-model="model.series"/>
      </validate>

      <validate auto-label class="form-group required-field d-inline-block mr-3">
        <label for="design">Design</label>
        <input type="number"
               name="design"
               id="design"
               min="1"
               max="9999"
               step="1"
               class="form-control"
               required v-model="model.design"/>
      </validate>

      <validate auto-label class="form-group required-field d-inline-block">
        <label for="tokenId">Token ID</label>
        <input type="number"
               min="1"
               step="1"
               name="tokenId"
               id="tokenId"
               class="form-control"
               required v-model="model.tokenId"/>
      </validate>

      <div v-if="formState.$dirty && !productIdValid">
        <div class="text-danger">Product ID invalid</div>
      </div>

      <hr/>
      <h4 class="heading">Product Information and Provenance</h4>
      <br/>

      <validate auto-label class="form-group row required-field">
        <label for="name" class="col-sm-3 col-form-label">Name</label>
        <div class="col-sm-9">
          <input type="text"
                 name="name"
                 maxlength="125"
                 id="name"
                 class="form-control"
                 required v-model="model.name"/>

          <field-messages name="name" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">Name is a required field</div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field"
                :class="fieldClassName(formState.description)">
        <label for="description" class="col-sm-3 col-form-label">Description</label>
        <div class="col-sm-9">
            <textarea id="description"
                      name="description"
                      class="form-control"
                      maxlength="300"
                      required
                      v-model.lazy="model.description">
              </textarea>
          <field-messages
            name="description" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">Description is a required field</div>
          </field-messages>
        </div>
      </validate>

      <div class="form-group row required-field">
        <label for="dropzone" class="col-sm-3 col-form-label">Image</label>
        <div class="col-sm-9">
          <vue-dropzone
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            :useCustomSlot="true"
            @vdropzone-file-added="onFileAdded">
            <div class="dropzone-custom-content">
              <h4 class="dropzone-custom-title">Drag and drop the image</h4>
              <div class="subtitle">...or click to select a file from your computer</div>
            </div>
          </vue-dropzone>
        </div>
      </div>

      <validate auto-label class="form-group row required-field">
        <label for="artist" class="col-sm-3 col-form-label">Artist</label>
        <div class="col-sm-9">
          <input type="text"
                 name="artist"
                 id="artist"
                 class="form-control"
                 required v-model="model.artist"/>
          <field-messages
            name="artist" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Artist is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <field class="form-group row">
        <label for="artist_assistant" class="col-sm-3 col-form-label">Assistant</label>
        <div class="col-sm-9">
          <input type="text"
                 name="artist_assistant"
                 id="artist_assistant"
                 class="form-control"
                 v-model.lazy="model.artist_assistant"/>
        </div>
      </field>

      <validate auto-label class="form-group row required-field">
        <label for="brand" class="col-sm-3 col-form-label">Brand</label>
        <div class="col-sm-9">
          <input type="text"
                 name="brand"
                 id="brand"
                 class="form-control"
                 required v-model="model.brand"/>
          <field-messages
            name="brand" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Brand is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="model" class="col-sm-3 col-form-label">Model</label>
        <div class="col-sm-9">
          <input type="text"
                 name="model"
                 id="model"
                 class="form-control"
                 required v-model="model.model"/>
          <field-messages
            name="model" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Model is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="purchLocation" class="col-sm-3 col-form-label">Purchase Location</label>
        <div class="col-sm-9">
          <input type="text"
                 name="purchLocation"
                 id="purchLocation"
                 class="form-control"
                 required v-model="model.purchase_location"/>

          <field-messages
            name="purchLocation" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">Purchase Location is a required field</div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="purchDate" class="col-sm-3 col-form-label">Purchase Date</label>
        <div class="col-sm-9">
          <datepicker name="purchDate"
                      id="purchDate"
                      placeholder="YYYY-MM-DD"
                      input-class="form-control"
                      :typeable="true"
                      :required="true"
                      format="yyyy-MM-dd"
                      v-model="model.purchase_date">
          </datepicker>

          <field-messages
            name="purchDate" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">Purchase Date is a required field</div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="customiseLocation" class="col-sm-3 col-form-label">
          Customization Location
        </label>
        <div class="col-sm-9">
          <input type="text"
                 name="customiseLocation"
                 id="customiseLocation"
                 class="form-control"
                 required v-model="model.customisation_location"/>

          <field-messages
            name="customiseLocation" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Customization Location is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="customiseDate" class="col-sm-3 col-form-label">Customization Date</label>
        <div class="col-sm-9">
          <datepicker name="customiseDate"
                      id="customiseDate"
                      placeholder="YYYY-MM-DD"
                      input-class="form-control"
                      :typeable="true"
                      :required="true"
                      format="yyyy-MM-dd"
                      v-model="model.customisation_date">
          </datepicker>

          <field-messages
            name="customiseDate" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Customization Date is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <hr/>

      <h4 class="heading">Materials Used</h4>
      <br/>

      <validate auto-label class="form-group row required-field">
        <label for="material1" class="col-sm-3 col-form-label">Material 1</label>
        <div class="col-sm-9">
          <input type="text"
                 name="material1"
                 maxlength="40"
                 id="material1"
                 class="form-control"
                 required v-model="model.material_1"/>
          <field-messages
            name="material1" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              One material is required
            </div>
          </field-messages>
        </div>
      </validate>

      <div class="form-group row">
        <label for="material2" class="col-sm-3 col-form-label">Material 2</label>
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
        <label for="material3" class="col-sm-3 col-form-label">Material 3</label>
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
        <label for="material4" class="col-sm-3 col-form-label">Material 4</label>
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
        <label for="material5" class="col-sm-3 col-form-label">Material 5</label>
        <div class="col-sm-9">
          <input type="text"
                 maxlength="40"
                 name="material5"
                 id="material5"
                 class="form-control"
                 v-model="model.material_5"/>
        </div>
      </div>

      <hr/>

      <h4 class="heading">Recipient</h4>
      <br/>

      <validate auto-label class="form-group row required-field">
        <label for="recipient" class="col-sm-3 col-form-label">ETH Address</label>
        <div class="col-sm-9 text-left">
          <input type="text"
                 name="recipient"
                 id="recipient"
                 class="form-control mb-2"
                 minlength="42"
                 maxlength="42"
                 v-model="model.recipient"
                 required/>
          <b-button variant="primary"
                    class="cta-tokenlandia"
                    @click="useCurrentEthAccount"
                    :disabled="!account">
            Use Current
          </b-button>
          <field-messages
            name="recipient" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              ETH Address is required
            </div>
          </field-messages>
        </div>
      </validate>

      <hr/>

      <div class="row">
        <div class="col-12">
          <div class="mt-4">
            <div class="py-2 text-center" v-if="!saving && !mintingTransactionHash">
              <b-button type="submit" class="cta-tokenlandia btn-block btn-lg"
                        :disabled="isMintingDisabled">
                Mint
              </b-button>
              <small v-if="!this.account">Login to web3 to mint new tokens</small>
              <small v-else-if="!canUserMint && accountProperties.canMint === false">
                It doesn't look like you can mint. Double check you're using the correct account.
              </small>
            </div>
            <div class="py-2 text-center" v-else-if="saving && !mintingTransactionHash">
              <b-button type="submit" class="cta-tokenlandia btn-block btn-lg" disabled>
                <SmallSpinner/>
                Uploading data to IPFS...
              </b-button>
            </div>
            <div class="py-2 text-center" v-else-if="mintingTransactionHash">
              <b-button type="submit" class="cta-tokenlandia btn-block btn-lg" disabled>
                Please authorise the transaction...
              </b-button>
            </div>
            <txs-link :hash="mintingTransactionHash"></txs-link>
          </div>
        </div>
      </div>

      <hr/>

      <div class="row">
        <div class="col">
          <a class="btn btn-link text-muted collapse-raw-link" v-b-toggle.collapse-raw-data>
            Raw IPFS Data
          </a>
          <b-collapse id="collapse-raw-data" class="text-left">
            <pre>{{this.getIpfsPayload('TBC')}}</pre>
          </b-collapse>
        </div>
        <div class="col">
          <a class="btn btn-link text-muted"
             v-if="ipfsDataHash !== '' && ipfsDataHash !== 'unsuccessful'"
             :href="baseIpfsUrl + ipfsDataHash" target="_blank">IPFS Link</a>
        </div>
      </div>
    </vue-form>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters, mapState} from "vuex";
    import {Buffer} from 'buffer/';
    import moment from 'moment';
    import _ from 'lodash';

    // @ts-ignore
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    // @ts-ignore
    import Datepicker from 'vuejs-datepicker';

    import SmallSpinner from '@/components/SmallSpinner.vue';
    import TxsLink from "@/components/TxsLink.vue";

    import countryCodes from '../../static/country_codes.json';
    import ipfsHttpClient from 'ipfs-http-client';

    interface Model {
        coo: string,
        initials: string,
        series: string,
        design: string,
        tokenId: string,
        name: string,
        description: string,
        purchase_location: string,
        purchase_date: string,
        customisation_location: string,
        customisation_date: string,
        brand: string,
        model: string,
        artist: string,
        recipient: string,
        artist_assistant: string,
        material_1: string,
        material_2: string,
        material_3: string,
        material_4: string,
        material_5: string,
    }

    @Component({
        computed: {
            ...mapGetters(['isConnected', 'accountProperties']),
            ...mapState(['account']),
        },
        components: {
            TxsLink,
            SmallSpinner,
            Datepicker,
            vueDropzone: vue2Dropzone,
        },
    })
    export default class TokenLandiaGenerator extends Vue {
        isConnected!: boolean;

        baseIpfsUrl: string = 'https://ipfs.infura.io/ipfs/';

        ipfs = ipfsHttpClient('ipfs.infura.io', '5001', {protocol: 'https'});

        formState: any = {};

        model: Model = {
            coo: '',
            initials: '',
            series: '',
            design: '',
            tokenId: '',
            name: '',
            description: '',
            purchase_location: '',
            purchase_date: '',
            customisation_location: '',
            customisation_date: '',
            brand: '',
            model: '',
            artist: '',
            recipient: '',
            artist_assistant: '',
            material_1: '',
            material_2: '',
            material_3: '',
            material_4: '',
            material_5: '',
        };

        dropzoneOptions: any = {
            url: 'https://',
            thumbnailHeight: 75,
            thumbnailWidth: null,
            autoProcessQueue: false,
            maxFilesize: 10,
            maxFiles: 1,
            minFiles: 1,
        };

        file: any = null;
        fileBuffer: any = null;

        countryCodes: any = countryCodes;

        account!: string;
        accountProperties: any;

        mintingTransactionHash: string = '';
        ipfsDataHash: string = '';
        saving: boolean = false;

        useCurrentEthAccount() {
            this.model.recipient = this.account ? this.account : '';
        }

        onFileAdded(file: any) {
            this.file = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                // @ts-ignore
                this.fileBuffer = Buffer.from(reader.result);
            };
            reader.readAsArrayBuffer(file);
        }

        // eslint-disable-next-line class-methods-use-this
        prependPadding(number: string, maxLength: number): string {
            let padding: string = '';
            for (let i: number = 0; i < (maxLength - number.length); i += 1) {
                padding += '0';
            }
            return padding + number;
        }

        async pushBufferToIpfs(buffer: any, tryingToUpload: string): Promise<string> {
            try {
                const results = await this.ipfs.add(buffer, {pin: true});

                if (results && Array.isArray(results) && results.length > 0) {
                    const result = results[0];
                    const hash = result && result.hash ? result.hash : 'unsuccessful';

                    if (hash === 'unsuccessful') {
                        alert(`Failed to upload ${tryingToUpload} to IPFS due to: No hash returned`);
                    }

                    return hash;
                }
            } catch (e) {
                alert(`Failed to upload ${tryingToUpload} to IPFS due to: ${e}`);
            }

            return 'unsuccessful';
        }

        async uploadImageToIpfs(): Promise<string> {
            return this.pushBufferToIpfs(this.fileBuffer, 'image');
        }

        async pushJsonToIpfs(ipfsPayload: any): Promise<string> {
            const buffer = Buffer.from(JSON.stringify(ipfsPayload));
            return this.pushBufferToIpfs(buffer, 'token data');
        }

        getIpfsPayload(imageIpfsUrl: string): any {
            const {
                name,
                description,
                series,
                design,
                purchase_date,
                customisation_date,
                ...basicModel
            } = this.model;

            const cleanModel = _(basicModel)
                .omitBy(_.isUndefined)
                .omitBy(_.isNull)
                .omitBy((value: any) => {
                    return value.trim ? value.trim() === '' : false
                })
                .value();

            return {
                name,
                description,
                image: imageIpfsUrl,
                attributes: {
                    ...cleanModel,
                    product_id: this.productId,
                    series: this.prependPadding(series, 3),
                    design: this.prependPadding(design, 4),
                    purchase_date: moment(purchase_date).format('YYYY-MM-DD'),
                    customization_date: moment(customisation_date).format('YYYY-MM-DD'),
                },
            };
        }

        async onSubmit() {
            console.log(this.formState.$error);
            if (this.formState.$valid) {
                if (!this.file && !this.fileBuffer) {
                    alert("An image has not been uploaded");
                    return;
                }

                this.mintingTransactionHash = '';
                this.saving = true;

                const imageIpfsHash = await this.uploadImageToIpfs();
                if (imageIpfsHash === 'unsuccessful') {
                    this.saving = false;
                    return;
                }

                const imageIpfsUrl = `${this.baseIpfsUrl}${imageIpfsHash}`;
                const ipfsPayload = this.getIpfsPayload(imageIpfsUrl);
                this.ipfsDataHash = await this.pushJsonToIpfs(ipfsPayload);
                if (this.ipfsDataHash === 'unsuccessful') {
                    this.saving = false;
                    return;
                }

                this.$store.dispatch('mintToken', {
                    tokenId: this.tokenId,
                    recipient: this.account,
                    productCode: this.productCode,
                    ipfsHash: this.ipfsDataHash,
                })
                    .then((hash) => {
                        this.mintingTransactionHash = hash;
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.saving = false;
                    });
            }
        }

        // eslint-disable-next-line class-methods-use-this
        fieldClassName(field: any): string {
            if (!field) {
                return '';
            }
            if ((field.$touched || field.$submitted) && field.$valid) {
                return 'has-success';
            }
            if ((field.$touched || field.$submitted) && field.$invalid) {
                return 'has-danger';
            }
            return '';
        }

        get isMintingDisabled(): boolean {
            return !this.account || !this.canUserMint;
        }

        get canUserMint(): boolean {
            return this.account && this.accountProperties.canMint;
        }

        get productIdValid(): boolean {
            return this.coo !== '{COO}' && this.initials !== '{INITIALS}' && this.series !== '{SERIES}'
                && this.design !== '{DESIGN}' && this.tokenId !== '{TOKEN_ID}';
        }

        get coo(): string {
            return this.model.coo ? this.model.coo : '{COO}';
        }

        get initials(): string {
            return this.model.initials ? this.model.initials.toUpperCase() : '{INITIALS}';
        }

        get series(): string {
            return this.model.series ? this.prependPadding(this.model.series, 3) : '{SERIES}';
        }

        get design(): string {
            return this.model.design ? this.prependPadding(this.model.design, 4) : '{DESIGN}';
        }

        get tokenId(): string {
            return this.model.tokenId ? this.model.tokenId : '{TOKEN_ID}';
        }

        get productCode(): string {
            return `${this.coo}-${this.initials}-${this.series}-${this.design}`;
        }

        get productId(): string {
            return `${this.productCode}-${this.tokenId}`;
        }
    }
</script>

<style scoped>
  .generator-container {
    width: 70%;
    margin: 0 auto;
  }

  .dropzone {
    max-height: 125px !important;
    padding-top: 8px !important;
  }

  #collapse-raw-data {
    background-color: #ededeb;
  }

  #collapse-raw-link {
    background-color: #ededeb;
    cursor: pointer;
  }

  @media only screen and (max-width: 1200px) {
    .generator-container {
      width: 90%;
    }
  }

  @media only screen and (max-width: 600px) {
    .generator-container {
      width: 100%;
    }
  }
</style>
