# ap-home
Home management web application

## OpenShift Setup
* download oc Command Line Tool from OpenShift panel
* ./oc get pods
* ./oc rsh aphome-??-?????
* python manage.py createsuperuser
* python manage.py makemigrations cookbook
* python manage.py migrate

## Running localy
* python manage.py createsuperuser
* python manage.py makemigrations cookbook
* python manage.py migrate
* python manage.py runserver --nostatic
