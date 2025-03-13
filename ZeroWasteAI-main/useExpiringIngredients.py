import pandas as pd

# Citirea fișierului Excel
file_path = 'Files/recipes.xlsx'
sheet_name = 'AI'

# Lista de produse care expiră ---- PRIMUL INGREDIENT E CEL CARE EXPIRA CEL MAI REPEDE
expiring_products = ['mozzarella', 'milk']

# Citirea tabelului din foaia specificată
recipes_df = pd.read_excel(file_path, sheet_name=sheet_name)

# Normalizarea listei de produse care expiră la litere mici
expiring_products = [product.lower() for product in expiring_products]

# Funcție pentru a calcula numărul de potriviri între ingrediente și expiring_products,
# excluzând cazurile cu "mini mozzarella"
def count_matches_excluding(ingredients, expiring_products):
    ingredients_lower = ingredients.lower()
    count = 0
    for product in expiring_products:
        if product in ingredients_lower and f'mini {product}' not in ingredients_lower:
            count += 1
    return count

# Funcție pentru a returna poziția ingredientului de prioritate cea mai mare,
# excluzând cazurile cu "mini mozzarella"
def highest_priority_match_excluding(ingredients, expiring_products):
    ingredients_lower = ingredients.lower()
    for idx, product in enumerate(expiring_products):
        if product in ingredients_lower and f'mini {product}' not in ingredients_lower:
            return idx  # Returnăm poziția primului ingredient găsit
    return len(expiring_products)  # Dacă nu se găsește niciunul, returnăm o valoare mare

# Calcularea numărului de potriviri și a priorității maxime pentru fiecare rețetă
recipes_df['Match Count'] = recipes_df['Ingredients'].apply(
    lambda x: count_matches_excluding(str(x), expiring_products)
)
recipes_df['Priority'] = recipes_df['Ingredients'].apply(
    lambda x: highest_priority_match_excluding(str(x), expiring_products)
)

# Filtrarea și sortarea rețetelor
filtered_recipes = recipes_df[recipes_df['Match Count'] > 0]
sorted_recipes = filtered_recipes.sort_values(by=['Match Count', 'Priority'], ascending=[False, True])

# Afișarea rețetelor sortate
if not sorted_recipes.empty:
    print("Rețete care conțin ingredientele din expiring_products (excluzând combinația cu 'mini'), sortate după relevanță:")
    print(sorted_recipes[['Name', 'Ingredients', 'Match Count']])
else:
    print("Nu s-au găsit rețete care să conțină ingredientele specificate.")
