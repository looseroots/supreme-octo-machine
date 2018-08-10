from flask import redirect, url_for, render_template, request, session, jsonify
from app import app
import random

test_events = [
    {
        "name" : "Surfing",
        "desc" : "Catch some waves in Pacifica",
    },
    {
        "name" : "Movie",
        "desc" : "See the newest summer hits",
    },
    {
        "name" : "Hike",
        "desc" : "Walk your way up to a beautiful view",
    },
    {
        "name" : "Italian Food",
        "desc" : "Mamma mia!",
    },
    {
        "name" : "Swimming",
        "desc" : "Cool off in the pool",
    },
    {
        "name" : "Library",
        "desc" : "You haven't read a book in a while",
    }
]

@app.before_request
def pick_nav_emoji():
    if 'nav_emoji' not in session.keys():
        session['nav_emoji'] = random.choice(app.config['NAVBAR_EMOJIS'])

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/get_events')
def get_events():
    # some sample events
    return jsonify(events=test_events)