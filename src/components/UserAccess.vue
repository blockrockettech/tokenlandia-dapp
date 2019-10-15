<template>
  <div>
    <h1 class="heading">User Access Controls</h1>
    <hr/>
    <div class="row text-left">
      <div class="col">
        <h4>Minting</h4>
        <p>
          Those with minting access can create TokenLandia NFT
        </p>
        <p>
          Use the form below to mange address which are allowed to mint tokens for TokenLandia
        </p>

        <div class="row mt-2">
          <div class="col-2">
            <label for="ethAddress-can-mint">ETH Address:&nbsp;</label>
          </div>
          <div class="col-4">
            <b-form-input id="ethAddress-can-mint" type="text"
                          v-model="canMintEthAddress.value"
                          placeholder="0x123..."/>
          </div>
          <div class="col-2">
            <b-button class="cta-tokenlandia ml-2"
                      @click="checkCanMint"
                      v-if="!canMintEthAddress.loading">
              Can mint?
            </b-button>
            <b-button class="cta-tokenlandia ml-2"
                      v-if="canMintEthAddress.loading" disabled>
              <SmallSpinner/>
            </b-button>
            <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg"
                               v-if="!canMintEthAddress.loading && canMintEthAddress.result === true">
            </font-awesome-icon>
            <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg"
                               v-if="!canMintEthAddress.loading && canMintEthAddress.result === false">
            </font-awesome-icon>
          </div>
        </div>


        <div class="row mt-2">
          <div class="col-2">
            <label for="ethAddress-add-remove-minter">ETH Address:&nbsp;</label>
          </div>
          <div class="col-4">
            <b-form-input id="ethAddress-add-remove-minter" type="text"
                          v-model="addRemoveMinterEthAddress.value"
                          placeholder="0x123..."/>
          </div>
          <div class="col-2">
            <b-button class="btn-success ml-2 mr-2" @click="addMinter" :disabled="!isConnected">Add
            </b-button>
            <b-button class="btn-danger" @click="removeMinter" :disabled="!isConnected">Remove
            </b-button>
          </div>
        </div>

      </div>
    </div>

    <hr/>

    <div class="row text-left">
      <div class="col">
        <h4>Root Admin</h4>
        <p>
          Those with admin access can control who is allowed to mint tokens.
        </p>
        <p>
          Check and add those address which are allowed to add people to the minting role
        </p>

        <div class="row">
          <div class="col-2">
            <label for="ethAddress-is-admin">ETH Address:&nbsp;</label>
          </div>
          <div class="col-4">
            <b-form-input id="ethAddress-is-admin" type="text"
                          v-model="isAdminEthAddress.value"
                          placeholder="0x123..."/>
          </div>
          <div class="col-2">
            <b-button class="cta-tokenlandia ml-2"
                      @click="checkIsAdmin"
                      v-if="!isAdminEthAddress.loading">
              Is admin?
            </b-button>
            <b-button class="cta-tokenlandia ml-2"
                      v-if="isAdminEthAddress.loading" disabled>
              <SmallSpinner/>
            </b-button>
            <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg"
                               v-if="!isAdminEthAddress.loading && isAdminEthAddress.result === true">
            </font-awesome-icon>
            <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg"
                               v-if="!isAdminEthAddress.loading && isAdminEthAddress.result === false">
            </font-awesome-icon>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-2">
            <label for="ethAddress-add-remove-admin" class="searchLabel">ETH Address:&nbsp;</label>
          </div>
          <div class="col-4">
            <b-form-input id="ethAddress-add-remove-admin" type="text"
                          v-model="addRemoveAdminEthAddress.value"
                          placeholder="0x123..."/>
          </div>
          <div class="col-2">
            <b-button class="btn-success ml-2 mr-2" @click="addAdmin" :disabled="!isConnected">Add
            </b-button>
            <b-button class="btn-danger" @click="removeAdmin" :disabled="!isConnected">Remove
            </b-button>
          </div>
        </div>

      </div>
    </div>
    <hr/>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters} from "vuex";
    import axios from 'axios';

    import Spinner from './Spinner.vue';
    import SmallSpinner from "@/components/SmallSpinner.vue";

    interface InputModel {
        value: string,
        loading: boolean,
        result: any
    }

    @Component({
        components: {SmallSpinner, Spinner},
        computed: {
            ...mapGetters(['isConnected']),
        }
    })
    export default class UserAccess extends Vue {
        canMintEthAddress: InputModel = {value: '', loading: false, result: null};
        addRemoveMinterEthAddress: InputModel = {value: '', loading: false, result: null};
        isAdminEthAddress: InputModel = {value: '', loading: false, result: null};
        addRemoveAdminEthAddress: InputModel = {value: '', loading: false, result: null};

        checkCanMint() {
            this.canMintEthAddress.loading = true;
            this.$store.dispatch('checkCanMint', this.canMintEthAddress.value)
                .then((data) => this.canMintEthAddress.result = data)
                .catch(() => this.canMintEthAddress.result = false)
                .finally(() => this.canMintEthAddress.loading = false);
        }

        addMinter() {

        }

        removeMinter() {

        }

        checkIsAdmin() {
            this.isAdminEthAddress.loading = true;
            this.$store.dispatch('checkIsAdmin', this.isAdminEthAddress.value)
                .then((data) => this.isAdminEthAddress.result = data)
                .catch(() => this.isAdminEthAddress.result = false)
                .finally(() => this.isAdminEthAddress.loading = false);
        }

        addAdmin() {

        }

        removeAdmin() {

        }

    }
</script>

<style scoped>

</style>
