from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^cookbook/', include('cookbook.urls'))
]
