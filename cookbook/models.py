from django.db import models

class IngredientUnit(models.Model):
    base_form = models.CharField(max_length=50)
    fraction_form = models.CharField(max_length=50)
    few_form = models.CharField(max_length=50)
    many_form = models.CharField(max_length=50)

# nabial/tluszcze, slodycze, warzywa, owoce, przetwory mleczne,
# produkty miesne, ryby, napoje, pieczywo, konserwy, makaron/ryz/kasza,
# produkty sypkie, sosy, mrozonki, dania gotowe, inne
# https://www.tesco.pl/marki-i-uslugi/produkty-tesco/artykuly-spozywcze
class IngredientType(models.Model):
    name = models.CharField(max_length=50)

class Ingredient(models.Model):
    name = models.CharField(max_length=50)
    category_type = models.ForeignKey(IngredientType)
    default_quantity = models.DecimalField(max_digits=5, decimal_places=2)
    default_unit = models.ForeignKey(IngredientUnit)

class Dish(models.Model):
    MEAL_TYPES = (
        ('0', 'Breakfast'),
        ('1', 'Soup'),
        ('2', 'Main'),
        ('3', 'Desert')
    )
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=1, choices=MEAL_TYPES)
    recipe = models.CharField(max_length=4000)
    last_done_date = models.DateField()

class DishPhoto(models.Model):
    dish = models.ForeignKey(Dish)
    file_name = models.CharField(max_length=200)
    sequential_number = models.CharField(max_length=1)

class DishIngredient(models.Model):
    dish = models.ForeignKey(Dish)
    ingredient = models.ForeignKey(Ingredient)
    quantity = models.DecimalField(max_digits=5, decimal_places=2)
    unit = models.ForeignKey(IngredientUnit)
    sequential_number = models.CharField(max_length=1)

class Category(models.Model):
    name = models.CharField(max_length=50)

class DishCategory(models.Model):
    dish = models.ForeignKey(Dish)
    category = models.ForeignKey(Category)
    sequential_number = models.CharField(max_length=1)

class MealPlan:
    date = models.DateField()
    dish = models.ForeignKey(Dish)
    description = models.CharField(max_length=50)
    sequential_number = models.CharField(max_length=1)
