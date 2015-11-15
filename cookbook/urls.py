from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
	url(r'^list-dishes$', views.getDishList, name='getDishList'),
	url(r'^get-dish-data$', views.getDishData, name='getDishData')
]
