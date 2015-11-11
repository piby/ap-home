
function showDishList(meal) {
  var text = '';
  for (var i in dishData) {
	if (dishData[i].meal == meal) {
      text += '<li data-id="' + dishData[i].id + '"><a href=\"#\">' + dishData[i].name + '</a></li>\n'
	}
  }    
  var itemId = '#dish-list';
  
  $(itemId).html(text);
  // if #dish-list has children then it was created
  // earlier and its content should be refreshed
  if ($(itemId).hasClass('ui-listview')) {
    $(itemId).listview("refresh");
  }
  $('#dish-list li').on('tap', function(event) { showDish($(this).attr('data-id')); });
  $.mobile.changePage($('#dish-list-page'));
}

function showDish(dishObjectId) {
  // find dish object data
  var dishObject = undefined;
  for (var i in dishData) {
	if (dishData[i].id == dishObjectId) {
      dishObject = dishData[i];
      break;
    }
  }
  if (dishObject == undefined) {
    return;
  }
  var text;
  var itemId = '#dish-page';
  // set dish name
  $(itemId + ' div h1').html(dishObject.name);
  // set dish photo
  if (dishObject.photo) {
    $('#dish-photo').attr('src', dishObject.photo);
  }
  else {
    $('#dish-photo').attr('src', 'img/noimage.jpg');
  }
  // set dish ingredients
  text = '';
  for (var i in dishObject.ingredients) {
    var ingredient = dishObject.ingredients[i]
    text += '<li>' + ingredient.name + ' - ' + ingredient.quantity + ' ' + ingredient.unit + '</li>\n'
  }
  $('#dish-ingredients').html(text);
  // set dish recipe
  text = '';
  for (var i in dishObject.reciepe) {
    text += '<li>' + dishObject.reciepe[i] + '</li>\n'
  }
  $('#dish-recipe').html(text);
  // set dish keywords
  text = '';
  for (var i in dishObject.keywords) {
    text += dishObject.keywords[i];
    if (i != (dishObject.keywords.length - 1)) {
        text += ', ';
    }
  }
  $('#dish-keywords').html(text);
  $.mobile.changePage($('#dish-page'));
}
