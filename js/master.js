$(document).ready(function() {
  'use strict';
  var $body = $('body');

  $body.prepend(
    '<nav> \
      <div class="nav-wrapper green darken-1"> \
        <a href="index.html" class="center brand-logo menu-item">Hike Finder</a> \
      </div> \
    </nav>'
  );

  $body.append(
    '<footer class="page-footer green darken-1 white-text"> \
      <div class="container"> \
        <div class="row"> \
          <div class="col s12 m4"> \
            <h5>Hike Finder</h5> \
            Find a hike. \
          </div> \
          <div class="col s4 offset-s4"> \
            <ul> \
              <li><a href="index.html" class="white-text">Home</a></li> \
              <li><a href="search.html" class="white-text">Find a Hike</a></li> \
            </ul> \
          </div> \
        </div> \
      </div> \
      <div class="footer-copyright"> \
        <div class="container"> \
          © 2016 Hike Finder \
        </div> \
      </div> \
    </footer>'
  );
});
