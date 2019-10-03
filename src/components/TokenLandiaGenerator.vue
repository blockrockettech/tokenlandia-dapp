<template>
  <div class="generator-container">
    <h1>TokenLandia NFT Generator</h1>
    <hr/>
    <h4>Unique Identifier: {{coo}}-{{initials}}-{{series}}-{{design}}-{{tokenID}}</h4>
    <br/>
    <vue-form :state="formState" @submit.prevent="onSubmit">
      <validate auto-label class="form-group required-field">
        <label for="coo">Country of Origin</label>
        <input type="text"
               name="coo"
               id="coo"
               class="form-control"
               required v-model="model.coo" />

        <field-messages name="coo" show="$touched || $submitted" class="form-control-feedback">
          <div slot="required" class="text-danger">Country of Origin is a required field</div>
        </field-messages>
      </validate>

      <validate auto-label class="form-group required-field">
        <label for="initials">Artist Initials</label>
        <input type="text"
               name="initials"
               id="initials"
               class="form-control"
               required v-model="model.initials" />

        <field-messages name="initials" show="$touched || $submitted" class="form-control-feedback">
          <div slot="required" class="text-danger">Initials is a required field</div>
        </field-messages>
      </validate>

      <field class="form-group">
        <label for="series">Series</label>
        <input type="number"
               name="series"
               id="series"
               min="1"
               step="1"
               class="form-control"
               v-model="model.series" />
      </field>

      <field class="form-group">
        <label for="design">Design</label>
        <input type="number"
               name="design"
               id="design"
               min="1"
               step="1"
               class="form-control"
               v-model="model.design" />
      </field>

      <validate auto-label class="form-group required-field">
        <label for="initials">Token ID</label>
        <input type="number"
               min="1"
               step="1"
               name="tokenId"
               id="tokenId"
               class="form-control"
               required v-model="model.tokenId" />

        <field-messages name="tokenId" show="$touched || $submitted" class="form-control-feedback">
          <div slot="required" class="text-danger">Token ID is a required field</div>
        </field-messages>
      </validate>

      <div class="py-2 text-center" v-if="!saving && !saved">
        <button class="btn btn-primary" type="submit">Submit</button>
      </div>
      <div class="py-2 text-center" v-else-if="saving && !saved">
        Saving...
      </div>
      <div class="py-2 text-center" v-else-if="!saving && saved">
        Saved!
      </div>
    </vue-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

interface Model {coo: string, initials: string, series: string, design: string, tokenId: string}

@Component({})
export default class TokenLandiaGenerator extends Vue {
  formState: any = {};

  model: Model = {
    coo: '', initials: '', series: '1', design: '1', tokenId: '',
  };

  saving: boolean = false;

  saved: boolean = false;

  onSubmit() {
    if (this.formState.$valid) {
      console.log(`${this.coo}-${this.initials}-${this.series}-${this.design}-${this.tokenID}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  prependPadding(number: string, maxLength: number): string {
    let padding: string = '';
    for (let i: number = 0; i < (maxLength - number.length); i += 1) {
      padding += '0';
    }
    return padding + number;
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
    width: 50%;
    margin: 0 auto;
  }

  @media only screen and (max-width: 1200px) {
    .generator-container {
      width: 85%;
    }
  }

  @media only screen and (max-width: 600px) {
    .generator-container {
      width: 100%;
    }
  }
</style>
