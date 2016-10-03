from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^list-dishes$', views.getDishList, name='getDishList'),
    url(r'^get-dish-data$', views.getDishData, name='getDishData'),
    url(r'^add-dish-data$', views.addDishData, name='addDishData'),
    url(r'^update-dish-data$', views.updateDishData, name='updateDishData'),
    url(r'^remove-dish-data$', views.removeDishData, name='removeDishData'),
    url(r'^backup-dishes$', views.backupDishesData, name='backupDishesData'),
    url(r'^upload-dishes$', views.uploadDishesData, name='uploadDishesData'),
    url(r'^get-components$', views.getComponents, name='getComponents')
]
