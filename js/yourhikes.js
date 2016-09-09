// This is the js file for yourhikes.html

$(document).ready(function() {
  'use strict';

  $('.collapsible').collapsible({
    accordion : true
  });

  if (localStorage.getItem('savedHikes') !== '{}' && localStorage.getItem('savedHikes') !== null) {
    $('#no-hikes-message').css('display', 'none');
    $('.hikes-pop-out-div').css('display', 'block');
    $('body').css('background-image', 'none');
  };

  // let hikesPopOut = '<div class="row">' + '<h1 class="center">your hikes</h1>' +
  //                   '<ul class="collapsible popout" data-collapsible="accordion">' +
  //                   '<li><div class="collapsible-header center-align">Test Thing</div>' +
  //                   '<div class="collapsible-body">' + '<div class="row">' +
  //                   '<div class="col s4 center-align">' + '<p>Content</p>' +
  //                   '</div>' + '<div class="col s4 center-align">' +
  //                   '<h4>11.99</h4></div>' + '<div class="col s4 center-align">' +
  //                   '</div></div></div></li></ul></div>'
  // console.log(hikesPopOut);

  // <li>
  //   <div class="collapsible-header center-align">Arugula Pie</div>
  //   <div class="collapsible-body">
  //     <div class="row">
  //       <div class="col s4 center-align">
  //         <p>Image might go here.</p>
  //       </div>
  //       <div class="col s4 center-align">
  //           <h4>11.99</h4>
  //       </div>
  //       <div class="col s4 center-align">
  //         <p>Pizza nutrition</p>
  //       </div>
  //
  //     </div>
  //   </div>
  // </li>

  function makePopOut(hikeName, hikeDescription, hikeURL) {
    let $li = $('<li>'),
        $headerDiv = $('<div class="collapsible-header center-align">'),
        $bodyDiv = $('<div class="collapsible-body">'),
        $rowDiv = $('<div class="row">'),
        $col1Div = $('<div class="col s8 center-align">'),
        $col2Div = $('<div class="col s4 center-align">');

    $headerDiv.text(hikeName);
    $col1Div.append($('<p>').text(hikeDescription.replace(/<br>/g, ' ')));
    $col2Div.append($('<p>').append(hikeURL));

    $li.append($headerDiv).append($bodyDiv.append($rowDiv.append($col1Div).append($col2Div)));

    return $li;
  };


  let hikeCount = Number(localStorage.getItem('savedHikeCount'));
  if (hikeCount > 0) {
    let savedHikeObject = JSON.parse(localStorage.getItem('savedHikes'));
    console.log(savedHikeObject);
    while (hikeCount > 0) {
      hikeCount--;
      let newSavedHike = savedHikeObject[hikeCount];
      console.log(newSavedHike['link']);
      let newSavedHikeName = newSavedHike['name'] + ', ' + newSavedHike['city'] + ', ' + newSavedHike['state'];
      $('#hikes-pop-out').append(makePopOut(newSavedHikeName, newSavedHike['info'], newSavedHike['link']));
    }
  }

  $('#clear-saved-hikes').click(function() {
    $('#no-hikes-message').fadeIn();
    $('.hikes-pop-out-div').fadeOut();
    localStorage.clear();
  });

});
