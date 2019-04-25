"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
from app import app, db, csrf, login_manager
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import RegisterForm, LoginForm, PostsForm
from app.models import Users, Likes, Follows, Posts
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash

###
# Routing for your application.
###

#Api route to allow a user to register for the application
@app.route("/api/users/register", methods=["POST"])
def register():
    form = RegisterForm()
    if request.method == "POST" and form.validate_on_submit() == True:
        username = form.username.data
        password = form.password.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        email = form.email.data
        location = form.location.data
        bio = form.biography.data
        photo = form.photo.data
        photo = assignPath(form.photo.data)
        
        #create user object and add to database
        user = Users(username, password, firstname, lastname, email, location, bio, photo)
        db.session.add(user)
        db.session.commit()
        
        #flash message to indicate the a successful entry
        success = "User sucessfully registered"
        return jsonify(message=success), 201
    else:
        #flash message to indicate registration failure
        failure = "User information not submitted."
        return jsonify(error=failure)
        
        

#Api route to allow the user to login into their profile on the application
@app.route("/api/auth/login", methods=["POST"])
def login():
    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit() == True:
        username = form.username.data
        password = form.password.data
        
        #Query the database to retrive the recording corresponding to the given username and password
        user = db.session.query(Users).filter_by(username=username).first()
        
        if user is not None and check_password_hash(user.password, password):
            
            #gets the user id and load into the session
            login_user(user)
            
            #Flash message to indicate a successful login
            success = "User successfully logged in."
            return jsonify(message=success)
       
    #Flash message to indicate a failed login
    failure = "User login failed."
    return jsonify(error=failure)


#Api route to allow the user to logout
@app.route("/api/auth/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    
    #Flash message indicating a successful logout
    success = "User successfully logged out."
    return jsonify(message=success)


#Api route to create and display the posts for a specific user
@app.route("/api/users/<user_id>/posts", methods=["POST", "GET"])
@login_required
def userPosts(user_id):
    
    #Gets the current user to add/display posts to
    user = db.session.query(Users).get(user_id)
    
    form = PostsForm()
    if request.method == "POST" and form.validate_on_submit() == True:
        caption = form.caption.data
        photo = assignPath(form.photo.data)
        post = Posts(photo, caption, user_id)
        db.session.add(post)
        db.session.commit()
        
        #Flash message to indicate a post was added successfully
        success = "Successfully created a new post"
        return jsonify(message=success), 201
        
    elif request.method == "GET":
        posts = []
        for post in user.posts:
            p = {"id": post.id, "user_id": post.user_id, "photo": post.photo, "description": post.caption, "created_on": post.created_on}
            posts.append(p)
        return jsonify(posts=posts)
        
    #Flash message to indicate an error occurred
    failure = "Failed to create/display posts"
    return jsonify(error=failure)


#Api route for a user to follow another user
@app.route("/api/users/<user_id>/follow", methods=["POST"])
@login_required
def following(user_id):
    if current_user.is_authenticated():
        id = current_user.id
        follow = Follows(id, user_id)
        db.session.add(follow)
        db.session.commit()
        
        #Flash message to indicate a successful following
        success = "You are now following that user"
        return jsonify(message=success), 201
    
    #Flash message to indicate that an error occurred
    failure = "Failed to follow user"
    return jsonify(error=failure)


#Api route to display all users and their posts
@app.route("/api/posts", methods=["GET"])
@login_required
def allPosts():
    posts = []
    users = db.session.query(Users).all()
    for user in users:
        for post in user.posts:
            p = {"id": post.id, "user_id": post.user_id, "photo": post.photo, "description": post.caption, "created_on": post.created_on, "likes": len(post.likes)}
            posts.append(p)
    return jsonify(posts=posts), 201
    
    
#Api route to set a like on a current post
@app.route("/api/posts/<post_id>/like", methods=["POST"])
@login_required
def likePost(post_id):
    post = db.session.query(Posts).filter_by(id=post_id).first()
    if current_user.is_authenticated():
        id = current_user.id
        like = Likes(id, post_id)
        db.session.add(like)
        db.session.commit()
        return jsonify(message="Post Liked!", likes=len(post.likes)), 201
    
    #Flash message to indicate that an error occurred
    failure = "Failed to like post"
    return jsonify(error=failure)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return app.send_static_file('index.html')


# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return db.session.query(Users).get(int(id))


#Save the uploaded photo to a folder
def assignPath(upload):
    filename = secure_filename(upload.filename)
    upload.save(os.path.join(
                app.config['UPLOAD_FOLDER'], filename
    ))
    return filename
    


@app.route('/')
def home():
    """Render website's home page."""
    return render_template('index.html')


###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
