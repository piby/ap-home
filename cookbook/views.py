from django.http import HttpResponse
from django.http import JsonResponse
from django.template import RequestContext, loader
from django.views.decorators.csrf import csrf_protect
import json

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
    # print request.body
    general_key = 'general'
    ingredients_key = 'ingredients'
    recipe_key = 'recipe'
    keywords_key = 'keywords'
    """
    if 'general' not in data_keys or \
       'general' not in data_keys or \
       'general' not in data_keys or \
       'general' not in data_keys:
    """
    return JsonResponse({'result': 'ok' })

def updateDishData(request):
    data = request.GET['data']
    return JsonResponse({'result': 'ok' })
