var fetchJson = function(e){
	$.getJSON( "https://bitbucket.org/crescendocollective/frontend-api-skills-test/data.json", function( data ) {
		console.log(data);
	});
}

$(document).ready(function() {
  $('.warning').on('click', fetchJson);
});