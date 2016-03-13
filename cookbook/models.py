from django.db import models

'''
class Ingredients(models.Model):
    name = models.CharField(max_length=50)
	default_unit = models.ForeignKey(IngredientUnits)
	default_quantity = models.DecimalField(max_digits=5, decimal_places=2)

class IngredientUnits(models.Model):
    name = models.CharField(max_length=50)

class Categories(models.Model):
    name = models.CharField(max_length=50)

class Dish(models.Model):
    MEAL_TYPES = (
        ('B', 'Breakfast'),
        ('S', 'Soup'),
        ('M', 'Main'),
        ('D', 'Desert')
    )
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=1, choices=MEAL_TYPES)
    reciepe = models.CharField(max_length=4000)
    done_count = models.IntegerField(default=0)
    last_done_date = models.DateField()

class DishPhotos(models.Model):
    dish = models.ForeignKey(Dish)
    photo = models.CharField(max_length=200)
    sequential_number = models.CharField(max_length=1)

class DishIngredients(models.Model):
    dish = models.ForeignKey(Dish)
    ingredient = models.ForeignKey(Ingredients)
	quantity = models.DecimalField(max_digits=5, decimal_places=2)
	unit = models.ForeignKey(IngredientUnits)
    sequential_number = models.CharField(max_length=1)

class DishCategories(models.Model):
    dish = models.ForeignKey(Dish)
    category = models.ForeignKey(Categories)
    sequential_number = models.CharField(max_length=1)

class MealPlan:
    date = models.DateField()
    dish = models.ForeignKey(Dish)
'''
