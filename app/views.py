"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
from app import app, db, login_manager
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
    if request.method == "POST":
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
        return jsonify(message=success)
    else:
        #flash message to indicate registration failure
        failure = "User information not submitted."
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



#Save the uploaded photo to a folder
def assignPath(upload):
    filename = secure_filename(upload.filename)
    upload.save(os.path.join(
                app.config['UPLOAD_FOLDER'], filename
    ))
    return filename
    
    
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
