from django.http import HttpResponse
from django.template import RequestContext, loader


def index(request):
    template = loader.get_template('cookbook.html')
    context = RequestContext(request, {
        'version': '10.11.2015',
    })
    return HttpResponse(template.render(context))

"""
def getJson(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    output = ', '.join([p.question_text for p in latest_question_list])
    return HttpResponse(output)
"""
