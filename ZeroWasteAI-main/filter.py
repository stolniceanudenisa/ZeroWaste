import pandas as pd

# Citirea datelor
file_path = 'Files/recipesAllergensPreferences.xlsx'
df = pd.read_excel(file_path, sheet_name='AI')

# TIMPI DE GATIRE
# 1 - pentru retete cu timp de gatire maxim 30 min (inclusiv)
# 2 - max 60 min
# 3 - max 120 min
# 4 - max 180 min

# Input Utilizator
user_allergies = ['Eggs']
user_preferences = ['Gluten-Free']
user_type = ['Dessert', 'Mains']
user_difficulty = [1, 2]  # Dificultăți dorite (1 = ușor, 2 = mediu)
user_time = 4

allergen_columns = [col for col in df.columns if col in ['Celery', 'Cereals', 'Crustaceans', 'Eggs', 'Fish', 'Lupin', 'Milk', 'Molluscs', 'Mustard', 'Peanuts', 'Sesame', 'Soybeans', 'Sulphur']]
preference_columns = [col for col in df.columns if col in ['Dairy-Free', 'Gluten-Free', 'Vegan', 'Vegetarian']]
valid_allergies = [allergen for allergen in user_allergies if allergen in allergen_columns]
valid_preferences = [preference for preference in user_preferences if preference in preference_columns]

filtered_recipes = df.copy()

# Filtrare pe baza alergenilor
if valid_allergies:
    for allergen in valid_allergies:
        filtered_recipes = filtered_recipes[filtered_recipes[allergen] == 0]

# Filtrare pe baza preferințelor
if valid_preferences:
    preference_mask = filtered_recipes[valid_preferences].any(axis=1)
    filtered_recipes = filtered_recipes[preference_mask]

# Filtrare pe baza tipului
if user_type:
    filtered_recipes = filtered_recipes[filtered_recipes['Type'].isin(user_type)]

# Filtrare pe baza dificultății
if user_difficulty:
    filtered_recipes = filtered_recipes[filtered_recipes['Difficulty'].isin(user_difficulty)]

if user_time is not None:
    time_limits = {1: 30, 2: 60, 3: 120, 4: 180}
    if user_time in time_limits:
        max_time = time_limits[user_time]
        filtered_recipes = filtered_recipes[filtered_recipes['Total time'] <= max_time]


print("Rețete recomandate:")
print(filtered_recipes[['Id', 'Ingredients', 'Type', 'Difficulty']])
