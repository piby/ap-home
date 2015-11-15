
function requestDishList(meal) {
  $.ajax({
    type:"GET",
    url :"list-dishes",
    data:"meal=" + meal,
    datatype:"json",
    error:function(data) { alert('Error'); },
    success:function(data) { showDishList(meal, data); }
  });
}

function showDishList(meal, data) {
  var text = '';
  for (var i in data) {
      text += '<li data-id="' + data[i].id + '"><a href=\"#\">' + data[i].name + '</a></li>\n'
  }    
  var itemId = '#dish-list';
  
  $(itemId).html(text);
  // if #dish-list has children then it was created
  // earlier and its content should be refreshed
  if ($(itemId).hasClass('ui-listview')) {
    $(itemId).listview("refresh");
  }
  $('#dish-list li').on('tap', function(event) { requestDishData($(this).attr('data-id')); });
  $.mobile.changePage($('#dish-list-page'));
}

function requestDishData(dishId) {
  $.ajax({
    type:"GET",
    url :"get-dish-data",
    data:"id=" + dishId,
    datatype:"json",
    error:function(data) { alert('Error'); },
    success:function(data) { showDishData(dishId, data); }
  });
}

function showDishData(dishId, data) {
  var text;
  var itemId = '#dish-page';
  // set dish name
  $(itemId + ' div h1').html(data.name);
  // set dish photo
  if (data.photo) {
    $('#dish-photo').attr('src', data.photo);
  }
  else {
    $('#dish-photo').attr('src', 'img/noimage.jpg');
  }
  // set dish ingredients
  text = '';
  for (var i in data.ingredients) {
    var ingredient = data.ingredients[i]
    text += '<li>' + ingredient.name + ' - ' + ingredient.quantity + ' ' + ingredient.unit + '</li>\n'
  }
  $('#dish-ingredients').html(text);
  // set dish recipe
  text = '';
  for (var i in data.reciepe) {
    text += '<li>' + data.reciepe[i] + '</li>\n'
  }
  $('#dish-recipe').html(text);
  // set dish keywords
  text = '';
  for (var i in data.keywords) {
    text += data.keywords[i];
    if (i != (data.keywords.length - 1)) {
        text += ', ';
    }
  }
  $('#dish-keywords').html(text);
  $.mobile.changePage($('#dish-page'));
}
