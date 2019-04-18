/* Add your Application JavaScript */
/*global Vue*/
/*global VueRouter*/
Vue.component('app-header', {
    template: `
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <a class="navbar-brand" href="#">VueJS App</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

               <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <router-link to="/" class="nav-link">Home<router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/register" class="nav-link">Register</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/login" class="nav-link">Login</router-link>
                  </li>
                </ul>
              </div>
            </nav>
        </header>     
    `,
    data: function() {}
});

Vue.component('app-footer', {
    template: `
        <footer>
            <div class="container">
                <p>Copyright &copy {{ year }} Flask Inc.</p>
            </div>
        </footer>
    `,
    data: function() {
        return {
            year: (new Date).getFullYear()
        };
    }
});

const Register = Vue.component('register', {
    
});

const Login = Vue.component('login', {
  
});

const Home = Vue.component('home', {
  template: `
    <div class="home">
      <img src="/static/images/logo.png" alt="VueJS Logo">
      <h1>{{ welcome }}</h1>
    </div>
  `,
  data: function() {
    return {
      welcome: 'Hello World! Welcome to VueJS'
    };
  }
});

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home},
    { path: '/register', component: Register},
    { path: '/login', component: Login}
  ]
});


let app = new Vue({
    el: '#app',
    router
});

