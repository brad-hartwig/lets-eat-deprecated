(function(){
  let recipesStorage,
      specialsStorage;
})();

const fetchJson = e => {
  // get recipes data
  $.getJSON( "/rubanga/public/json/recipes.json", function(recipesData) {
  // $.getJSON( "http://localhost:3001/recipes", function(recipesData) {
    recipesStorage = recipesData;
    recipesStorage.map(createCards);
  });
  // get specials data
  $.getJSON( "/rubanga/public/json/specials.json", function(specialsData) {
  // $.getJSON( "http://localhost:3001/specials", function(specialsData) {
    specialsStorage = specialsData;
  });
}

// display rating stars on recipe cards
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

// iterate through recipe data onload and create a card for each
const createCards = recipe => {
  const cardData = $([
    '<div class="col mb-5 card-wrap" data-uuid="' + recipe.uuid + '">',
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
    '            <div class="recipe-rating">' + assignStars(recipe) + '</div>',
    '        </div>',
    '    </div>',
    '</div>'
  ].join("\n"));
  $('.recipe-cards').append(cardData);
}

// create a more detailed recipe after clicking on recipe card
const createPreview = function(e){
  $('.recipe-preview').remove();
  const uuid = $(this).data('uuid');
  let i = '',
      compiledIngredients = '',
      compiledDirections  = '';
  // find matching recipe uuid in data
  recipesStorage.find((obj, index) => (obj.uuid === uuid) ? i = index : null);
  // destructure found object
  const {ingredients, directions, images:{medium}, title, editDate, prepTime, cookTime, servings} = recipesStorage[i];
  // build ingredients list
  ingredients.map(obj => compiledIngredients += '<li data-uuid="' + obj.uuid + '">' + obj.amount + ' ' + obj.measurement + ' ' + obj.name + '</li>');
  // build directions list
  directions.map(obj => compiledDirections += '<li>' + obj.instructions + '</li>');
  const previewData = $([
    '<div data-uuid="' + uuid + '" class="recipe-preview col mb-5">',
    '  <div class="close-preview"><i class="far fa-window-close"></i></div>',
    '  <div class="d-sm-flex d-md-inline-flex d-lg-inline-flex flex-sm-wrap flex-md-nowrap flex-lg-nowrap">',
    '    <div class="recipe-details-img">',
    '      <img src="public' + medium + '" style="width: 100%;"/>',
    '    </div>',
    '    <div class="recipe-details">',
    '      <h2>' + title + '</h2>',
    '      <div class="recipe-date">' + editDate + '</div>',
    '      <table class="recipe-time">',
    '        <tr>',
    '          <td class="white"><i class="fas fa-clock"></i></td>',
    '          <td>Prep :' + prepTime + '</td>',
    '          <td>Cook :' + cookTime + '</td>',
    '          <td class="white"><i class="fas fa-utensils"></i></td>',
    '          <td>Servings: ' + servings + '</td>',
    '        </tr>',
    '      </table>',
    '      <div class="recipe-details-separator">',
    '        <h5>Ingredients</h5>',
    '        <ul class="ingredients">',
    '        ' + compiledIngredients,
    '        </ul>',
    '      </div>',
    '      <div class="recipe-details-separator">',
    '        <h5>Directions</h5>',
    '        <ol>',
    '         ' + compiledDirections,
    '        </ol>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n"));
  // insert preview after corresponding card
  $(previewData).insertAfter($(this));
  // get specials and place under appropriate ingredients
  specialsStorage.map(obj => { 
    const special = '<li class="ingredient-special"><i class="fas fa-hand-point-right"></i><div><b>' + obj.title + '</b><br/>' + obj.text + '</div></li>';
    $('.ingredients li').each((index, li) => ($(li).data('uuid') === obj.ingredientId) ? $(special).insertAfter($(li)) : null);
  });
  // scroll to preview
  $('html, body').scrollTop($('.recipe-preview').offset().top - 100);
}

// close recipe preview
const closePreview = e => {
  const previousCard = $(e.currentTarget).closest('.col').prev('.col');
  $('.recipe-preview').remove();
  $('html, body').scrollTop(previousCard.offset().top - 20);
}

$(document).ready(function() {
  fetchJson();
  $('body').delegate('.card-wrap', 'click', createPreview);
  $('body').delegate('.close-preview', 'click', closePreview);
});