// This is the js file for yourhikes.html

$(document).ready(function() {
  'use strict';

  $('.collapsible').collapsible({
    accordion : true
  });

  if (localStorage.getItem('noSaved') === null || localStorage.getItem('noSaved') === 'null') {

    localStorage.setItem('noSaved', 'false');

    localStorage.setItem('compHikeCount', '0');

    localStorage.setItem('completedHikes', '{}');
  }

  if (localStorage.getItem('savedHikes') !== '{}' && localStorage.getItem('savedHikes') !== null) {
    $('#no-hikes-message').css('display', 'none');
    $('.hikes-pop-out-div').css('display', 'block');
    $('body').css('background-image', 'none');
  };

  function makePopOut(hikeName, hikeDescription, hikeURL, hikeID) {
    let $li = $('<li>'),
        $headerDiv = $('<div class="collapsible-header center-align">'),
        $bodyDiv = $('<div class="collapsible-body">'),
        $rowDiv = $('<div class="row">'),
        $col1Div = $('<div class="col s8 center-align">'),
        $col2Div = $('<div class="col s4 center-align">'),
        $completeButton = $('<button class="btn green center">Mark as Hiked</button>');

    $headerDiv.attr('id', hikeID);

    $completeButton.click(function(event) {

      let $hikeHeader = $(event.target).parent().parent().parent().prev()
      $hikeHeader.addClass('completed');
      $hikeHeader.append('<i class="material-icons md-light checkmark">done</i>');
      $(event.target).css('display', 'none');

      let numCompHikes = localStorage.getItem('compHikeCount');
      let tempCompHikes = JSON.parse(localStorage.getItem('completedHikes'));

      let newCompHike = {
        [numCompHikes]: {
          id: $hikeHeader.attr('id')
        }
      }

      tempCompHikes[numCompHikes] = newCompHike[numCompHikes];

      let jsonCompHikes = JSON.stringify(tempCompHikes);

      localStorage.setItem('completedHikes', jsonCompHikes);

      localStorage.setItem('compHikeCount', Number(numCompHikes) + 1);



    });

    $headerDiv.text(hikeName);
    $col1Div.append($('<p>').text(hikeDescription.replace(/<br>/g, ' ')));
    $col2Div.append($('<p>').append(hikeURL));
    $col2Div.append($completeButton);

    $li.append($headerDiv).append($bodyDiv.append($rowDiv.append($col1Div).append($col2Div)));

    return $li;
  };

  let hikeCount = Number(localStorage.getItem('savedHikeCount'));
  if (hikeCount > 0) {
    let savedHikeObject = JSON.parse(localStorage.getItem('savedHikes'));
    while (hikeCount > 0) {
      hikeCount--;
      let newSavedHike = savedHikeObject[hikeCount];
      let newSavedHikeName = newSavedHike['name'] + ', ' + newSavedHike['city'] + ', ' + newSavedHike['state'];
      $('#hikes-pop-out').append(makePopOut(newSavedHikeName, newSavedHike['info'], newSavedHike['link'], newSavedHike['id']));
    }
  }

  for (let i = 0; i < Number(localStorage.getItem('compHikeCount')); i++) {
    let pertinentID = JSON.parse(localStorage.getItem('completedHikes'))[i]['id'];

    $(`#${pertinentID}`).addClass('completed');
    $(`#${pertinentID}`).append('<i class="material-icons md-light checkmark">done</i>');
    $(`#${pertinentID}`).siblings().children().children().children('button').css('display', 'none');
  }

  $('#clear-saved-hikes').click(function() {
    $('#no-hikes-message').fadeIn();
    $('.hikes-pop-out-div').fadeOut();
    $('body').css('background-image', 'url("pictures/yellowleaf.png")');
    localStorage.setItem('savedHikes', '{}');
    localStorage.setItem('savedHikeCount', '0');
    localStorage.setItem('noSaved', 'null');
    localStorage.setItem('completedHikes', '{}');
    localStorage.setItem('compHikeCount', '0');
  });

});
