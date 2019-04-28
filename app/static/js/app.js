/* Add your Application JavaScript */
/*global Vue */
/*global VueRouter */
/*global token */
/*global localStorage */
/*global fetch */

Vue.component('app-header', {
    template: `
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <router-link to="/" class="navbar-brand title">
                <i class="fas fa-camera d-inline-block icon pr-1"></i>
                  Photogram
              </router-link>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              
               <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav">
                  <li class="nav-item active">
                    <router-link to="/" class="nav-link font-weight-bold">Home</router-link>
                  </li>
                  <li class="nav-item active">
                    <router-link to="/explore" class="nav-link font-weight-bold">Explore</router-link>
                  </li>
                  <li class="nav-item active">
                    <router-link :to="{ name: 'user', params: {user_id: id} }" class="nav-link font-weight-bold">My Profile</router-link>
                  </li>
                  <li class="nav-item active">
                    <router-link to="/logout" class="nav-link font-weight-bold">Logout</router-link>
                  </li>
                </ul>
              </div>
            </nav>
        </header>     
    `,
    data: function(){
      return { 
        id: localStorage.current_user
      };
    }, 
    methods: {
      toProfile() {
        let id = localStorage.getItem('current_user');
        router.push(`/users/${id}`);
      }
    }
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
          <h4 class="font-weight-bold"> Register </h4>
          <div class="shadow-lg border-top rounded bg-white shadow">
            <div v-if='error'>
              {{ message }}
            </div>
            <form id="registerForm" method="post" enctype="multipart/form-data" @submit.prevent="uploadForm" class="col-md-12" style="padding: 15px 15px 30px 15px;">
              <div class="form-group">
                <label class="font-weight-bold"> Username </label>
                <input type="text" name="username" class="form-control">
              </div>
              <div class="form-group">
                <label class="font-weight-bold"> Password </label>
                <input type="password" name="password" class="form-control">
              </div>
              <div class="form-group">
                <label class="font-weight-bold"> Firstname </label>
                <input type="text" name="firstname" class="form-control">
              </div>
              <div class="form-group">
                <label class="font-weight-bold"> Lastname </label>
                <input type="text" name="lastname" class="form-control">
              </div>
              <div class="form-group">
                <label class="font-weight-bold"> Email </label>
                <input type="text" name="email" class="form-control">
              </div>
              <div class="form-group">
                <label class="font-weight-bold"> Location </label>
                <input type="text" name="location" class="form-control">
              </div>
              <div class="form-group">
                <label class="font-weight-bold"> Biography </label>
                <textarea class="form-control" name="biography" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label class="font-weight-bold"> Photo </label>
                <input type="file" name="photo" class="form-control-file">
              </div>
              <input type="submit" value="Register" name="register" class="btn btn-color btn-block font-weight-bold">
            </form>
          </div>
        </div>
      </div>
    `,
    methods: {
      uploadForm: function() {
        let self = this;
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
          if (jsonResponse.hasOwnProperty("error")){
            self.error = true;
            self.message = jsonResponse.error;
          }else if(jsonResponse.hasOwnProperty("message")){
            router.push("/login");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
    data: function(){
      return {
        error: false,
        message: ''
     };
    }
});

const Login = Vue.component('login', {
  template:`
    <div style="display:flex; justify-content: center;">
      <div style="width: 800px; margin: 0 350px 0 350px;">
        <h4 class="font-weight-bold"> Login </h4>
        <div class="border-top rounded bg-white shadow">
          <div v-if='error'>
            {{ message }}
          </div>
          <form id="loginForm" method="post" @submit.prevent="login" class="col-md-12" style="padding: 15px 15px 30px 15px;">
            <div class="form-group">
              <label class="font-weight-bold"> Username </label>
              <input type="text" name="username" class="form-control">
            </div>
            <div class="form-group">
              <label class="font-weight-bold"> Password </label>
              <input type="password" name="password" class="form-control">
            </div>
            <input type="submit" value="Login" name="login" class="btn btn-color btn-block font-weight-bold">
          </form>
        </div>
      </div>
    </div>
  `,
  methods: {
      login: function() {
        let self = this;
        let loginForm = document.getElementById('loginForm');
        let loginInfo = new FormData(loginForm);
        
        fetch("/api/auth/login", {
          method: 'POST',
          body: loginInfo,
          headers: {
            'X-CSRFToken': token,
          },
          credentials: 'same-origin'
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          console.log(jsonResponse);
          if(jsonResponse.hasOwnProperty("token")){
            let jwt_token = jsonResponse.token;
            let id = jsonResponse.user_id;

            /*Stores the jwt locally to be accessed later*/
            localStorage.setItem('token', jwt_token);
            localStorage.setItem('current_user', id);
            
            // router.go();
            router.push('/explore');
          }else{
            self.error = true;
            self.message = jsonResponse.error;
          }
        })
        .catch(function (error) {
          self.error = false;
          console.log(error);
        });
      }
    },
    data: function(){
      return {
        error: false,
        message: ''
      };
    }
});

const Logout = Vue.component('logout', {
  template:`<div></div>`,
  created: function(){
    fetch("api/auth/logout", {
      method: 'GET'
    })
    .then(function(response){
      return response.json();
    })
    .then(function(jsonResponse){
      console.log(jsonResponse);
      localStorage.removeItem('token');
      localStorage.removeItem('current_user');
      console.info('Token and current user removed from localStorage.');
      
      router.push('/');
    })
    .catch(function(error){
      console.log(error);
    });
  }
});

const Explore = Vue.component('explore', {
  template: `
    <div class="row d-flex flex-row-reverse">
      <div class="col-sm-3">
        <router-link to="/posts/new"><input type="submit" value="New Post" class="btn btn-primary btn-block"></router-link>
      </div>
      <div class="col-md-7 ml-5" v-if='valid'>
        <h5> {{ message }} </h5>
      </div>
      <div class="col-md-7 ml-5 mb-5 bg-white rounded-lg no-padding mr-auto" v-for="(post, index) in posts">
        <div class="card rounded-lg border-col">
          <div class="card-header bg-white">
            <p> 
             <router-link :to="{ name: 'user', params: {user_id: post.user_id} }"> <img :src=post.user_photo alt="User profile photo" class="img-size rounded-circle d-inline-block"/></router-link>
              {{ post.username }}
            </p>
          </div>
          <img :src=post.photo class="card-img-top" alt="Picture posted by the user">
          <div class="card-body text-muted">
            <small> {{ post.description }}</small>
          </div>
          <div class="card-footer bg-white border-0">
            <small class="like" v-on:click="like(post.id, index)">
              <span v-if="post.isLiked"><i class='fas fa-heart d-inline-block text-danger'></i></span>
              <span v-else><i class="far fa-heart d-inline-block"></i></span>
              {{ post.likes }}
              Likes
            </small>
            <small>{{ post.created_on }}</small>
          </div>
        </div>
      </div>
    </div>
  `,
  created: function(){
    let self = this;
    
    fetch("/api/posts", {
      method: 'GET',
      headers:{
        'Authorization': `Bearer ${localStorage.token}`,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    })
    .then(function(response){
      return response.json();
    })
    .then(function(jsonResponse){
      console.log(jsonResponse);
      if(jsonResponse.hasOwnProperty("code")){
        router.push('/login');
      }
      else{
        if(jsonResponse.hasOwnProperty("posts")){
          if(jsonResponse.posts.length !=0){
            console.log("Posts: "+jsonResponse.posts);
            self.posts = jsonResponse.posts;
          }
          else{
            self.valid = true;
            self.message = 'No posts to be displayed';
          }
        }
      }
    }).catch(function(error){
      console.log(error);
    });
  },
  data: function(){
    return {
      posts: [],
      message: '',
      valid: false,
      id: localStorage.current_user
    };
  },
  methods: {
    like: function(postId, index) {
      let self = this;
      fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(resp => resp.json())
      .then(jsonResp => {
        if (jsonResp.hasOwnProperty("message")) {
          self.posts[index].likes = jsonResp.likes;
          self.posts[index].isLiked = true;
        } else {
          console.log(jsonResp.error);
        }

      }).catch(err => console.log(err));
    }
  } 
});

const User = Vue.component('user', {
  template: `
    <div>
      <div class=" row bg-white d-flex flex-row justify-content-between bg-white rounded shadow-sm p-3 mb-3">
        <div class=" mr-2">
          <img :src="'../' + user.user_photo" alt="User profile photo" class="profilePic">
        </div>
        <div class="d-flex flex-column">
          <p class="font-weight-bold text-muted"> {{user.fname}} {{user.lname}} </p>
          <p class="text-muted"> 
            {{user.location}} <br>
            Member since {{user.joined}} 
          </p>
          <p class="text-muted"> {{user.biography}} </p>
        </div>

        <div class="d-flex flex-column justify-content-between">
          <div class="d-flex flex-row justify-content-between">
            <div class="d-flex flex-column justify-content-center align-items-center p-2">
              <span class="font-weight-bold text-muted">{{ user.postNum }}</span>
              <p class="font-weight-bold text-muted">Posts</p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center p-2">
              <span class="font-weight-bold text-muted">{{ user.followers }}</span>
              <p class="font-weight-bold text-muted">Followers</p>
            </div>
          </div>
          <div v-if="!isUser">
            <button v-if="user.isFollowing" @click="follow" class="btn btn-success font-weight-bold w-100">Following</button>
            <button v-else v-on:click="follow" class="btn btn-primary font-weight-bold w-100">Follow</button>
          </div>
        </div>
      </div>

      <ul class="row list-inline">
        <li class="col-sm-4" v-for="post in user.posts">
          <div class="card-body no-padding">
            <img :src="'../' + post.post_photo" alt="Post photo" class="img-fluid card-img-top postPics">
          </div>
        </li>
      </ul>
    </div>
  `,
  created: function(){
    let self = this;
    let current_user = localStorage.getItem('current_user');
    let user = self.$route.params.user_id;
    self.isUser = current_user === user;

    
    fetch(`/api/users/${self.$route.params.user_id}/posts`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.token}`
      },
      credentials: 'same-origin'
    })
    .then(function (response){
      return response.json();
    })
    .then(function (jsonResponse){
      console.log(jsonResponse);
      if(jsonResponse.hasOwnProperty("code")){
        router.replace('/login');
      }
      else{
        self.user = jsonResponse.user_data;
      }
    })
    .catch(function (error){
      console.log(error);
    });
  },
  data: function(){
    return {
      user: {},
      isUser: false
    };
  },
  methods: {
    follow: function() {
      let self = this;
      // let btn = document.querySelector('.btn.btn-primary');

      fetch(`/api/users/${self.$route.params.user_id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(resp => resp.json())
      .then(jsonResp => {
        if (jsonResp.hasOwnProperty("message")) {
          self.user.followers++;
          self.user.isFollowing = true;
        }
      })
    }
  }
});

const New = Vue.component('new', {
  template: `
    <div style="display:flex; justify-content: center;">
      <div style="width: 800px; margin: 0 350px 0 350px;">
        <h4> New Post </h4>
        <div class="border-top rounded bg-white">
          <div v-if='error'>
            {{ message }}
          </div>
          <form id="postForm" method="post" enctype="multipart/form-data" @submit.prevent="post" class="col-md-12" style="padding: 15px 15px 30px 15px;">
            <div class="form-group">
              <label> Photo </label>
              <input type="file" name="photo" class="form-control-file">
            </div>
            <div class="form-group">
              <label> Caption </label>
              <textarea name="caption" class="form-control" rows="3" placeholder="Write a caption..."></textarea>
            </div>
            <input type="submit" value="Submit" name="submit" class="btn btn-success btn-block">
          </form>
        </div>
      </div>
    </div>
  `,
  methods: {
    post: function(){
      let self = this;
      let postForm = document.getElementById('postForm');
      let form_data = new FormData(postForm);

      fetch(`/api/users/${localStorage.current_user}/posts`, {
        method: 'POST',
        body: form_data,
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(function (response){
        return response.json();
      })
      .then(function (jsonResponse){
        console.log(jsonResponse);
        router.push('/explore');
      })
      .catch(function (error){
        console.log(error);
      });
    }
  },
  data: function(){
    return {
      error: false,
      message: ''
    };
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
            <h3 class="title">
              <i class="fas fa-camera d-inline-block"></i>
              Photogram
            </h3>
          </div>
          <div class="card-body">
            <p> Share photos of your favourite moments with friends, family and around the world </p>
          </div>
          <router-link to="/register"><input type="submit" value="Register" class="btn btn-color ml-4 mr-2 col-lg-5 font-weight-bold"></router-link>
            <router-link to="/login"><input type="submit" value="Login" class="btn btn-primary col-lg-5 font-weight-bold"></router-link>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {};
  }
});

const NotFound = Vue.component('not-found', {
  template: `
    <h1>404 - Not Found </h1>
  `
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home},
    { path: '/register', component: Register},
    { path: '/login', component: Login},
    { path: '/logout', component: Logout},
    { path: '/explore', component: Explore},
    { path: '/users/:user_id', name:'user', component: User},
    { path: '/posts/new', component: New},
    // This is a catch all route in case none of the above matches
    {path: "*", component: NotFound}
  ]
});

let app = new Vue({
    el: '#app',
    router
});

