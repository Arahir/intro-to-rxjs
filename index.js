var requestStream = Rx.Observable.just('https://api.github.com/users');

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });

responseStream.subscribe(function(response) {
  console.log(response);
});

var refreshButton = document.querySelector('.refresh');
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

var requestStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

  var suggestion1Stream = responseStream
    .map(function(listUsers) {
      // get one random user from the list
      return listUsers[Math.floor(Math.random()*listUsers.length)];
    })
    .merge(
      refreshClickStream.map(function(){ return null; })
    )
    .startWith(null);

  function renderSuggestion(suggestedUser, selector) {
      var suggestionEl = document.querySelector(selector);
      if (suggestedUser === null) {
          suggestionEl.style.visibility = 'hidden';
      } else {
          suggestionEl.style.visibility = 'visible';
          var usernameEl = suggestionEl.querySelector('.username');
          usernameEl.href = suggestedUser.html_url;
          usernameEl.textContent = suggestedUser.login;
          var imgEl = suggestionEl.querySelector('img');
          imgEl.src = "";
          imgEl.src = suggestedUser.avatar_url;
      }
  }
  suggestion1Stream.subscribe(function(suggestion) {
    renderSuggestion(suggestion, '.suggestion1');
  });
