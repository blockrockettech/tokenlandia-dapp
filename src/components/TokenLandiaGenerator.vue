<template>
  <div class="generator-container txt">
    <h1 class="heading">TokenLandia NFT Generator</h1>
    <hr/>
    <h4 class="heading">Unique Identifier:
      <span v-bind:class="{ 'text-success': this.uniqueIdValid }">
        <span v-bind:class="{ 'text-danger': coo === '{COO}' }">{{coo}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': initials === '{INITIALS}' }">{{initials}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': series === '{SERIES}' }">{{series}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': design === '{DESIGN}' }">{{design}}</span>
        <span>-</span>
        <span v-bind:class="{ 'text-danger': tokenID === '{TOKEN_ID}' }">{{tokenID}}</span>
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

      <hr/>
      <h4 class="heading">Product Information and Provenance</h4>
      <br/>

      <div class="row">
        <div class="col">
          <validate auto-label class="form-group required-field">
            <label for="name">Name</label>
            <input type="text"
                   name="name"
                   id="name"
                   class="form-control"
                   required v-model="model.name"/>

            <field-messages name="name" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">Name is a required field</div>
            </field-messages>
          </validate>
        </div>
        <div class="col">
          <div class="mt-3">
            <b-button variant="dark">
              <font-awesome-icon icon="file-upload"/>&nbsp;Attach Image
            </b-button>
          </div>
        </div>
      </div>

      <validate auto-label class="form-group" :class="fieldClassName(formState.description)">
        <label for="description">Description</label>
        <textarea id="description"
                  name="description"
                  class="form-control"
                  maxlength="255"
                  required
                  v-model.lazy="model.description">
                </textarea>
        <field-messages
          name="description" show="$touched || $submitted" class="form-control-feedback">
          <div slot="required" class="text-danger">Description is a required field</div>
        </field-messages>
      </validate>

      <div class="row">
        <div class="col p-2">
          <validate auto-label class="form-group required-field">
            <label for="purchLocation">Purchase Location</label>
            <input type="text"
                   name="purchLocation"
                   id="purchLocation"
                   class="form-control"
                   required v-model="model.purchLocation"/>

            <field-messages
              name="purchLocation" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">Purchase Location is a required field</div>
            </field-messages>
          </validate>
        </div>

        <div class="col p-2">
          <validate auto-label class="form-group required-field">
            <label for="purchDate">Purchase Date</label>
            <input type="date"
                   name="purchDate"
                   id="purchDate"
                   class="form-control"
                   required v-model="model.purchDate"/>

            <!--            <date-pick-->
            <!--              name="purchDate"-->
            <!--              id="purchDate"-->
            <!--              class="form-control"-->
            <!--              v-model="model.purchDate"-->
            <!--              :format="'YYYY-MM-DD'"-->
            <!--            ></date-pick>-->

            <field-messages
              name="purchDate" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">Purchase Date is a required field</div>
            </field-messages>
          </validate>
        </div>
      </div>

      <div class="row">
        <div class="col p-2">
          <validate auto-label class="form-group required-field">
            <label for="customiseLocation">Customisation Location</label>
            <input type="text"
                   name="customiseLocation"
                   id="customiseLocation"
                   class="form-control"
                   required v-model="model.customiseLocation"/>

            <field-messages
              name="customiseLocation" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                Customisation Location is a required field
              </div>
            </field-messages>
          </validate>
        </div>

        <div class="col p-2">
          <validate auto-label class="form-group required-field">
            <label for="customiseDate">Customisation Date</label>
            <input type="date"
                   name="customiseDate"
                   id="customiseDate"
                   class="form-control"
                   required v-model="model.customiseDate"/>

            <field-messages
              name="customiseDate" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                Customisation Date is a required field
              </div>
            </field-messages>
          </validate>
        </div>
      </div>

      <div class="row">
        <div class="col p-2">
          <validate auto-label class="form-group required-field">
            <label for="brand">Brand</label>
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
          </validate>
        </div>

        <div class="col p-2">
          <validate auto-label class="form-group required-field">
            <label for="model">Model</label>
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
          </validate>
        </div>

        <div class="col p-2">
          <validate auto-label class="form-group required-field">
            <label for="artist">Artist</label>
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
          </validate>
        </div>

      </div>

      <hr/>

      <h4 class="heading">Materials Used</h4>

      <div class="row">
        <div class="col">
          <validate auto-label class="form-group required-field d-inline-block mr-3">
            <label for="material1">Material 1</label>
            <input type="text"
                   name="material1"
                   id="material1"
                   class="form-control"
                   required v-model="model.materialsUsed._1"/>
          </validate>
        </div>

        <div class="col">
          <validate auto-label class="form-group required-field d-inline-block mr-3">
            <label for="material2">Material 2</label>
            <input type="text"
                   name="material2"
                   id="material2"
                   class="form-control"
                   required v-model="model.materialsUsed._2"/>
          </validate>
        </div>

        <div class="col">
          <validate auto-label class="form-group required-field d-inline-block mr-3">
            <label for="material3">Material 3</label>
            <input type="text"
                   name="material3"
                   id="material3"
                   class="form-control"
                   required v-model="model.materialsUsed._3"/>
          </validate>
        </div>

        <div class="col">
          <validate auto-label class="form-group required-field d-inline-block mr-3">
            <label for="material4">Material 4</label>
            <input type="text"
                   name="material4"
                   id="material4"
                   class="form-control"
                   required v-model="model.materialsUsed._4"/>
          </validate>
        </div>

        <div class="col">
          <validate auto-label class="form-group required-field d-inline-block">
            <label for="material5">Material 5</label>
            <input type="text"
                   name="material5"
                   id="material5"
                   class="form-control"
                   required v-model="model.materialsUsed._5"/>
          </validate>
        </div>
      </div>

      <hr/>

      <div class="row">
        <div class="col-12">
          <validate auto-label class="form-group required-field">
            <label for="recipient">ETH Address</label>
            <input type="text"
                   name="recipient"
                   id="recipient"
                   class="form-control"
                   required
                   maxlength="42"
                   required v-model="model.recipient"/>
            <field-messages
              name="recipient" show="$touched || $submitted" class="form-control-feedback">
              <div slot="required" class="text-danger">
                ETH account is a required field
              </div>
            </field-messages>
          </validate>
        </div>

        <div class="col-12">
          <div class="mt-4">
            <div class="py-2 text-center" v-if="!saving && !saved">
              <b-button type="submit" class="cta-tokenlandia btn-block btn-lg">Mint</b-button>
            </div>
            <div class="py-2 text-center" v-else-if="saving && !saved">
              Minting...
            </div>
            <div class="py-2 text-center" v-else-if="!saving && saved">
              Minted!
            </div>
          </div>
        </div>
      </div>

    </vue-form>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  // @ts-ignore
  import DatePick from 'vue-date-pick';
  import countryCodes from '../../static/country_codes.json';

  interface Model {
    coo: string,
    initials: string,
    series: string,
    design: string,
    tokenId: string,
    name: string,
    description: string,
    purchLocation: string,
    purchDate: string,
    customiseLocation: string,
    customiseDate: string,
    brand: string,
    model: string,
    artist: string,
    recipient: string,
    materialsUsed: {
      _1: string,
      _2: string,
      _3: string,
      _4: string,
      _5: string
    }
  }

  @Component({
    components: {DatePick}
  })
  export default class TokenLandiaGenerator extends Vue {
    formState: any = {};

    model: Model = {
      coo: '',
      initials: '',
      series: '',
      design: '',
      tokenId: '',
      name: '',
      description: '',
      purchLocation: '',
      purchDate: '',
      customiseLocation: '',
      customiseDate: '',
      brand: '',
      model: '',
      artist: '',
      recipient: '',
      materialsUsed: {
        _1: '',
        _2: '',
        _3: '',
        _4: '',
        _5: '',
      },
    };

    countryCodes: any = countryCodes;

    saving: boolean = false;

    saved: boolean = false;

    onSubmit() {
      if (this.formState.$valid) {
        console.log(`${this.coo}-${this.initials}-${this.series}-${this.design}-${this.tokenID}`);
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

    // eslint-disable-next-line class-methods-use-this
    prependPadding(number: string, maxLength: number): string {
      let padding: string = '';
      for (let i: number = 0; i < (maxLength - number.length); i += 1) {
        padding += '0';
      }
      return padding + number;
    }

    get uniqueIdValid(): boolean {
      return this.coo !== '{COO}' && this.initials !== '{INITIALS}' && this.series !== '{SERIES}'
        && this.design !== '{DESIGN}' && this.tokenID !== '{TOKEN_ID}';
    }

    get coo(): string {
      return this.model.coo ? this.model.coo : '{COO}';
    }

    get initials(): string {
      return this.model.initials ? this.model.initials : '{INITIALS}';
    }

    get series(): string {
      return this.model.series ? this.prependPadding(this.model.series, 3) : '{SERIES}';
    }

    get design(): string {
      return this.model.design ? this.prependPadding(this.model.design, 4) : '{DESIGN}';
    }

    get tokenID(): string {
      return this.model.tokenId ? this.model.tokenId : '{TOKEN_ID}';
    }
  }
</script>

<style scoped>
  .generator-container {
    width: 70%;
    margin: 0 auto;
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
