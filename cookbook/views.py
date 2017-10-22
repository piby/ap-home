from django.http import HttpResponse
from django.http import JsonResponse
from django.template import RequestContext, loader
from django.views.decorators.csrf import csrf_protect
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from cookbook.models import IngredientUnit
from cookbook.models import IngredientType
from cookbook.models import Ingredient
from cookbook.models import DishIngredient
from cookbook.models import DishCategory
from cookbook.models import Dish
from cookbook.models import Category
from datetime import date, timedelta
import json

password = "96ec3fa8d9749750a629fc2a7ebbc302"

def index(request):
    template = loader.get_template('cookbook.html')
    context = {
        'version': '2017.10.08',
    }
    return HttpResponse(template.render(context, request))

def getDishList(request):
    meal_type = request.GET['meal']
    dishes = Dish.objects\
        .filter(type=meal_type)\
        .values('id', 'name', 'photo', 'last_done_date')\
        .order_by('name')
    dishList = list(dishes)
    return JsonResponse(dishList, safe=False)

def getDishData(request):
    requested_id = request.GET['id']
    try:
        dish = Dish.objects.get(pk=requested_id)
    except ObjectDoesNotExist:
        return JsonResponse({'result': 'specified dish is not in data base'})
    ingredients = DishIngredient.objects\
        .filter(dish=dish)\
        .values()\
        .order_by('sequential_number')
    categories = DishCategory.objects\
        .filter(dish=dish)\
        .values()\
        .order_by('sequential_number')
    return JsonResponse({
        'name': dish.name,
        'meal': dish.type,
        'photo': dish.photo,
        'ingredients': list(ingredients),
        'reciepe': json.loads(dish.recipe),
        'categories': [c.category for c in categories],
        'result': 'ok'
    })

@csrf_protect
def addDishData(request):
    new_ingredients_response = []
    new_categories_response = []
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
        last_done_date=date(2017, 1, 1))
    dish.save()
    # process new ingredients definitions
    if ingredients_data['added']:
        all_ingredients = Ingredient.objects.values_list(
            'name', flat=True)
        all_ingredient_names_set = set(all_ingredients)
        new_ingredients = ingredients_data['added']
        new_ingredient_names_set = {i[0] for i in new_ingredients}
        new_ingredient_names_set -= all_ingredient_names_set
        if new_ingredient_names_set:
            for i in new_ingredients:
                if i[0] not in new_ingredient_names_set:
                    continue
                # find ingredient type
                try:
                    ingredient_type = IngredientType.objects.get(
                        pk=i[1])
                except ObjectDoesNotExist:
                    continue
                # find ingredient unit
                try:
                    ingredient_unit = IngredientUnit.objects.get(
                        pk=i[3])
                except ObjectDoesNotExist:
                    continue
                ingredient = Ingredient(
                    name=i[0],
                    category_type=ingredient_type,
                    default_quantity=i[2],
                    default_unit=ingredient_unit)
                ingredient.save()
                new_ingredients_response.append({
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
                pk__iexact=i[2])
        except ObjectDoesNotExist:
            message = "missing {0} ingredient unit".format(i[2])
            return JsonResponse({'result': message})
        # add dish ingredient
        dish_ingredient = DishIngredient(
            dish=dish,
            ingredient=ingredient,
            quantity=i[1],
            unit=ingredient_unit,
            sequential_number=chr(order_index))
        order_index += 1
        dish_ingredient.save()
    # process new category definitions
    if categories_data['added']:
        all_categories = Category.objects.values_list(
            'name', flat=True)
        all_categories_names_set = set(all_categories)
        new_categories_names_set = set(categories_data['added'])
        new_categories_names_set -= all_categories_names_set
        for category_name in new_categories_names_set:
            category = Category(name=category_name)
            category.save()
            new_categories_response.append({
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
                sequential_number=chr(order_index))
            order_index += 1
    return JsonResponse({'result': 'ok',
        'new_ingredients': new_ingredients_response,
        'new_categories': new_categories_response})

def updateDishData(request):
    data = request.GET['data']
    return JsonResponse({'result': 'ok'})

def updateDishDoneDate(request):
    dish_id = request.GET['dish_id']
    try:
        dish = Dish.objects.get(pk=dish_id)
    except ObjectDoesNotExist:
        return JsonResponse({'result': 'specified dish is not in data base'})
    days_offset = int(request.GET['days_offset'])
    delta = timedelta(days = days_offset)
    dish.last_done_date = date.today() - delta
    dish.save()
    return JsonResponse({'result': 'ok'})

def removeDishData(request):
    if request.GET['password'] != password:
        return JsonResponse({'result': 'invalid pssword'})
    requested_id = request.GET['id']
    try:
        dish = Dish.objects.get(pk=requested_id)
    except ObjectDoesNotExist:
        return JsonResponse({'result': 'specified dish is not in data base'})
    DishIngredient.objects.filter(dish=dish).delete()
    DishCategory.objects.filter(dish=dish).delete()
    dish.delete()
    return JsonResponse({ 'result': 'ok' })

@csrf_protect
def getComponents(request):
    """Get data that is needed to add/update dishes. This can include
    all ingredients, all ingredient units and all categories"""
    request_type = request.GET['type']
    all_units = []
    all_ingredients = []
    all_ingredient_types = []
    all_categories = []
    if 'units' in request_type:
        all_units = IngredientUnit.objects.values_list(
            'id', 'base_form', 'fraction_form', 'few_form', 'many_form')
    if 'ingredients' in request_type:
        all_ingredients = Ingredient.objects.values_list(
            'id', 'name', 'category_type', 'default_quantity', 'default_unit')
    if 'ingredient_types' in request_type:
        all_ingredient_types = IngredientType.objects.values_list(
            'id', 'name')
    if 'categories' in request_type:
        all_categories = Category.objects.values_list('id', 'name')
    data = {
        'result': 'ok',
        'units': list(all_units),
        'ingredients': list(all_ingredients),
        'ingredient_types': list(all_ingredient_types),
        'categories': list(all_categories)
    }
    return JsonResponse(data)

@csrf_protect
def backupDishesData(request):
    if request.GET['password'] != password:
        return JsonResponse({'result': 'invalid pssword'})
    dishes = Dish.objects.all()
    dishes_ingredients = DishIngredient.objects.all()
    dishes_categories = DishCategory.objects.all()
    dish_list = []
    # create array containing all dishes
    for dish in dishes:
        ingredients = dishes_ingredients\
            .filter(dish=dish)\
            .values('unit_id', 'sequential_number', 'ingredient_id', 'quantity')\
            .order_by('sequential_number')\
            .values('unit_id', 'ingredient_id', 'quantity')
        categories = dishes_categories\
            .filter(dish=dish)\
            .values()\
            .order_by('sequential_number')
        dish_list.append({
            'name': dish.name,
            'meal': dish.type,
            'photo': dish.photo,
            'ingredients': [list(i.values()) for i in ingredients],
            'recipe': json.loads(dish.recipe),
            'categories': [c.category for c in categories],
        })
    data = {
        'result': 'ok',
        'list': dish_list
    }
    return JsonResponse(data)

@csrf_protect
def uploadDishesData(request):
    if request.POST['password'] != password:
        return JsonResponse({'result': 'invalid pssword'})
    file_content = request.FILES['file'].read()
    new_data = json.loads(file_content.decode("utf-8"))
    # process units
    db_units = IngredientUnit.objects.values_list(
            'id', 'base_form')
    db_unit_names = [i[1] for i in db_units]
    new_units_name_map = {}
    with transaction.atomic():
        for send_unit_data in new_data["units"]:
            send_unit_id = send_unit_data[0]
            send_unit_base_name = send_unit_data[1]
            new_units_name_map[send_unit_base_name] = send_unit_id
            # if this unit name is already in db just skip it
            if send_unit_base_name in db_unit_names:
                continue
            # insert unit to db
            new_unit = IngredientUnit(
                base_form=send_unit_base_name,
                fraction_form=send_unit_data[2],
                few_form=send_unit_data[3],
                many_form=send_unit_data[4])
            new_unit.save()
    # process ingredient types
    db_ingredient_types = IngredientType.objects.values_list(
            'id', 'name')
    db_ingredient_types_names = [i[1] for i in db_ingredient_types]
    new_ingredient_types_name_map = {}
    with transaction.atomic():
        for send_ingredient_type_data in new_data["ingredient_types"]:
            send_type_id = send_ingredient_type_data[0]
            send_type_name = send_ingredient_type_data[1]
            new_ingredient_types_name_map[send_type_name] = send_type_id
            # skip type name that already is in db
            if send_type_name in db_ingredient_types_names:
                continue
            # insert type to db
            new_type = IngredientType(name=send_type_name)
            new_type.save()
    # construct maping of id from uploaded data to id in data base
    with transaction.atomic():
        db_units = IngredientUnit.objects.values_list(
            'base_form', 'id')
        db_ingredient_types = IngredientType.objects.values_list(
            'name', 'id')
    new_units_id_map = {}
    for name, db_id in db_units:
        send_id = new_units_name_map.get(name, db_id)
        new_units_id_map[send_id] = db_id
    new_ingredient_types_id_map = {}
    for name, db_id in db_ingredient_types:
        send_id = new_ingredient_types_name_map.get(name, db_id)
        new_ingredient_types_id_map[send_id] = db_id
    # process ingredients
    db_ingredients = Ingredient.objects.values_list(
            'id', 'name')
    db_ingredient_names = [i[1] for i in db_ingredients]
    new_ingredients_name_map = {}
    with transaction.atomic():
        for send_ingredient_data in new_data["ingredients"]:
            send_ingredient_id = send_ingredient_data[0]
            send_ingredient_name = send_ingredient_data[1]
            new_ingredients_name_map[send_ingredient_name] = send_ingredient_id
            # skip ingredient that already is in db
            if send_ingredient_name in db_ingredient_names:
                continue
            # if ingredient_type was mapped use mapped id, orherwise use send id
            ingredient_type_id = new_ingredient_types_id_map[send_ingredient_data[2]]
            # if ingredient unit was mapped use mapped id, orherwise use send id
            ingredient_unit_id = new_units_id_map[send_ingredient_data[4]]
             # insert ingredient to db
            new_ingredient = Ingredient(
                name = send_ingredient_name,
                category_type_id = ingredient_type_id,
                default_quantity = send_ingredient_data[3],
                default_unit_id = ingredient_unit_id)
            new_ingredient.save()
    # process categories
    # TODO
    # construct maping of id from uploaded ingredients data to id in data base
    db_ingredients = Ingredient.objects.values_list(
        'name', 'id')
    new_ingredients_id_map = {}
    for name, db_id in db_ingredients:
        send_id = new_ingredients_name_map.get(name, db_id)
        new_ingredients_id_map[send_id] = db_id
    # process dishes
    db_dishes = Dish.objects.values_list(
            'id', 'name')
    db_dish_names = [i[1] for i in db_dishes]
    for send_dish_data in new_data["dishes"]:
        send_dish_name = send_dish_data[u'name']
        # skip dishes that are in db
        if send_dish_name in db_dish_names:
            continue
        photo = send_dish_data[u'photos'][0] if len(send_dish_data[u'photos']) else "" # TODO: remove
        # add dish to db
        new_dish = Dish(
            name=send_dish_name,
            type=send_dish_data[u'meal'],
            photo=photo,    # TODO: change to: send_dish_data[u'meal'],
            recipe=json.dumps(send_dish_data[u'recipe']),
            last_done_date=date(2017, 1, 1))
        new_dish.save()
        # add dsh ingredients to db
        order_index = 1
        with transaction.atomic():
            for send_dish_ingredient_data in send_dish_data[u'ingredients']:
                unit_id = new_units_id_map[send_dish_ingredient_data[0]]
                ingredient_id = new_ingredients_id_map[send_dish_ingredient_data[1]]
                dish_ingredient = DishIngredient(
                    dish=new_dish,
                    ingredient_id=ingredient_id,
                    quantity=send_dish_ingredient_data[2],
                    unit_id=unit_id,
                    sequential_number=chr(order_index))
                dish_ingredient.save()
                order_index += 1
        # TODO add dish categories to db
    result = {
        'result': 'ok',
    }
    return JsonResponse(result)
