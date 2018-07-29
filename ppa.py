from app import app
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--debug', dest='debug', action='store_true')

debug = parser.parse_args().debug

if debug:
    # disable static file caching in debug
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

app.run(debug=parser.parse_args().debug)