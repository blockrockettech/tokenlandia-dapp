<template>
  <div class="generator-container txt">
    <h1 class="heading">Real Estate NFT Generator</h1>

    <hr/>

    <div class="alert alert-warning" v-if="!this.account">You must "Login" to mint new tokens</div>
    <div class="alert alert-warning"
         v-else-if="!canUserMint && accountProperties.canMint === false && !accountProperties.staticWeb3">
      It doesn't look like you can mint. Double check you're using the correct account.
    </div>
    <div v-else>

      <h4 class="my-3">
        Unique Identifier:
        <span v-bind:class="{ 'text-success': this.productIdValid }">
          <span v-bind:class="{ 'text-danger': developer === '{DEVELOPER}' }">{{developer}}</span>
          <span>-</span>
          <span v-bind:class="{ 'text-danger': city === '{CITY}' }">{{city}}</span>
          <span>-</span>
          <span v-bind:class="{ 'text-danger': address === '{ADDRESS}' }">{{address}}</span>
          <span>-</span>
          <span v-bind:class="{ 'text-danger': tokenId === '{TOKEN_ID}' }">{{tokenId}}</span>
        </span>
      </h4>

      <vue-form :state="formState" @submit.prevent="onSubmit">

        <div class="my-3">
          <validate auto-label class="form-group required-field d-inline-block mr-3" :class="fieldClassName(formState.developer)">
            <label for="developer">Developer</label>
            <select name="developer"
                    id="developer"
                    class="form-control"
                    required
                    v-model="model.developer">
              <option value="">Please select one</option>
              <option v-for="code in developerCodes" :value="code['alpha-3']">{{code.name}}</option>
            </select>
          </validate>

          <validate auto-label class="form-group required-field d-inline-block mr-3" :class="fieldClassName(formState.city)">
            <label for="city">City</label>
            <select name="city"
                    id="city"
                    class="form-control"
                    required
                    v-model="model.city">
              <option value="">Please select one</option>
              <option v-for="code in cityCodes" :value="code['alpha-3']">{{code.name}}</option>
            </select>
          </validate>

          <validate auto-label class="form-group required-field d-inline-block mr-3" :class="fieldClassName(formState.address)">
            <label for="address">Address</label>
            <input type="text"
                   name="address"
                   id="address"
                   class="form-control"
                   required
                   pattern="^[A-Za-z0-9]+$"
                   maxlength="10"
                   v-model="model.address"/>
          </validate>

          <validate auto-label class="form-group required-field d-inline-block" :class="fieldClassName(formState.tokenId)">
            <label for="tokenId">Token ID</label>
            <input type="number"
                   min="1"
                   step="1"
                   name="tokenId"
                   id="tokenId"
                   class="form-control"
                   required v-model="model.token_id"/>
          </validate>
        </div>

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

        <h4 class="my-3 text-left">Information and Provenance</h4>

        <validate auto-label class="form-group row required-field"
                  :class="fieldClassName(formState.property_address)">
          <label for="property_address" class="col-sm-3 col-form-label text-right text-right">Property Address</label>
          <div class="col-sm-9">
              <textarea id="property_address"
                        name="property_address"
                        class="form-control"
                        maxlength="300"
                        required
                        :class="inputClassName(formState.property_address)"
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
          <label for="description" class="col-sm-3 col-form-label text-right">Description</label>
          <div class="col-sm-9">
              <textarea id="description"
                        name="description"
                        class="form-control"
                        maxlength="300"
                        required
                        :class="inputClassName(formState.description)"
                        v-model.lazy="model.description">
                </textarea>
            <field-messages
              name="description" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">Description is a required field</div>
            </field-messages>
          </div>
        </validate>

        <div class="form-group row required-field">
          <label for="dropzone"
                 class="col-sm-3 col-form-label text-right"
                 v-bind:class="{ 'text-success': file && fileBuffer }">
            Image
          </label>
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

        <validate auto-label class="form-group row required-field" :class="fieldClassName(formState.year_built)">
          <label for="year_built" class="col-sm-3 col-form-label text-right">Year Built</label>
          <div class="col-sm-9">
            <input type="number"
                   name="year_built"
                   id="year_built"
                   class="form-control"
                   required
                   :class="inputClassName(formState.year_built)"
                   v-model="model.year_built"/>
            <field-messages
              name="yearBuilt" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                Year Built is a required field
              </div>
            </field-messages>
          </div>
        </validate>

        <validate auto-label class="form-group row required-field" :class="fieldClassName(formState.community_name)">
          <label for="community_name" class="col-sm-3 col-form-label text-right">Community Name</label>
          <div class="col-sm-9">
            <input type="text"
                   name="community_name"
                   id="community_name"
                   class="form-control"
                   required
                   :class="inputClassName(formState.community_name)"
                   v-model="model.community_name"/>
            <field-messages
              name="community_name" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                Community Name is a required field
              </div>
            </field-messages>
          </div>
        </validate>

        <validate auto-label class="form-group row required-field">
          <label for="purchDate"
                 class="col-sm-3 col-form-label text-right"
                 v-bind:class="{ 'text-success': model.purchase_date }">
            Purchase Date
          </label>
          <div class="col-sm-9">
            <datepicker name="purchDate"
                        id="purchDate"
                        placeholder="YYYY-MM-DD"
                        input-class="form-control"
                        :typeable="true"
                        :required="true"
                        format="yyyy-MM-dd"
                        :class="inputClassName(formState.purchase_date)"
                        v-model="model.purchase_date">
            </datepicker>

            <field-messages
              name="purchDate" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">Purchase Date is a required field</div>
            </field-messages>
          </div>
        </validate>

        <validate auto-label class="form-group row required-field" :class="fieldClassName(formState.maintenance_costs)">
          <label for="maintenance_costs" class="col-sm-3 col-form-label text-right">Maintenance Costs</label>
          <div class="col-sm-9">
            <input type="text"
                   name="maintenance_costs"
                   id="maintenance_costs"
                   class="form-control"
                   :class="inputClassName(formState.maintenance_costs)"
                   required v-model="model.maintenance_costs"/>
            <field-messages
              name="maintenance_costs" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                Maintenance Costs is a required field
              </div>
            </field-messages>
          </div>
        </validate>

        <validate auto-label class="form-group row required-field" :class="fieldClassName(formState.insurance_costs)">
          <label for="insurance_costs" class="col-sm-3 col-form-label text-right">Insurance Costs</label>
          <div class="col-sm-9">
            <input type="text"
                   name="insurance_costs"
                   id="insurance_costs"
                   class="form-control"
                   :class="inputClassName(formState.insurance_costs)"
                   required v-model="model.insurance_costs"/>

            <field-messages
              name="insurance_costs" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">Insurance Costs is a required field</div>
            </field-messages>
          </div>
        </validate>

        <validate auto-label class="form-group row required-field" :class="fieldClassName(formState.taxes)">
          <label for="taxes" class="col-sm-3 col-form-label text-right">
            Taxes
          </label>
          <div class="col-sm-9">
            <input type="text"
                   name="taxes"
                   id="taxes"
                   class="form-control"
                   :class="inputClassName(formState.taxes)"
                   required v-model="model.taxes"/>

            <field-messages
              name="taxes" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                Taxes is a required field
              </div>
            </field-messages>
          </div>
        </validate>

        <validate auto-label class="form-group row required-field" :class="fieldClassName(formState.rental_income)">
          <label for="rental_income" class="col-sm-3 col-form-label text-right">Rental Income</label>
          <div class="col-sm-9">
            <input type="text"
                   name="rental_income"
                   id="rental_income"
                   class="form-control"
                   :class="inputClassName(formState.rental_income)"
                   required v-model="model.rental_income"/>

            <field-messages
              name="rental_income" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">Rental Income is a required field</div>
            </field-messages>
          </div>
        </validate>

        <h4 class="my-3 text-left">Recipient</h4>

        <validate auto-label class="form-group row required-field" :class="fieldClassName(formState.recipient)">
          <label for="recipient" class="col-sm-3 col-form-label text-right">ETH Address</label>
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
                <b-button type="submit"
                          class="btn-block btn-lg"
                          variant="primary"
                          :disabled="formState.$invalid || !file && !fileBuffer || isMintingDisabled">
                  Mint
                </b-button>
                <p class="mt-2 text-danger" v-if="formState.$invalid && formState.$dirty">
                  Please complete the form and image upload above before you can mint.
                </p>
              </div>
              <div class="py-2 text-center" v-else-if="saving && !mintingTransactionHash">
                <b-button type="button" class="btn-block btn-lg" variant="primary" disabled>
                  <SmallSpinner/>
                  Uploading data to IPFS...
                </b-button>
              </div>
              <div class="py-2 text-center" v-else-if="mintingTransactionHash">
                <b-button type="button" class="btn-block btn-lg" variant="primary" disabled>
                  Please authorise the transaction...
                </b-button>
              </div>
              <txs-link :hash="mintingTransactionHash"></txs-link>
            </div>
          </div>
        </div>

        <b-card header-tag="header" class="mt-3" no-body>
          <template v-slot:header>
            <b-button variant="light" @click="toggleShowIPFSData" class="py-0">
              <span class="mr-2">View IPFS MetaData</span>
              <font-awesome-icon icon="caret-down" class="ml-auto">
              </font-awesome-icon>
            </b-button>
          </template>

          <b-alert class="text-left" variant="light" :show="showIPFSData">
            <div class="small text-muted mb-2">IPFS MetaData</div>
            <pre>{{this.getIpfsPayload('TBC')}}</pre>
            <div>
              <a class="btn btn-link"
                 v-if="ipfsDataHash !== '' && ipfsDataHash !== 'unsuccessful'"
                 :href="baseIpfsUrl + ipfsDataHash" target="_blank">IPFS Link</a>
            </div>
          </b-alert>
        </b-card>
      </vue-form>
    </div>
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
        city: string,
        address: string,
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
            ...mapState(['account', 'networkId']),
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
            city: '',
            address: '',
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
        showIPFSData: boolean = false;

        toggleShowIPFSData() {
            this.showIPFSData = !this.showIPFSData;
        }

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
                purchase_date,
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
                return 'text-success';
            }
            if ((field.$touched || field.$submitted) && field.$invalid) {
                return 'text-danger';
            }
            return '';
        }

        inputClassName(field: any): string {
          if (!field) {
            return '';
          }
          if ((field.$touched || field.$submitted) && field.$valid) {
            return 'border-success';
          }
          if ((field.$touched || field.$submitted) && field.$invalid) {
            return 'border-danger';
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
            return this.developer !== '{DEVELOPER}' && this.city !== '{CITY}' && this.address !== '{ADDRESS}' && this.tokenId !== '{TOKEN_ID}';
        }

        get developer(): string {
            return this.model.developer ? this.model.developer : '{DEVELOPER}';
        }

        get city(): string {
            return this.model.city ? this.model.city.toUpperCase() : '{CITY}';
        }

        get address(): string {
            return this.model.address ? this.prependPadding(this.model.address, 3) : '{ADDRESS}';
        }

        get tokenId(): string {
            return this.model.token_id ? this.model.token_id : '{TOKEN_ID}';
        }

        get productCode(): string {
            return `${this.developer}-${this.city}-${this.address}`;
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
    text-decoration: underline;
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
