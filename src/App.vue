<template>
  <div id="app">
    <div class="wrapper">
      <!-- Sidebar  -->
      <nav id="sidebar" v-bind:class="{'s-active': collapsed}">
        <div class="sidebar-header">
          <h3>TokenLandia Admin</h3>
        </div>

        <ul class="list-unstyled components">
          <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/' }">
            <router-link to="/">Mint</router-link>
          </li>
          <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/verify' }">
            <router-link to="/verify">Verify</router-link>
          </li>
          <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/account' }">
            <router-link to="/account">Account</router-link>
          </li>
          <li v-bind:class="{ 'active': this.$router.currentRoute.path === '/user-access' }">
            <router-link to="/user-access">Access</router-link>
          </li>
          <li class="mt-2">
            <b-button class="cta-tokenlandia" @click="onLogin">
              Login
            </b-button>
          </li>
        </ul>
      </nav>

      <!-- Page Content + Footer  -->
      <div id="content">
        <div id="collapse-btn-container">
          <b-button
            id="sidebarCollapse"
            variant="outline-warning"
            @click="toggleCollapse">
            <font-awesome-icon icon="bars"/>
          </b-button>
        </div>
        <router-view class="view"/>

        <hr/>

        <footer class="footer p-2">
          <current-network></current-network>
          Built by <a href="https://blockrocket.tech" target="_blank">BlockRocket</a>
        </footer>
      </div>
    </div>

  </div>
</template>

<script>
    import CurrentNetwork from "@/components/CurrentNetwork.vue";
    import web3Connect from '@/web3ConnectService';

    export default {
      name: 'App',
      data() {
        return {
          collapsed: false
        }
      },
      components: {
        CurrentNetwork
      },
      methods: {
        toggleCollapse() {
          this.collapsed = !this.collapsed;
        },
        onLogin() {
          web3Connect.toggleModal();
        },
      },
      created() {
        web3Connect.on("connect", provider => {
          this.$store.dispatch('bootstrap', provider);
        });

        if (!window.ethereum) {
          this.$store.dispatch('setupStaticWeb3');
        }
      }
    }
</script>

<style lang="scss">
  @import '../node_modules/bootstrap/scss/bootstrap';
  @import '../node_modules/bootstrap-vue/src/index.scss';
  @import '../node_modules/vue-date-pick/src/vueDatePick.scss';
  @import './colours.scss';

  .heading {
    font-family: 'Ubuntu', sans-serif;
  }

  .txt {
    font-family: 'Open Sans', sans-serif;
  }

  .cta-tokenlandia {
    background-color: #DE683C;
    border-color: #DE683C;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  a,
  a:hover,
  a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
  }

  .navbar {
    padding: 15px 10px;
    background: #fff;
    border: none;
    border-radius: 0;
    margin-bottom: 40px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }

  .navbar-btn {
    box-shadow: none;
    outline: none !important;
    border: none;
  }

  .line {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #ddd;
    margin: 40px 0;
  }

  #collapse-btn-container {
    position: absolute;
    margin: 1rem;
  }

  .footer {
    min-height: 50px;
  }

  /* ---------------------------------------------------
      SIDEBAR STYLE
  ----------------------------------------------------- */

  .wrapper {
    display: flex;
    width: 100%;
    align-items: stretch;
  }

  #sidebar {
    min-width: 250px;
    max-width: 250px;
    background: #F3B85C;
    color: #fff;
    transition: all 0.3s;
  }

  .s-active {
    margin-left: -250px;
  }

  #sidebar .sidebar-header {
    padding: 20px;
    background: #DE683C;
  }

  #sidebar ul.components {
    padding: 15px 0;
  }

  #sidebar ul p {
    color: #fff;
    padding: 10px;
  }

  #sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
  }

  #sidebar ul li a:hover {
    color: #F3B85C;
    background: #fff;
  }

  #sidebar ul li.active > a,
  a[aria-expanded="true"] {
    color: #fff;
    background: #DE683C;
  }

  a[data-toggle="collapse"] {
    position: relative;
  }

  .dropdown-toggle::after {
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #DE683C;
  }

  a.download {
    background: #fff;
    color: #F3B85C;
  }

  a.article,
  a.article:hover {
    background: #DE683C !important;
    color: #fff !important;
  }

  /* ---------------------------------------------------
      CONTENT STYLE
  ----------------------------------------------------- */

  #content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s;
  }

  .view {
    padding: 30px;
  }

  /* ---------------------------------------------------
      MEDIAQUERIES
  ----------------------------------------------------- */

  @media (max-width: 768px) {
    #sidebar {
      margin-left: -250px;
    }
    #sidebar.active {
      margin-left: 0;
    }
    #sidebarCollapse span {
      display: none;
    }
  }
</style>
