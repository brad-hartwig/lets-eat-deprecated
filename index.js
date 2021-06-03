var fetchJson = function(e){
	// $.getJSON( "https://bitbucket.org/crescendocollective/frontend-api-skills-test/src/master/data.json", function( data ) {
	$.getJSON( "data.json", function( data ) {
		console.log(data);
	});
}

$(document).ready(function() {
  $('.warning').on('click', fetchJson);
});