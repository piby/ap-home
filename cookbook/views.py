from django.http import HttpResponse
from django.http import JsonResponse
from django.template import RequestContext, loader

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

def setDish(request):
	return HttpResponse("ok", mimetype="application/x-javascript")

"""
def getJson(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    output = ', '.join([p.question_text for p in latest_question_list])
    return HttpResponse(output)
"""
