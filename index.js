const fetchJson = function(e){
	$.getJSON( "http://localhost:3001/recipes", function( data ) {
		console.log(data);
	});
}

$(document).ready(function() {
  $('.warning').on('click', fetchJson);
});