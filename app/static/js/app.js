/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <router-link to="/" class="navbar-brand">
                <i class="fas fa-camera d-inline-block"></i>
                  Photogram
              </router-link>
               <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <router-link to="/" class="nav-link">Home</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/register" class="nav-link">Explore</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/login" class="nav-link">My Profile</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/login" class="nav-link">Logout</router-link>
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
    template:`
      <div style="display:flex; justify-content: center;">
        <div style="width: 800px; margin: 0 350px 0 350px;">
          <h4> Register </h4>
          <div class="shadow-lg border-top rounded bg-white">
            <form id="registerForm" method="post" enctype="multipart/form-data" @submit.prevent="uploadForm" class="col-md-12" style="padding: 15px 15px 30px 15px;">
              <div class="form-group">
                <label> Username </label>
                <input type="text" name="username" class="form-control">
              </div>
              <div class="form-group">
                <label> Password </label>
                <input type="password" name="password" class="form-control">
              </div>
              <div class="form-group">
                <label> Firstname </label>
                <input type="text" name="firstname" class="form-control">
              </div>
              <div class="form-group">
                <label> Lastname </label>
                <input type="text" name="lastname" class="form-control">
              </div>
              <div class="form-group">
                <label> Email </label>
                <input type="text" name="email" class="form-control">
              </div>
              <div class="form-group">
                <label> Location </label>
                <input type="text" name="location" class="form-control">
              </div>
              <div class="form-group">
                <label> Biography </label>
                <textarea class="form-control" name="biography" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label> Photo </label>
                <input type="file" name="photo" class="form-control-file">
              </div>
              <input type="submit" value="Register" name="register" class="btn btn-success btn-block">
            </form>
          </div>
        </div>
      </div>
    `,
    methods: {
      uploadForm: function() {
        let registerForm = document.getElementById('registerForm');
        let registrationInfo = new FormData(registerForm);
        
        fetch("/api/users/register", {
          method: 'POST',
          body: registrationInfo,
          headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          console.log(jsonResponse);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
});

const Login = Vue.component('login', {
  template:`
    <div style="display:flex; justify-content: center;">
        <div style="width: 800px; margin: 0 350px 0 350px;">
          <h4> Login </h4>
          <div class="border-top rounded bg-white">
            <form id="loginForm" method="post" @submit.prevent="login" class="col-md-12" style="padding: 15px 15px 30px 15px;">
              <div class="form-group">
                <label> Username </label>
                <input type="text" name="username" class="form-control">
              </div>
              <div class="form-group">
                <label> Password </label>
                <input type="password" name="password" class="form-control">
              </div>
              <input type="submit" value="Login" name="register" class="btn btn-success btn-block">
            </form>
          </div>
        </div>
      </div>
  `,
  methods: {
      login: function() {
        let loginForm = document.getElementById('loginForm');
        let loginInfo = new FormData(loginForm);
        
        fetch("/api/auth/login", {
          method: 'POST',
          body: loginInfo,
          headers: {
            'X-CSRFToken': token,
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          console.log(jsonResponse);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
});

const Home = Vue.component('home', {
  template: `
    <div class="row">
      <div class="col-sm-5 ml-5 mr-3 border-top rounded no-padding">
        <img src="/static/images/home.jpg" alt="Photogram homepage photo" class="img-responsive" width="100%"/>
      </div>
      <div class="col-sm-5 bg-white border-top rounded">
        <div>
          <div class="card-header text-center bg-white">
            <h3>
              <i class="fas fa-camera d-inline-block"></i>
              Photogram
            </h3>
          </div>
          <div class="card-body">
            <p> Share photos of your favourite moments with friends, family and around the world </p>
          </div>
          <router-link to="/register"><input type="submit" value="Register" class="btn btn-success ml-4 mr-2 col-lg-5"></router-link>
            <router-link to="/login"><input type="submit" value="Login" class="btn btn-primary col-lg-5"></router-link>
        </div>
      </div>
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

