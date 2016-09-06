$(document).ready(function() {
  'use strict';

  // Initialize an empty array to keep track of all the markers
  let markers = [];

  // Event listener for the search button ('Go hiking!')
  $('#hike-button').click(function(event) {

    // Stop the page from refreshing
    event.preventDefault();

    // Fade the search form and button out
    $('#search-form').fadeOut();

    // Fade the 'search again' button in
    $('#search-again').fadeIn();

    let $inputText = $('#addressInput').val();
    let searchText = $inputText.replace(/ /g, '+');

    var $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchText}&key=AIzaSyCTjk4qkcAxIt7ObrFQZUDm2RJCrBz0hD8`)

    $xhr.done(function(data) {
        if ($xhr.status !== 200) {
            return;
        }

        let newLat = (data['results'][0]['geometry']['location']['lat']);
        let newLng = (data['results'][0]['geometry']['location']['lng']);

        let newMarker = new google.maps.Marker({
          position: {lat: newLat, lng: newLng},
          map: map,
          title: $inputText,
        });

        markers.push(newMarker);

        let newInfoWindow = new google.maps.InfoWindow({
          content: $inputText
        });
        // Create an EVENT LISTENER so that the infowindow opens when
        // the marker is clicked!
        newMarker.addListener('click', function() {
          newInfoWindow.open(map, newMarker);
        });

        let newTrailsURL = makeTrailsURL(newLat, newLng, '10', '', '', '', '25');

        // Get the info from TrailsAPI
        $.ajax({
            dataType: "json",
            url: newTrailsURL,
            headers: {
              "X-Mashape-Key": "Agg1qbtLRcmshUri3sJD11mVxIiyp1JheEDjsnIMALfvefA4Ok"
            },
            success: function(data) {
              let hikes = data['places'];
              for (let hike of hikes) {
                let hikeMarker = new google.maps.Marker({
                  position: {lat: hike['lat'], lng: hike['lon']},
                  // map: map,
                  title: hike['name'],
                  animation: google.maps.Animation.DROP,
                  icon: 'tree.png'
                });
                let description = hike['activities'][0]['description'].replace(/&lt;br \/&gt;<br \/>/g, '<br><br>');
                let moreInfoLink = `<a href=${hike['activities'][0]['url']}>Click here for more information</a>`
                let infoWindowContent = '<div class="info-window-content"><h6>' +
                  hike['activities'][0]['name'] + '</h6>' + '<p>' +
                  description + '</p>' +
                  moreInfoLink + '</div';
                let hikeInfo = new google.maps.InfoWindow({
                  content: infoWindowContent
                });
                markers.push(hikeMarker);
                hikeMarker.addListener('click', function() {
                  hikeInfo.open(map, hikeMarker);
                });
              };
              showHikes();
            }
        });

    });

    function makeTrailsURL(latitude, longitude, limit, trailName, city, state, radius) {
      let counter = 0;
      let trailsURL = 'https://trailapi-trailapi.p.mashape.com/?q[activities_activity_type_name_eq]=hiking';
      let moreURL = '';
      let argumentList = [];

      for (let argument of arguments) {
          if (argument !== '') {
            if (counter === 0) {
              argument = 'lat=' + argument;
            } else if (counter === 1) {
              argument = 'lon=' + argument;
            } else if (counter === 2) {
              argument = 'limit=' + argument;
            } else if (counter === 3) {
              argument = 'q[activities_activity_name_cont]=' + argument;
            } else if (counter === 4) {
              argument = 'q[city_cont]=' + argument;
            } else if (counter === 5) {
              argument = 'q[state_cont]=' + argument;
            } else if (counter === 6) {
              argument = 'radius=' + argument;
            }
            argumentList.push(argument);
          }
          counter += 1;
      }
      for (let arg of argumentList) {
        moreURL += `&${arg}`;
      }
      return (trailsURL + moreURL);
    };

  });

  function showHikes() {
      let bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    }

  function hideHikes() {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  $('#search-again').click(function(event) {
    $('#search-form').fadeIn();

    $('#search-again').fadeOut();

    hideHikes();

    markers = [];
  });

});
