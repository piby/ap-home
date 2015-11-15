from django.db import models

'''
class Ingredients(models.Model):
    name = models.CharField(max_length=50)

class IngredientUnits(models.Model):
    name = models.CharField(max_length=50)

class Dish(models.Model):
    MEAL_TYPES = (
        ('L', 'Small'),
        ('P', 'Soup'),
        ('R', 'Dinner'),
        ('T', 'Desert')
    )
    type = models.CharField(max_length=1, choices=MEAL_TYPES)
    photo = models.CharField(max_length=200)
    ingredients = models.CharField(max_length=2000)
    reciepe = models.CharField(max_length=4000)
    categories = models.CharField(max_length=500)
    done_count = models.IntegerField(default=0)
    last_done_date = models.DateField()

class MealPlan:
    date = models.DateField()
    dish = models.ForeignKey(Dish)
'''
