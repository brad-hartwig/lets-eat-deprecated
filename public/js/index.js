const recipesStorage = JSON.parse(sessionStorage.getItem('recipesData')),
      specialsStorage = JSON.parse(sessionStorage.getItem('specialsData'));

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

const createCards = recipe =>{
  const cardData = $([
    '<div class="col mb-5" data-uuid="' + recipe.uuid + '">',
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

const createPreview = function(e){
  $('#recipe-preview').remove();
  const uuid = $(this).data('uuid');
  let i           = '',
      ingredients = '',
      directions  = '';
  // find correct recipe object
  recipesStorage.find(function(obj, index, arr){
    if (obj.uuid === uuid){
      i = index; 
    }
  });
  // build ingredients list
  recipesStorage[i].ingredients.filter(function(obj, index, arr){
    ingredients += '<li data-uuid="' + obj.uuid + '">' + obj.amount + ' ' + obj.measurement + ' ' + obj.name + '</li>';
  });
  // build directions list
  recipesStorage[i].directions.filter(function(obj, index, arr){
    directions += '<li>' + obj.instructions + '</li>';
  });
  const previewData = $([
    '<div id="recipe-preview" data-uuid="' + recipesStorage[i].uuid + '" class="recipe-preview d-sm-flex d-md-inline-flex d-lg-inline-flex flex-sm-wrap flex-md-nowrap flex-lg-nowrap">',
    '  <div class="recipe-details-img">',
    '    <img src="public' + recipesStorage[i].images.medium + '" style="width: 100%;"/>',
    '  </div>',
    '  <div class="recipe-details">',
    '    <h2>' + recipesStorage[i].title + '</h2>',
    '    <div class="recipe-date">' + recipesStorage[i].editDate + '</div>',
    '    <table class="recipe-time">',
    '      <tr>',
    '        <td><i class="fas fa-clock"></i></td>',
    '        <td>Prep :' + recipesStorage[i].prepTime + '</td>',
    '        <td>Cook :' + recipesStorage[i].cookTime + '</td>',
    '      </tr>',
    '    </table>',
    '    <div>',
    '      <i class="fas fa-utensils"></i> Servings: ' + recipesStorage[i].servings,
    '    </div>',
    '    <div class="recipe-details-separator">',
    '      <h5>Ingredients</h5>',
    '      <ul class="ingredients">',
    '      ' + ingredients,
    '      </ul>',
    '    </div>',
    '    <div class="recipe-details-separator">',
    '      <h5>Directions</h5>',
    '      <ol>',
    '       ' + directions,
    '      </ol>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n"));
  $('.TEST-INJECTION').append(previewData);
  // build directions list
  specialsStorage.filter(function(obj, index, arr){
    const special = '<li class="ingredient-special"><i class="fas fa-hand-point-right"></i><div><b>' + obj.title + '</b><br/>' + obj.text + '</div></li>';
    $('.ingredients li').each(function(index){
      if ($(this).data('uuid') === obj.ingredientId){
        $(special).insertAfter($(this));
      }
    });
  });
}

const fetchJson = (e) =>{
  // get recipes data
  $.getJSON( "http://localhost:3001/recipes", function(recipesData) {
    sessionStorage.setItem('recipesData', JSON.stringify(recipesData));
    recipesStorage.filter(createCards);
  });
  // get specials data
  $.getJSON( "http://localhost:3001/specials", function(specialsData) {
    sessionStorage.setItem('specialsData', JSON.stringify(specialsData));
  });
}




$(document).ready(function() {
  fetchJson();
  $('body').delegate('.mb-5', 'click', createPreview);
});