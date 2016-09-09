$(document).ready(function() {
  'use strict';

  // Initialize collapse button
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 240
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
  });

  // Inititally hide the advanced search
  $('.button-collapse').sideNav('hide');

  $('#adv-search').click(function() {
      $('.button-collapse').sideNav('show');
  });

  $('#adv-search-button').click(function() {
      if ($('#sideNavAddress').val() !== '') {
        $('.button-collapse').sideNav('hide');
      }
  });

  $('#search-bar').blur(function() {
    $('#search-bar').css('background-color', '#43a047');
  });

  $('#search-bar').focus(function() {
    $('#search-bar').css('background-color', '#1b5e20');
    $('#search-bar').css('color', 'white');
    $('#search-icon').css('color', 'white');
  });


  if (localStorage.getItem('newVisitor') === null) {

    localStorage.setItem('newVisitor', 'false');

    function delayedToast() {
      window.setTimeout(searchToast, 2000);
    }

    function searchToast() {
      Materialize.toast('Enter an address, city, state, or landmark in the search bar at the top, and then press enter', 4000, 'rounded');
    }

    function delayedToast2() {
      window.setTimeout(searchToast2, 6500);
    }

    function searchToast2() {
      Materialize.toast('Click "Advanced Search" at the bottom right if you want more search options', 4000, 'rounded');
    }

    function delayedToast3() {
      window.setTimeout(searchToast3, 11000);
    }

    function searchToast3() {
      Materialize.toast('After you search, click on the trees to explore and save different hikes', 4000, 'rounded');
    }

    function delayedToast4() {
      window.setTimeout(searchToast4, 15500);
    }

    function searchToast4() {
      Materialize.toast('Click "Your Hikes" at the bottom right to see the hikes you\'ve picked out', 4000, 'rounded');
    }

    delayedToast();
    delayedToast2();
    delayedToast3();
    delayedToast4();
  }

  if (localStorage.getItem('savedHikes') === null) {
    localStorage.setItem('savedHikes', '{}');
  }

  if (localStorage.getItem('savedHikeCount') === null) {
    localStorage.setItem('savedHikeCount', '0');
  }

  // Initialize an empty array to keep track of all the markers
  let markers = [];

  // Event listener for when either search form is submitted
  $('.hike-search').submit(function(event) {

    event.preventDefault();

    $('#search-bar').blur();

    hideHikes();

    markers = [];

    let hikeInfo = new google.maps.InfoWindow({
      content: ''
    });

    let newLimit = '10',
        newRadius = '25',
        newTrail = '',
        newCity = '',
        newState = '',
        $inputText = '';

    if ($('#search-bar').val() !== '') {
      $inputText = $('#search-bar').val();
    } else {
      if ($('#sideNavAddress').val() !== '') {
        $inputText = $('#sideNavAddress').val();
      }
      if ($('#sideNavLimit').val() !== '') {
        newLimit = $('#sideNavLimit').val();
      }
      if ($('#sideNavRadius').val() !== '') {
        newRadius = $('#sideNavRadius').val();
      }
      if ($('#sideNavState').val() !== '') {
        newState = $('#sideNavState').val();
      }
    }

    // Clear the search fields
    $('.hike-search-input').val('');

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

        let hikeInfo = new google.maps.InfoWindow({
          content: null
        });

        markers.push(newMarker);

        let newTrailsURL = makeTrailsURL(newLat, newLng, newLimit, newTrail, newCity, newState, newRadius);

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
                  title: hike['name'],
                  animation: google.maps.Animation.DROP,
                  icon: 'tree.png'
                });
                let description = hike['activities'][0]['description'].replace(/&lt;br \/&gt;<br \/>/g, '<br><br>');
                let moreInfoLink = `<a href=${hike['activities'][0]['url']} target='_blank'>Click here for more information</a>`
                let saveHike = '<p class="save-hike"> Click here to save this hike to your hikes </p>'
                let infoWindowContent = '<div class="info-window-content"><h6>' +
                  hike['activities'][0]['name'] + '</h6>' + '<p>' +
                  description + '</p>' +
                  moreInfoLink + saveHike + '</div>';
                markers.push(hikeMarker);

                hikeMarker.addListener('click', function() {
                  hikeInfo.setContent(infoWindowContent);
                  hikeInfo.open(map, hikeMarker);

                  $('.save-hike').click(function(event) {
                    $(event.target).off();

                    Materialize.toast('Your hike was saved!', 2000);

                    let hikeCount = localStorage.getItem('savedHikeCount');

                    let hikeObj = {
                      [hikeCount]: {
                        name: hike['name'],
                        info: description,
                        link: moreInfoLink,
                        city: hike['city'],
                        state: hike['state'],
                        id: hike['unique_id']
                      }
                    }

                    let storedHikes = JSON.parse(localStorage.getItem('savedHikes'));
                    storedHikes[hikeCount] = hikeObj[hikeCount];

                    localStorage.setItem('savedHikeCount', Number(hikeCount) + 1);

                    let jsonHike = JSON.stringify(storedHikes);

                    localStorage.setItem('savedHikes', jsonHike);
                  });

                });
              };
              showHikes();
            }
        });
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

});
