from django.http import HttpResponse
from django.http import JsonResponse
from django.template import RequestContext, loader
from django.views.decorators.csrf import csrf_protect
import json

password = "1point0"

def index(request):
    template = loader.get_template('cookbook.html')
    context = RequestContext(request, {
        'version': '16.11.2015',
    })
    return HttpResponse(template.render(context))

def getDishList(request):
	meal = request.GET['meal']
	# todo query database
	data = [
		{
			'id': 1,
			'name': 'Omlet z papryka',
			'count': 10,
			'last_done_date': 'tydzien temu'
		},
		{
			'id': 2,
			'name': 'Kanapki',
			'count': 100,
			'last_done_date': 'miesiac temu'
		}
	]
	return JsonResponse(data, safe=False)

def getDishData(request):
	id = request.GET['id']
	# todo query database
	data = {
		'name':'Omlet',
		'meal':'breakfast',
		'photo': 'http://www.mojegotowanie.pl/var/self/storage/images/media/images/przepisy/miesa/omlet_z_cukinia_i_szynka/3758778-1-pol-PL/omlet_z_cukinia_i_szynka_popup_watermark.jpg',
		'ingredients': [
		    {
		        'name': 'jajka',
		        'quantity': 4,
		        'unit': 'sztuki'
		    },
		    {
		        'name': 'papryka',
		        'quantity': 0.5,
		        'unit': 'sztuki'
		    },
		    {
		        'name': 'oliwki',
		        'quantity': 15,
		        'unit': 'sztuk'
		    }
		],
		'optional_ingredients': [
		],
		'reciepe': [
			'Posiekac dodatki',
			'Roztrzepac jajka',
			'Wylac jajka na rozgrzana patelnie',
			'Po chwili dosypac dodatki',
			'Smarzyc na malym ogniu pod przykryciem',
			'Po 10 minutach obrocic omlet na druga strone'
		],
		'keywords': [
			'jajka',
			'papryka',
			'smazone'
		]
	}
	return JsonResponse(data)

@csrf_protect
def addDishData(request):
    data = request.body
    general_data = data['general']
    ingredients_data = data['ingredients']
    recipe_data = data['recipe']
    keywords_data = data['keywords']
    # check if password is correct
    if general_data.password != password:
        return JsonResponse({'result': 'invalid pssword' })
    # create new dish
    dish = Dish(
        name = general_data.name,
        type = general_data.type,
        recipe = str(recipe_data),
        done_count = 0,
        last_done_date = datetime.date.today() )
    dish.save()
    # process new units
    '''
    Algorithm:
    - get all units
    - iterate over new units
    - if unit was added earlier skip it
    - if it was not add it
    class IngredientUnits(models.Model):
        name = models.CharField(max_length=50)
    '''
    # process new ingredients definitions
    '''
    class Ingredients(models.Model):
        name = models.CharField(max_length=50)
	   default_unit = models.ForeignKey(IngredientUnits)
	   default_quantity = models.DecimalField(max_digits=5, decimal_places=2)
    '''
    # add all dish ingredients
    index = 0
    for ingredient in ingredients_data.selected:
        dish_ingredient = DishIngredients(
            dish = dish.id,
            ingredient = ingredient[0],     # TODO: convert name to ID
            quantity = ingredient[1],
            unit = ingredient[2],           # TODO: convert unit to ID
            sequential_number = index)
        dish_ingredient.save()
        index = index + 1
    return JsonResponse({'result': 'ok' })

def updateDishData(request):
    data = request.GET['data']
    return JsonResponse({'result': 'ok' })
