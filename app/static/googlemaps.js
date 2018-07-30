var geocoder;
var available_events;
var map;
var start_coords;
var end_coords;
var starting_marker;
var ending_marker;
var place_name;
var num_events;
var delay_length = 500;
var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();


function geocoderCallback(results, status) {
    if (status != 'OK') {
        console.log("Geocode failed because " + status);
        return null;
    }

    return results[0];
}

function updateBounds() {
    var bounds = new google.maps.LatLngBounds();
    var starting_bounds = starting_marker.getPosition();
    var ending_bounds = ending_marker.getPosition();
    if (starting_bounds) {
        bounds.extend(starting_marker.getPosition());
    }
    if (ending_bounds) {
        bounds.extend(ending_marker.getPosition());
    }
    map.fitBounds(bounds);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: {lat: 35, lng: 240}});

    geocoder = new google.maps.Geocoder();
    starting_marker = new google.maps.Marker({
        map: map
    });
    ending_marker = new google.maps.Marker({
        map: map
    });
}

function updateMapSize() {
    $('div#map').css('height', $('div#next-to-map').css('height'));
    $('div#map').css('width', $('div#next-to-map').css('width'));
}

function addInputField(parent, id, type="text") {
    var new_div = $('<div>', {
        class: 'input-group mb-3',
        id: 'input-group' + id
    });
    new_div.appendTo(parent);
    
    var new_input = $('<input>', {
        type: type,
        id: id
    });

    new_input.appendTo(new_div);
    return new_input;
}

function removeInputField(id) {
    $('div#input-group' + id).remove();
}

function getEventAsCard(event) {
    // currently an event is just a name string but this ought to
    // be made more interesting later
    var outermost = $('<div>', {
        class: "card",
        style: "width: auto;"
    });
    
    var innermost = $('<div>', {
        class: "card-body"
    });

    var event_title = $('<h5>', {
        class: 'card-title',
        text: event,
    });
    event_title.appendTo(innermost);

    var event_text = $('<p>', {
        class: 'card-text',
        text: event,
    });
    event_text.appendTo(innermost);

    innermost.appendTo(outermost);
    return outermost;
}

function loadEventForm() {
    $('h1#current-topic-title').text('What would you like to do near ' + place_name + "?");
    removeInputField('starting_location');
    $('a#add-events').remove();

    $.getJSON($SCRIPT_ROOT + '/get_events', {}, 
        function(data) {
            if (data['events']) {
                var available_events = data['events'];
                var deck = $('<div>', {class: 'card-deck', style: 'padding-bottom: 5px;'});
                console.log(available_events);
                for (var i=0; i<available_events.length; i++) {
                    var as_card = getEventAsCard(available_events[i]);
                    deck.append(as_card);

                    if ((i+1)%3==0) {
                        $('#next-to-map').append(deck);
                        deck = $('<div>', {class: 'card-deck', style: 'padding-bottom: 5px;'});
                    }
                }

                updateMapSize();
            } else {
                available_events = null;
            }
        }
    );

}

$(document).ready(function() {
    num_events = 0;
    $('h1#current-topic-title').text('Where in the world are you?');
    var location_input = addInputField('form#general-input-form', 'starting_location');
    location_input.on('keyup', function() {
        delay(function(){ 
            if (location_input.val()) {
                var address = location_input.val()
                geocoder.geocode({'address': address}, function(results, status) {
                    var response = geocoderCallback(results, status);
                    if (response) {
                        map.fitBounds(response.geometry.bounds)
                        place_name = response.address_components[0]["long_name"]
                    } else {
                        place_name = null;
                    }
                });
            }
        }, delay_length);
    });

    var add_events_button = $('<a>', {
        id: 'add-events',
        class: 'btn btn-primary',
        text: 'Add Events'
    });
    add_events_button.appendTo('#next-to-map');

    add_events_button.on('click', function() {
        if (place_name) {
            loadEventForm();
        } else {
            console.log('Hmm. I don\'t recognize ', location_input.val());
        }
    });

    updateMapSize();
});

$(window).resize(function() {
    updateMapSize();
});
