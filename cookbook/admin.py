from django.contrib import admin
from .models import IngredientUnit
from .models import IngredientType
from .models import Ingredient
from .models import DishIngredient
from .models import DishPhoto
from .models import DishCategory
from .models import Dish
from .models import Category

admin.site.register(IngredientUnit)
admin.site.register(IngredientType)
admin.site.register(Ingredient)
admin.site.register(DishIngredient)
admin.site.register(DishPhoto)
admin.site.register(DishCategory)
admin.site.register(Dish)
admin.site.register(Category)
