/* eslint-disable max-len, max-statements, no-undef */

$(document).ready(() => {
  'use strict';

  // Initialize collapse button
  $('.button-collapse').sideNav({
    menuWidth: 300,
    edge: 'left',
    closeOnClick: true
  });

  // Initialize an empty array to keep track of all the markers
  let markers = [];

  const showHikes = function() {
    const bounds = new google.maps.LatLngBounds();

    // Extend the boundaries of the map for each marker and display the marker
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }

    // Set the bounds of the maps to encompass the markers
    map.fitBounds(bounds);
  };

  const hideHikes = function() {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  const makeTrailsURL = function(newLat, newLng, newLimit, newTrail,
                                newCity, newState, newRadius) {
    let counter = 0;
    const trailsURL = 'https://trailapi-trailapi.p.mashape.com/?q[activities_activity_type_name_eq]=hiking';
    let moreURL = '';
    const argumentList = [];

    for (let argument of arguments) {
      if (argument !== '') {
        if (counter === 0) {
          argument = `lat=${argument}`;
        } else if (counter === 1) {
          argument = `lon=${argument}`;
        } else if (counter === 2) {
          argument = `limit=${argument}`;
        } else if (counter === 3) {
          argument = `q[activities_activity_name_cont]=${argument}`;
        } else if (counter === 4) {
          argument = `q[city_cont]=${argument}`;
        } else if (counter === 5) {
          argument = `q[state_cont]=${argument}`;
        } else if (counter === 6) {
          argument = `radius=${argument}`;
        }
        argumentList.push(argument);
      }
      counter += 1;
    }

    for (const arg of argumentList) {
      moreURL += `&${arg}`;
    }

    return trailsURL + moreURL;
  };

  $('.button-collapse').sideNav('hide');

  $('#adv-search').click(() => {
    $('.button-collapse').sideNav('show');
  });

  $('#adv-search-button').click(() => {
    if ($('#sideNavAddress').val() !== '') {
      $('.button-collapse').sideNav('hide');
    }
  });

  $('#search-bar').focus(() => {
    $('#search-bar').css('background-color', '#1b5e20');
    $('#search-bar').css('color', 'white');
    $('#search-icon').css('color', 'white');
  });

  $('#search-bar').blur(() => {
    $('#search-bar').css('background-color', '#43a047');
  });

  const searchToast = function() {
    Materialize.toast('Enter an address, city, state, or landmark in the search bar at the top, and then press enter', 4000, 'rounded');
  };

  const delayedToast = function() {
    window.setTimeout(searchToast, 2000);
  };

  const searchToast2 = function() {
    Materialize.toast('Click "Advanced Search" at the bottom right if you want more search options', 4000, 'rounded');
  };

  const delayedToast2 = function() {
    window.setTimeout(searchToast2, 6500);
  };

  const searchToast3 = function() {
    Materialize.toast('After you search, click on the trees to explore and save different hikes', 4000, 'rounded');
  };

  const delayedToast3 = function() {
    window.setTimeout(searchToast3, 11000);
  };

  const searchToast4 = function() {
    Materialize.toast('Click "Your Hikes" at the bottom right to see the hikes you\'ve picked out', 4000, 'rounded');
  };

  const delayedToast4 = function() {
    window.setTimeout(searchToast4, 15500);
  };

  if (localStorage.getItem('newVisitor') === null) {
    localStorage.setItem('newVisitor', 'false');

    delayedToast();
    delayedToast2();
    delayedToast3();
    delayedToast4();
  }

  // Initialize the saved hikes object in local storage
  if (localStorage.getItem('savedHikes') === null) {
    localStorage.setItem('savedHikes', '{}');
  }

  // Initialize a count of saved hikes in local storage
  if (localStorage.getItem('savedHikeCount') === null) {
    localStorage.setItem('savedHikeCount', '0');
  }

  // Event listener for when either search form is submitted
  $('.hike-search').submit((event) => {
    event.preventDefault();

    $('#search-bar').blur();

    hideHikes();

    markers = [];

    const newTrail = '';
    const newCity = '';
    let newLimit = '10';
    let newRadius = '25';
    let newState = '';
    let $inputText = '';

    // Check if the input is in the main search bar
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

    $('.hike-search-input').val('');

    // Get the coordinates
    const searchText = $inputText.replace(/ /g, '+');
    const $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchText}&key=AIzaSyCTjk4qkcAxIt7ObrFQZUDm2RJCrBz0hD8`);

    // Place the initial marker
    $xhr.done((data) => {
      if ($xhr.status !== 200) {
        return;
      }

      const newLat = (data.results[0].geometry.location.lat);
      const newLng = (data.results[0].geometry.location.lng);

      const newMarker = new google.maps.Marker({
        map,
        position: { lat: newLat, lng: newLng },
        title: $inputText
      });

      const hikeInfo = new google.maps.InfoWindow({
        content: null
      });

      markers.push(newMarker);

      const newTrailsURL = makeTrailsURL(newLat, newLng, newLimit, newTrail, newCity, newState, newRadius);

      $.ajax({
        dataType: 'json',
        url: newTrailsURL,
        headers: {
          'X-Mashape-Key': 'Agg1qbtLRcmshUri3sJD11mVxIiyp1JheEDjsnIMALfvefA4Ok'
        },
        success: (data2) => {
          const hikes = data2.places;

          // Set a marker for each trailsAPI result
          for (const hike of hikes) {
            const hikeMarker = new google.maps.Marker({
              position: { lat: hike.lat, lng: hike.lon },
              title: hike.name,
              animation: google.maps.Animation.DROP,
              icon: 'tree.png'
            });

            // Replace <br> tags that show up in the info window text
            const description = hike.activities[0].description.replace(/&lt;br \/&gt;<br \/>/g, '<br><br>');

            // Set a link that goes to the tripleblaze site
            const moreInfoLink = `<a href=${hike.activities[0].url} target='_blank'>Click here for more information</a>`;

            // Set a link that will save the hike to local storage
            const saveHike = '<p class="save-hike"> Click here to save this hike to your hikes </p>';

            const infoWindowContent = `<div class="info-window-content"><h6>${hike.activities[0].name}</h6><p>${description}</p>${moreInfoLink}${saveHike}</div>`;

            markers.push(hikeMarker);

            // Add event listener to each marker
            hikeMarker.addListener('click', () => {
              hikeInfo.setContent(infoWindowContent);
              hikeInfo.open(map, hikeMarker);

              $('.save-hike').click((event) => {
                $(event.target).off();

                Materialize.toast('Your hike was saved!', 2000);

                const hikeCount = localStorage.getItem('savedHikeCount');

                const hikeObj = {
                  [hikeCount]: {
                    name: hike.name,
                    info: description,
                    link: moreInfoLink,
                    city: hike.city,
                    state: hike.state,
                    id: hike.unique_id
                  }
                };

                const storedHikes = JSON.parse(localStorage.getItem('savedHikes'));

                storedHikes[hikeCount] = hikeObj[hikeCount];
                localStorage.setItem('savedHikeCount', Number(hikeCount) + 1);

                const jsonHike = JSON.stringify(storedHikes);

                localStorage.setItem('savedHikes', jsonHike);
              });
            });
          }

          showHikes();
        }
      });
    });
  });
});
