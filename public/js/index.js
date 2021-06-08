const assignStars = recipe => {
	if (recipe.rating > 0){
		const ratingSplit = recipe.rating.toString().split('.');
		let stars = '',
			i     = 1,
			total = 0;
		// full stars
		while (i <= ratingSplit[0]){
			stars += '<i class="fas fa-star"></i>';
			i++;
			total++;
		}
		// half star
		if (ratingSplit[1] > 0){
			stars += '<i class="fas fa-star-half-alt"></i>';
			total++;
		}
		// empty stars
		while (total < 5){
			stars += '<i class="far fa-star"></i>';
			total++;
		}
		return recipe.rating + ' ' + stars + ' (' + recipe.ratingVotes + ')';
	}
	else{
		return '';
	}
}

const buildCards = recipe =>{
	const cardData = $([
        '<div class="col mb-5" id="' + recipe.uuid + '">',
        '    <div class="card h-100">',
        '      <div class="card-img-wrap">',
        '        <img class="card-img-top" src="public/' + recipe.images.small + '" alt="..." />',
        '      </div>',
        '        <!-- Recipe-->',
        '        <div class="card-body p-4">',
        '            <div class="">',//text-center
        '                <!-- Title-->',
        '                <h5 class="fw-bolder">' + recipe.title + '</h5>',
        '                <!-- Description-->',
        '                ' + recipe.description + '<br/>',
        '            </div>',
        '        </div>',
        '        <!-- Recipe actions-->',
        '        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">',
        '            <div class="recipe-rating">' + assignStars(recipe) + '</div>',//<a class="btn btn-outline-dark mt-auto" href="#">View Recipe</a>
        '        </div>',
        '    </div>',
        '</div>'

	].join("\n"));
	$('.recipe-cards').append(cardData);
}

const fetchJson = (e) =>{
	$.getJSON( "http://localhost:3001/recipes", function(data) {
		// console.log(data);
		data.filter(buildCards);
	});
}




$(document).ready(function() {
  fetchJson();
});