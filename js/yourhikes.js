$(document).ready(() => {
  'use strict';

  // Initialize pop-out menu
  $('.collapsible').collapsible({
    accordion: true
  });

  // Check if there are saved hikes and set local storage accordingly
  if (localStorage.getItem('noSaved') === null ||
      localStorage.getItem('noSaved') === 'null') {
    localStorage.setItem('noSaved', 'false');

    localStorage.setItem('compHikeCount', '0');

    localStorage.setItem('completedHikes', '{}');
  }

  // Check to see if saved hikes menu should be displayed
  if (localStorage.getItem('savedHikes') !== '{}' &&
      localStorage.getItem('savedHikes') !== null) {
    $('#no-hikes-message').css('display', 'none');
    $('.hikes-pop-out-div').css('display', 'block');
    $('body').css('background-image', 'none');
  }

  // Make pop-out menu of saved hikes
  const makePopOut = function(hikeName, hikeDescription, hikeURL, hikeID) {
    const $li = $('<li>');
    const $headerDiv = $('<div class="collapsible-header center-align">');
    const $bodyDiv = $('<div class="collapsible-body">');
    const $rowDiv = $('<div class="row">');
    const $col1Div = $('<div class="col s8 center-align">');
    const $col2Div = $('<div class="col s4 center-align">');
    const $completeButton = $('<button class="btn green center">Mark as \
                              Hiked</button>');

    $headerDiv.attr('id', hikeID);

    $completeButton.click((event) => {
      const $hikeHeader = $(event.target).parent().parent().parent().prev();

      $hikeHeader.addClass('completed');
      $hikeHeader.append('<i class="material-icons md-light \
                          checkmark">done</i>');
      $(event.target).css('display', 'none');

      const numCompHikes = localStorage.getItem('compHikeCount');
      const tempCompHikes = JSON.parse(localStorage.getItem('completedHikes'));

      const newCompHike = {
        [numCompHikes]: {
          id: $hikeHeader.attr('id')
        }
      };

      tempCompHikes[numCompHikes] = newCompHike[numCompHikes];

      const jsonCompHikes = JSON.stringify(tempCompHikes);

      localStorage.setItem('completedHikes', jsonCompHikes);

      localStorage.setItem('compHikeCount', Number(numCompHikes) + 1);
    });

    $headerDiv.text(hikeName);
    $col1Div.append($('<p>').text(hikeDescription.replace(/<br>/g, ' ')));
    $col2Div.append($('<p>').append(hikeURL));
    $col2Div.append($completeButton);

    $li.append($headerDiv).append($bodyDiv.append($rowDiv.append($col1Div)
      .append($col2Div)));

    return $li;
  };

  let hikeCount = Number(localStorage.getItem('savedHikeCount'));

  if (hikeCount > 0) {
    const savedHikeObject = JSON.parse(localStorage.getItem('savedHikes'));

    while (hikeCount > 0) {
      hikeCount -= 1;
      const newSavedHike = savedHikeObject[hikeCount];
      const newSavedHikeName = `${newSavedHike.name}, ${newSavedHike.city}, \
                                ${newSavedHike.state}`;

      $('#hikes-pop-out').append(makePopOut(newSavedHikeName, newSavedHike.info,
                                          newSavedHike.link, newSavedHike.id));
    }
  }

  for (let i = 0; i < Number(localStorage.getItem('compHikeCount')); i++) {
    const pertinentID = JSON.parse(localStorage.getItem('completedHikes'))[i]
                        .id;

    $(`#${pertinentID}`).addClass('completed');
    $(`#${pertinentID}`).append('<i class="material-icons md-light \
                                checkmark">done</i>');
    $(`#${pertinentID}`).siblings().children().children().children('button')
                                                    .css('display', 'none');
  }

  // Clear saved hikes from local storage
  $('#clear-saved-hikes').click(() => {
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
