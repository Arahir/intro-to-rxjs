//Selectors
var refreshButton = document.querySelector('.refresh');
var closeButton1  = document.querySelector('.close1');
var closeButton2  = document.querySelector('.close2');
var closeButton3  = document.querySelector('.close3');


//Stream from click
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
var close1ClickStream  = Rx.Observable.fromEvent(closeButton1, 'click');
var close2ClickStream  = Rx.Observable.fromEvent(closeButton2, 'click');
var close3ClickStream  = Rx.Observable.fromEvent(closeButton3, 'click');


// Main Stream
var requestStream = refreshClickStream
  .startWith('startup click')
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });


// Create the Suggestion Stream
function makeSuggestionStream(closeClickStream){
  return closeClickStream.startWith('startup click')
    .combineLatest(responseStream,
      function(click, listUsers) {
        return listUsers[Math.floor(Math.random()*listUsers.length)];
      }
    )
    .merge(
      refreshClickStream.map(function(){ return null; })
    )
    .startWith(null);
}

var suggestion1Stream = makeSuggestionStream(close1ClickStream);
var suggestion2Stream = makeSuggestionStream(close2ClickStream);
var suggestion3Stream = makeSuggestionStream(close3ClickStream);


// Render the suggestions
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
suggestion2Stream.subscribe(function(suggestion) {
  renderSuggestion(suggestion, '.suggestion2');
});
suggestion3Stream.subscribe(function(suggestion) {
  renderSuggestion(suggestion, '.suggestion3');
});
