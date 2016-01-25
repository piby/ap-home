from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
	url(r'^list-dishes$', views.getDishList, name='getDishList'),
	url(r'^get-dish-data$', views.getDishData, name='getDishData'),
    url(r'^add-dish-data$', views.addDishData, name='addDishData'),
    url(r'^update-dish-data$', views.updateDishData, name='updateDishData')
]
