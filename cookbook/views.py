from django.http import HttpResponse
from django.http import JsonResponse
from django.template import RequestContext, loader
from django.views.decorators.csrf import csrf_protect
from django.core.exceptions import ObjectDoesNotExist
from cookbook.models import IngredientUnit
from cookbook.models import Ingredient
from cookbook.models import DishIngredient
from cookbook.models import DishPhoto
from cookbook.models import DishCategory
from cookbook.models import Dish
from cookbook.models import Category
from datetime import date
import json

password = "1point0"

def index(request):
    template = loader.get_template('cookbook.html')
    context = {
        'version': 'v2016.08.01',
    }
    return HttpResponse(template.render(context, request))

def getDishList(request):
    meal_type = request.GET['meal']
    dishes = Dish.objects\
        .filter(type=meal_type)\
        .values('id', 'name', 'last_done_date')\
        .order_by('name')
    return JsonResponse(list(dishes), safe=False)

def getDishData(request):
    requested_id = request.GET['id']
    try:
        dish = Dish.objects.get(pk=requested_id)
    except ObjectDoesNotExist:
        return JsonResponse({'result': 'specified dish is not in data base'})
    photos = DishPhoto.objects\
        .filter(dish=dish)\
        .values('file_name', 'sequential_number')\
        .order_by('sequential_number')
    ingredients = DishIngredient.objects\
        .filter(dish=dish)\
        .values()\
        .order_by('sequential_number')
    categories = DishCategory.objects\
        .filter(dish=dish)\
        .values()\
        .order_by('sequential_number')
    data = {
        'name': dish.name,
        'meal': dish.type,
        'photos': [p.filename for p in photos],
        'ingredients': list(ingredients),
        'reciepe': json.loads(dish.recipe),
        'categories': [c.category for c in categories],
        'result': 'ok'
    }
    return JsonResponse(data)

@csrf_protect
def addDishData(request):
    new_units = []
    new_ingredients = []
    new_categories = []
    data = json.loads(request.body.decode("utf-8"))
    # print(json.dumps(data, indent=4, sort_keys=True)) ### TO BE REMOVED
    general_data = data['general']
    ingredients_data = data['ingredients']
    recipe_data = data['recipe']
    categories_data = data['categories']
    # check if password is correct
    if general_data['password'] != password:
        return JsonResponse({'result': 'invalid pssword'})
    # validate data
    if not general_data['name']:
        return JsonResponse({'result': 'missing dish name'})
    if not ingredients_data['selected']:
        return JsonResponse({'result': "ingredients weren't defined"})
    # create new dish
    dish = Dish(
        name=general_data['name'],
        type=general_data['type'],
        recipe=json.dumps(recipe_data),
        last_done_date=date(2000, 1, 1))
    dish.save()
    # process new units
    if ingredients_data['new-units']:
        print("new units")
        all_units = IngredientUnit.objects.values_list(
            'base_form', flat=True)
        all_base_forms_set = set(all_units)
        new_units = ingredients_data['new-units']
        new_base_forms_set = {unit[0] for unit in new_units}
        new_base_forms_set -= all_base_forms_set
        if new_base_forms_set:
            for unit in new_units:
                if unit[0] in new_base_forms_set:
                    ingredient_unit = IngredientUnit(
                        base_form=unit[0],
                        fraction_form=unit[1],
                        few_form=unit[2],
                        many_form=unit[3])
                    ingredient_unit.save()
                    new_units.append({
                        'id': ingredient_unit.id,
                        'name': ingredient_unit.base_form})
    # process new ingredients definitions
    if ingredients_data['new-ingredients']:
        print("new ingredients")
        all_ingredients = Ingredient.objects.values_list(
            'name', flat=True)
        all_ingredient_names_set = set(all_ingredients)
        print(all_ingredient_names_set)
        new_ingredients = ingredients_data['new-ingredients']
        new_ingredient_names_set = {i[0] for i in new_ingredients}
        new_ingredient_names_set -= all_ingredient_names_set
        print(new_ingredient_names_set)
        if new_ingredient_names_set:
            for i in new_ingredients:
                if i[0] not in new_ingredient_names_set:
                    continue
                try:
                    ingredient_unit = IngredientUnit.objects.get(
                        base_form__iexact=i[2])
                except ObjectDoesNotExist:
                    continue
                ingredient = Ingredient(
                    name=i[0],
                    default_quantity=i[1],
                    default_unit=ingredient_unit)
                ingredient.save()
                new_ingredients.append({
                    'id': ingredient.id,
                    'name': ingredient.name})
    # add all dish ingredients
    order_index = 0
    for i in ingredients_data['selected']:
        # find ingredient record
        try:
            ingredient = Ingredient.objects.get(
                name__iexact=i[0])
        except ObjectDoesNotExist:
            message = "missing {0} dish ingredient".format(i[0])
            return JsonResponse({'result': message})
        # find ingredient unit record
        try:
            ingredient_unit = IngredientUnit.objects.get(
                base_form__iexact=i[2])
        except ObjectDoesNotExist:
            message = "missing {0} ingredient unit".format(i[2])
            return JsonResponse({'result': message})
        # add dish ingredient
        dish_ingredient = DishIngredient(
            dish=dish,
            ingredient=ingredient,
            quantity=i[1],
            unit=ingredient_unit,
            sequential_number=order_index)
        order_index += 1
        dish_ingredient.save()
    # process new category definitions
    if categories_data['new']:
        all_categories = Category.objects.values_list(
            'name', flat=True)
        all_categories_names_set = set(all_categories)
        new_categories_names_set = set(categories_data['new'])
        new_categories_names_set -= all_categories_names_set
        for category_name in new_categories_names_set:
            category = Category(name=category_name)
            category.save()
            new_categories.append({
                'id': category.id,
                'name': category.name})
    # add all dish categories
    if categories_data['selected']:
        order_index = 0
        for category_name in categories_data['selected']:
            # find category record
            try:
                category = Category.objects.get(
                    name__iexact=category_name)
            except ObjectDoesNotExist:
                continue
            dish_category = DishCategory(
                dish=dish,
                category=category,
                sequential_number=order_index)
            order_index += 1
    return JsonResponse({'result': 'ok',
            'new_units': new_units,
            'new_ingredients': new_ingredients,
            'new_categories': new_categories})

def removeDish(request):
    return JsonResponse({'result': 'ok'})

def updateDishData(request):
    data = request.GET['data']
    return JsonResponse({'result': 'ok'})

@csrf_protect
def getComponents(request):
    """Get data that is needed to add/update dishes. This can include
    all ingredients, all ingredient units and all categories"""
    request_type = request.GET['type']
    all_units = []
    all_ingredients = []
    all_categories = []
    if 'units' in request_type:
        all_units = IngredientUnit.objects.values_list(
            'id', 'base_form', 'fraction_form', 'few_form', 'many_form')
    if 'ingredients' in request_type:
        all_ingredients = Ingredient.objects.values_list(
            'id', 'name', 'default_quantity', 'default_unit')
    if 'categories' in request_type:
        all_categories = Category.objects.values_list('id', 'name')
    data = {
        'result': 'ok',
        'units': list(all_units),
        'ingredients': list(all_ingredients),
        'categories': list(all_categories)
    }
    return JsonResponse(data)
