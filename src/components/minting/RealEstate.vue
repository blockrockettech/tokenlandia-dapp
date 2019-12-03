<template>
  <div class="generator-container txt">
    <h1 class="heading">TokenLandia Real Estate NFT Generator</h1>
    <hr/>

    <div class="alert alert-warning" v-if="!this.account">You must "Login" to mint new tokens</div>
    <div class="alert alert-warning" v-else-if="!canUserMint && accountProperties.canMint === false">
      It doesn't look like you can mint. Double check you're using the correct account.
    </div>

    <!-- Unique Identifier -->
    <h4 class="heading">Unique Identifier:
      <span v-bind:class="{ 'text-success': this.productIdValid }">
        <span v-bind:class="{ 'text-danger': coo === '{DEVELOPER}' }">{{coo}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': initials === '{CITY}' }">{{initials}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': series === '{ADDRESS}' }">{{series}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': tokenId === '{TOKEN_ID}' }">{{tokenId}}</span>
      </span>
    </h4>

    <br/>

    <vue-form :state="formState" @submit.prevent="onSubmit">

      <validate auto-label class="form-group required-field d-inline-block mr-3">
        <label for="coo">Developer</label>
        <select name="coo"
                id="coo"
                class="form-control"
                required
                v-model="model.developer">
          <option value="">Please select one</option>
          <option v-for="code in developerCodes" :value="code['alpha-3']">{{code.name}}</option>
        </select>
      </validate>

      <validate auto-label class="form-group required-field d-inline-block mr-3">
        <label for="initials">City</label>
        <select name="initials"
                id="initials"
                class="form-control"
                required
                v-model="model.initials">
          <option value="">Please select one</option>
          <option v-for="code in cityCodes" :value="code['alpha-3']">{{code.name}}</option>
        </select>
      </validate>

      <validate auto-label class="form-group required-field d-inline-block mr-3">
        <label for="series">Series</label>
        <input type="text"
               name="series"
               id="series"
               class="form-control"
               required v-model="model.series"/>
      </validate>


      <validate auto-label class="form-group required-field d-inline-block">
        <label for="tokenId">Token ID</label>
        <input type="number"
               min="1"
               step="1"
               name="tokenId"
               id="tokenId"
               class="form-control"
               required v-model="model.token_id"/>
      </validate>

      <div v-if="model.token_id && formState.tokenId.$dirty && !isCheckingTokenId ">
        <div class="text-danger" v-if="tokenIdAlreadyAssigned">
          <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg">
          </font-awesome-icon>
          Token ID already assigned
        </div>
        <div class="text-success" v-if="!tokenIdAlreadyAssigned">
          <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg">
          </font-awesome-icon>
          Token ID not assigned
        </div>
      </div>

      <hr/>
      <h4 class="heading">Information and Provenance</h4>
      <br/>

      <validate auto-label class="form-group row required-field"
                :class="fieldClassName(formState.property_address)">
        <label for="property_address" class="col-sm-3 col-form-label">Property Address</label>
        <div class="col-sm-9">
            <textarea id="property_address"
                      name="property_address"
                      class="form-control"
                      maxlength="300"
                      required
                      v-model.lazy="model.property_address">
              </textarea>
          <field-messages
            name="property_address" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">Property Address is a required field</div>
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
            :duplicateCheck="true"
            @vdropzone-file-added="onFileAdded">
            <div class="dropzone-custom-content">
              <h4 class="dropzone-custom-title">Drag and drop the image</h4>
              <div class="subtitle">...or click to select a file from your computer</div>
            </div>
          </vue-dropzone>
        </div>
      </div>

      <validate auto-label class="form-group row required-field">
        <label for="year_built" class="col-sm-3 col-form-label">Year Built</label>
        <div class="col-sm-9">
          <input type="text"
                 name="year_built"
                 id="year_built"
                 class="form-control"
                 required v-model="model.year_built"/>
          <field-messages
            name="yearBuilt" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Year Built is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="community_name" class="col-sm-3 col-form-label">Community Name</label>
        <div class="col-sm-9">
          <input type="text"
                 name="community_name"
                 id="community_name"
                 class="form-control"
                 required v-model="model.community_name"/>
          <field-messages
            name="community_name" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Community Name is a required field
            </div>
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
        <label for="maintenance_costs" class="col-sm-3 col-form-label">Maintenance Costs</label>
        <div class="col-sm-9">
          <input type="text"
                 name="maintenance_costs"
                 id="maintenance_costs"
                 class="form-control"
                 required v-model="model.maintenance_costs"/>
          <field-messages
            name="maintenance_costs" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Maintenance Costs is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="insurance_costs" class="col-sm-3 col-form-label">Insurance Costs</label>
        <div class="col-sm-9">
          <input type="text"
                 name="insurance_costs"
                 id="insurance_costs"
                 class="form-control"
                 required v-model="model.insurance_costs"/>

          <field-messages
            name="insurance_costs" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">Insurance Costs is a required field</div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="taxes" class="col-sm-3 col-form-label">
          Taxes
        </label>
        <div class="col-sm-9">
          <input type="text"
                 name="taxes"
                 id="taxes"
                 class="form-control"
                 required v-model="model.taxes"/>

          <field-messages
            name="taxes" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">
              Taxes is a required field
            </div>
          </field-messages>
        </div>
      </validate>

      <validate auto-label class="form-group row required-field">
        <label for="rental_income" class="col-sm-3 col-form-label">Rental Income</label>
        <div class="col-sm-9">
          <input type="text"
                 name="rental_income"
                 id="rental_income"
                 class="form-control"
                 required v-model="model.rental_income"/>

          <field-messages
            name="rental_income" show="$touched || $submitted" class="form-control-feedback">
            <div slot="required" class="text-danger">Rental Income is a required field</div>
          </field-messages>
        </div>
      </validate>

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
          <b-button variant="link"
                    @click="useCurrentEthAccount"
                    v-if="account">
            use current account
          </b-button>

          <span v-if="model.recipient && formState.recipient.$dirty" class="float-right">
            <span class="text-danger" v-if="!validateAddress(model.recipient)">
              <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg">
              </font-awesome-icon> Invalid recipient
            </span>
            <span class="text-success" v-if="validateAddress(model.recipient)">
              <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg">
              </font-awesome-icon> Valid recipient
            </span>
          </span>

          <!--          <field-messages-->
          <!--            name="recipient" show="$touched || $submitted" class="form-control-feedback">-->
          <!--            <div slot="required" class="text-danger">-->
          <!--              ETH Address is required-->
          <!--            </div>-->
          <!--          </field-messages>-->
        </div>
      </validate>

      <div class="row">
        <div class="col-12">
          <div class="mt-4">
            <div class="py-2 text-center" v-if="!saving && !mintingTransactionHash">
              <b-button type="submit" class="cta-tokenlandia btn-block btn-lg"
                        :disabled="isMintingDisabled">
                Mint
              </b-button>
              <!--<b-button type="reset" variant="outline-secondary" class="my-2">Reset</b-button>-->
            </div>
            <div class="py-2 text-center" v-else-if="saving && !mintingTransactionHash">
              <b-button type="button" class="cta-tokenlandia btn-block btn-lg" disabled>
                <SmallSpinner/>
                Uploading data to IPFS...
              </b-button>
            </div>
            <div class="py-2 text-center" v-else-if="mintingTransactionHash">
              <b-button type="button" class="cta-tokenlandia btn-block btn-lg" disabled>
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
          <a class="collapse-raw-link" v-b-toggle.collapse-raw-data>
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
    import {Component, Vue, Watch} from 'vue-property-decorator';
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

    import developerCodes from '../../../static/developer_codes.json';
    import cityCodes from '../../../static/city_codes.json';
    import ipfsHttpClient from 'ipfs-http-client';

    interface Model {
        developer: string,
        initials: string,
        series: string,
        design: string,
        token_id: string,
        description: string,
        property_address: string,
        insurance_costs: string,
        purchase_date: string,
        taxes: string,
        maintenance_costs: string,
        year_built: string,
        recipient: string,
        community_name: string,
    }

    @Component({
        computed: {
            ...mapGetters(['isConnected', 'accountProperties', 'validateAddress', 'checksumAddress']),
            ...mapState(['account']),
        },
        components: {
            TxsLink,
            SmallSpinner,
            Datepicker,
            vueDropzone: vue2Dropzone,
        },
    })
    export default class RealEstateNFTGenerator extends Vue {
        isConnected!: boolean;

        baseIpfsUrl: string = 'https://ipfs.infura.io/ipfs/';

        ipfs = ipfsHttpClient('ipfs.infura.io', '5001', {protocol: 'https'});

        formState: any = {};

        model: Model = {
            developer: '',
            initials: '',
            series: '',
            design: '',
            token_id: '',
            description: '',
            property_address: '',
            insurance_costs: '',
            purchase_date: '',
            taxes: '',
            maintenance_costs: '',
            year_built: '',
            recipient: '',
            community_name: '',
        };

        dropzoneOptions: any = {
            url: 'https://',
            thumbnailHeight: 120,
            thumbnailWidth: 120,
            autoProcessQueue: false,
            maxFilesize: 20,
            maxFiles: 1,
            minFiles: 1,
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        };

        file: any = null;
        fileBuffer: any = null;

        developerCodes: any = developerCodes;
        cityCodes: any = cityCodes;

        account!: string;
        accountProperties: any;

        mintingTransactionHash: string = '';
        ipfsDataHash: string = '';
        saving: boolean = false;
        tokenIdAlreadyAssigned: boolean = false;
        isCheckingTokenId: boolean = false;

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
                description,
                series,
                design,
                purchase_date,
                recipient,
                property_address,
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
                name: property_address,
                description,
                image: imageIpfsUrl,
                type: 'REAL_ESTATE',
                created: Math.floor( Date.now() / 1000 ),
                attributes: {
                    ...cleanModel,
                    property_address,
                    product_id: this.productId,
                    series: this.prependPadding(series, 3),
                    design: this.prependPadding(design, 4),
                    purchase_date: moment(purchase_date).format('YYYY-MM-DD'),
                },
            };
        }

        @Watch('model.token_id')
        async onAccountChange(newVal: any, oldVal: any) {
            this.tokenIdAlreadyAssigned = false;
            this.isCheckingTokenId = true;
            if (newVal !== oldVal) {
                if (newVal) {
                    const checkTokenIdIsValid = await this.$store.dispatch('checkTokenIdIsValid', newVal);
                    this.tokenIdAlreadyAssigned = checkTokenIdIsValid === true;
                }
            }
            this.isCheckingTokenId = false;
        }

        @Watch('model.recipient')
        async onRecipientChange(newVal: any, oldVal: any) {
            if (newVal !== oldVal) {
                if (_.size(newVal) === 42) {
                    // @ts-ignore
                    this.model.recipient = this.checksumAddress(this.model.recipient);
                }
            }
        }

        async onSubmit() {
            if (this.mintingTransactionHash.length > 0) {
                console.log("Already submitted");
                return;
            }

            if (!this.file && !this.fileBuffer) {
                alert("An image has not been uploaded");
                return;
            }
            if (this.formState.$valid) {

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
            } else {
                console.log(this.formState.$error);
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
            return this.developer !== '{DEVELOPER}' && this.initials !== '{CITY}' && this.series !== '{ADDRESS}' && this.tokenId !== '{TOKEN_ID}';
        }

        get developer(): string {
            return this.model.developer ? this.model.developer : '{DEVELOPER}';
        }

        get initials(): string {
            return this.model.initials ? this.model.initials.toUpperCase() : '{CITY}';
        }

        get series(): string {
            return this.model.series ? this.prependPadding(this.model.series, 3) : '{ADDRESS}';
        }

        get tokenId(): string {
            return this.model.token_id ? this.model.token_id : '{TOKEN_ID}';
        }

        get productCode(): string {
            return `${this.developer}-${this.initials}-${this.series}`;
        }

        get productId(): string {
            return `${this.productCode}-${this.tokenId}`;
        }
    }
</script>

<style scoped>
  .generator-container {
  }

  .dropzone {
    max-height: 125px !important;
    padding-top: 8px !important;
  }

  #collapse-raw-data {
  }

  .collapse-raw-link {
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
