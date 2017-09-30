#!/usr/bin/env python

import os
import sys

# make sure the next line points to settings.py:
os.environ['APP_MODULE'] = 'aphome.settings'
# make sure the next line points to django project dir:
#sys.path.append(os.path.join(os.environ['OPENSHIFT_REPO_DIR'], 'wsgi', 'aphome'))
#from distutils.sysconfig import get_python_lib
#os.environ['PYTHON_EGG_CACHE'] = get_python_lib()

#import django.core.wsgi
#application = django.core.wsgi.get_wsgi_application()
