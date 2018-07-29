from flask import redirect, url_for, render_template, request, session, jsonify
from app import app
import random

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
    return jsonify(events=[
        'Surfing',
        'Movie',
        'Hike',
        'Italian Food',
        'Swimming',
        'Library'
    ])