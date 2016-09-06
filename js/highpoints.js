var stateHighpoints = [
  {
    'peakName': 'Cheaha Mountain',
    'state': 'Alabama'
  },
  {
    'peakName': 'Denali',
    'state': 'Alaska'
  },
  {
    'peakName': 'Humphreys Peak',
    'state': 'Arizona'
  },
  {
    'peakName': 'Mount Magazine',
    'state': 'Arkansas'
  },
  {
    'peakName': 'Mount Whitney',
    'state': 'Californa'
  },
  {
    'peakName': 'Mount Elbert',
    'state': 'Colorado'
  },
  {
    'peakName': 'Mount Frissell',
    'state': 'Connecticut'
  },
  {
    'peakName': 'Ebright Azimuth',
    'state': 'Delaware'
  },
  {
    'peakName': 'Britton Hill',
    'state': 'Florida'
  },
  {
    'peakName': 'Brasstown Bald',
    'state': 'Georgia'
  },
  {
    'peakName': 'Mauna Kea',
    'state': 'Hawaii'
  },
  {
    'peakName': 'Borah Peak',
    'state': 'Idaho'
  },
  {
    'peakName': 'Charles Mound',
    'state': 'Illinois'
  },
  {
    'peakName': 'Hoosier High Point',
    'state': 'Indiana'
  },
  {
    'peakName': 'Hawkeye Point',
    'state': 'Iowa'
  },
  {
    'peakName': 'Mount Sunflower',
    'state': 'Kansas'
  },
  {
    'peakName': 'Black Mountain',
    'state': 'Kentucky'
  },
  {
    'peakName': 'Driskill Mountain',
    'state': 'Louisiana'
  },
  {
    'peakName': 'Mount Katahdin',
    'state': 'Maine'
  },
  {
    'peakName': 'Backbone Mountain',
    'state': 'Maryland'
  },
  {
    'peakName': 'Mount Greylock',
    'state': 'Massachusetts'
  },
  {
    'peakName': 'Mount Arvon',
    'state': 'Michigan'
  },
  {
    'peakName': 'Eagle Mountain',
    'state': 'Minnesota'
  },
  {
    'peakName': 'Woodall Mountain',
    'state': 'Mississippi'
  },
  {
    'peakName': 'Taum Sauk',
    'state': 'Missouri'
  },
  {
    'peakName': 'Granite Peak',
    'state': 'Montana'
  },
  {
    'peakName': 'Panorama Point',
    'state': 'Nebraska'
  },
  {
    'peakName': 'Boundary Peak',
    'state': 'Nevada'
  },
  {
    'peakName': 'Mount Washington',
    'state': 'New Hampshire'
  },
  {
    'peakName': 'High Point',
    'state': 'New Jersey'
  },
  {
    'peakName': 'Wheeler Peak',
    'state': 'New Mexico'
  },
  {
    'peakName': 'Mount Marcy',
    'state': 'New York'
  },
  {
    'peakName': 'Mount Mitchell',
    'state': 'North Carolina'
  },
  {
    'peakName': 'White Butte',
    'state': 'North Dakota'
  },
  {
    'peakName': 'Cleveland',
    'state': 'Ohio'
  },
  {
    'peakName': 'Black Mesa',
    'state': 'Oklahoma'
  },
  {
    'peakName': 'Mount Hood',
    'state': 'Oregon'
  },
  {
    'peakName': 'Mount Davis',
    'state': 'Pennsylvania'
  },
  {
    'peakName': 'Jerimoth Hill',
    'state': 'Rhode Island'
  },
  {
    'peakName': 'Sassafras Mountain',
    'state': 'South Carolina'
  },
  {
    'peakName': 'Harney Peak',
    'state': 'South Dakota'
  },
  {
    'peakName': 'Clingmans Dome',
    'state': 'Tennessee'
  },
  {
    'peakName': 'Guadalupe Peak',
    'state': 'Texas'
  },
  {
    'peakName': 'Kings Peak',
    'state': 'Utah'
  },
  {
    'peakName': 'Mount Mansfield',
    'state': 'Vermont'
  },
  {
    'peakName': 'Mount Rogers',
    'state': 'Virginia'
  },
  {
    'peakName': 'Mount Rainier',
    'state': 'Washington'
  },
  {
    'peakName': 'Spruce Knob',
    'state': 'West Virginia'
  },
  {
    'peakName': 'Timms Hill',
    'state': 'Wisconsin'
  },
  {
    'peakName': 'Gannett Peak',
    'state': 'Wyoming'
  }
];

// geocoding: AIzaSyCTjk4qkcAxIt7ObrFQZUDm2RJCrBz0hD8
// maps: AIzaSyCFp1aNKLlFLi4bxc2cTYjq1XvBisXNo3s
// https://maps.googleapis.com/maps/api/geocode/json?address=Mount+Mansfield+Vermont&key=AIzaSyCTjk4qkcAxIt7ObrFQZUDm2RJCrBz0hD8

var map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 46.852307, lng: -121.760323},
    zoom: 5
  });

  var newPeak = new google.maps.Marker({
    position: {lat: 46.852307, lng: -121.760323},
    map: map,
    title: 'Hello!'
  });

  function makeTrailsURL(latitude, longitude, limit, activityName) {
    var counter = 0;
    var trailsURL = 'https://trailapi-trailapi.p.mashape.com/?';
    var moreURL = '';
    var argumentList = [];
    for (argument of arguments) {
        if (argument !== '') {
          argumentList.push(argument.split(' ').join('+'));
        }
    }
    for (arg of argumentList) {
      if (counter === 0) {
        moreURL += arg;
      } else {
        moreURL += `&${arg}`;
      }
      counter += 1;
    }
    return (trailsURL + moreURL);
  };

  var infoContent;

  var $trails = $.ajax({
      dataType: "json",
      url: makeTrailsURL('lat=46.852307', 'lon=-121.760323', 'limit=5', 'q[activities_activity_type_name_eq]=hiking'),
      headers: {
        "X-Mashape-Key": "Agg1qbtLRcmshUri3sJD11mVxIiyp1JheEDjsnIMALfvefA4Ok"
      },
      success: function(thingy) {
        infoContent = thingy['places'][0]['activities'][0]['description'];
        console.log(thingy);
      }
  });

  newPeak.addListener('click', function() {
    var infowindow = new google.maps.InfoWindow({
      content: infoContent
    });
    infowindow.open(newPeak.get('map'), newPeak);
  });


};

// function getCoords(peak, state, stateNum) {
//   var $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${peak}+${state}&key=AIzaSyCTjk4qkcAxIt7ObrFQZUDm2RJCrBz0hD8`);
//   console.log($xhr);
//   $xhr.done(function(data) {
//       if ($xhr.status !== 200) {
//           return;
//       }
//
//       var lat = (data['results'][0]['geometry']['location']['lat']);
//       var lng = (data['results'][0]['geometry']['location']['lng']);
//
//       stateHighpoints[stateNum]['lat'] = lat;
//       stateHighpoints[stateNum]['lng'] = lng;
//
//       var newPeak = new google.maps.Marker({
//         position: {lat: stateHighpoints[stateNum]['lat'], lng: stateHighpoints[stateNum]['lng']},
//         map: map,
//         title: stateHighpoints[stateNum]['peakName']
//       });

      // newPeak.addListener('click', function() {
      //   console.log('hello!');
      // });


//     });
//
// }
//
// var stateCounter = 0;

// for (let item of stateHighpoints) {
//   let peakSearchName = (item['peakName'].split(' ').join('+'));
//   let stateSearchName = (item['state'].split(' ').join('+'));
//   getCoords(peakSearchName, stateSearchName, stateCounter);
//   stateCounter += 1;
// }

// trails api Agg1qbtLRcmshUri3sJD11mVxIiyp1JheEDjsnIMALfvefA4Ok
// structure of object that is returned:
// object['places'] is an array of objects
// each object has these keys: 'activities', 'city', 'country', 'date_created',
//                             'description', 'directions', 'lat', 'lon',
//                             'name', 'parent_id', 'state', 'unique_id'
// object['activities'] is an array of objects
// activity_type_name is a key that tells you the activity type
// ' \

// var latitude2 = 'lat=000';
// var longitude2 = 'lon=000';
// var limit2 = 'limit=25';
// var trailName2 = 'q[activities_activity_name_cont]=Yellow+River+Trail';
// var activityName2 = 'q[activities_activity_type_name_eq]=hiking';
// var city2 = 'q[city_cont]=Denver';
// var country2 = 'q[country_cont]=Australia';
// var state2 = 'q[state_cont]=California';
// var radius2 = 'radius=25';
//
// function makeTrailsURL(latitude, longitude, limit, trailName, activityName, city, country, state, radius) {
//   var counter = 0;
//   var trailsURL = 'https://trailapi-trailapi.p.mashape.com/?';
//   var moreURL = '';
//   var argumentList = [];
//   for (argument of arguments) {
//       if (argument !== '') {
//         argumentList.push(argument.split(' ').join('+'));
//       }
//   }
//   for (arg of argumentList) {
//     if (counter === 0) {
//       moreURL += arg;
//     } else {
//       moreURL += `&${arg}`;
//     }
//     counter += 1;
//   }
//   return (trailsURL + moreURL);
// };

$.ajax({
    dataType: "json",
    url: `https://trailapi-trailapi.p.mashape.com/?${latitude}&${limit}&${longitude}&${trailName}&${activityName}&${city}&${country}&${state}&${radius}`,
    headers: {
      "X-Mashape-Key": "Agg1qbtLRcmshUri3sJD11mVxIiyp1JheEDjsnIMALfvefA4Ok"
    },
    success: function(thingy) {
      console.log(thingy['places']);
    }
});
