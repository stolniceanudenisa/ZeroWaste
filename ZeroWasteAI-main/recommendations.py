import re
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer

def preprocess_ingredients(text):
    return re.sub(r'\b\d+\b', '', text)  # elimina numerele

file_path = 'Files/recipes.xlsx'
retete_df = pd.read_excel(file_path)

# preprocesare ingrediente
retete_df['Processed_Ingredients'] = retete_df['Ingredients'].apply(preprocess_ingredients)
retete_df['Ingredients_List'] = retete_df['Processed_Ingredients'].apply(lambda x: [item.strip().lower() for item in x.split(',')])

# vectorizare pe lista de ingrediente
mlb = MultiLabelBinarizer()
ingredient_matrix = mlb.fit_transform(retete_df['Ingredients_List'])

# vectorizare pe cuvintele individuale din ingrediente
vectorizer = CountVectorizer()
word_matrix = vectorizer.fit_transform(retete_df['Processed_Ingredients'])

# combinam cei 2 vectori
combined_matrix = np.hstack([ingredient_matrix, word_matrix.toarray()])

# Exemplu: Lista de ID-uri ale rețetelor plăcute de utilizator
user_liked_recipe_ids = [19, 29, 30, 32, 34, 40, 49, 81, 82, 84, 85, 87, 88, 96, 99, 103, 107, 129, 130, 131, 137, 141, 147, 148, 150, 152, 156, 158, 159, 160, 163, 167, 169, 172, 174, 175, 178, 182, 183, 185, 190, 207, 378, 391, 403, 405, 407, 415, 417, 424, 427, 428, 432, 434, 445, 446, 447, 465, 473, 474, 475, 476, 477, 478, 479, 480, 483, 485, 486, 487, 489, 490, 491, 492, 493, 494, 495, 496, 498, 499, 501, 502, 503, 507, 511, 513, 516, 519, 521, 522, 523, 524, 525, 526, 529, 530, 531, 533, 534, 536, 537, 539, 540, 542, 544, 545, 546, 548, 549, 550, 551, 552, 555, 556, 559, 560, 567, 570, 574, 575, 576, 577, 580, 581, 582, 583, 584, 587, 589, 590, 592, 593, 594, 595, 596, 597, 599, 601, 604, 605, 606, 607, 608, 609, 613, 615, 619, 620, 621, 622, 623, 625, 627, 628, 630, 631, 633, 634, 635, 637, 639, 640, 641, 642, 643, 644, 646, 647, 650, 651, 652, 653, 656, 657, 658, 659, 661, 662, 663, 665, 671, 672, 675, 676, 677, 678, 679, 680, 682, 686, 689, 690, 691, 692, 693, 694, 695, 697, 699, 700, 701, 702, 705, 707, 711, 713, 715, 716, 718, 719, 720, 721, 722, 723, 727, 728, 730, 731, 733, 740, 742, 743, 745, 749, 750, 751, 752, 756, 757, 758, 760, 764, 766, 767, 768, 769, 770, 771, 774, 776, 779, 780, 782, 783, 786, 788, 789, 791, 793, 794, 795, 798, 799, 800, 801, 802, 803, 806, 807, 811, 812, 816, 817, 818, 823, 824, 828, 829, 830, 832, 835, 840, 841, 843, 844, 845, 846, 847, 848, 851, 852, 853, 854, 855, 856, 857, 858, 861, 865, 868, 869, 870, 8, 12, 13, 21, 25, 30, 31, 32, 33, 34, 49, 52, 60, 63, 75, 81, 84, 88, 89, 90, 92, 94, 95, 96, 97, 99, 101, 107, 108, 112, 113, 127, 130, 132, 133, 134, 135, 138, 139, 140, 142, 146, 149, 156, 168, 169, 173, 182, 183, 185, 186, 193, 194, 207, 378, 387, 389, 391, 395, 401, 403, 408, 412, 418, 421, 423, 425, 426, 427, 428, 434, 435, 449, 451, 462, 463, 464, 466, 472, 475, 476, 477, 478, 479, 480, 481, 482, 483, 485, 486, 488, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 502, 503, 507, 508, 509, 511, 514, 515, 516, 517, 521, 522, 523, 524, 525, 526, 528, 529, 530, 531, 533, 534, 535, 536, 538, 539, 540, 541, 544, 545, 546, 548, 549, 550, 551, 552, 555, 556, 557, 558, 559, 560, 563, 564, 566, 568, 570, 572, 573, 574, 576, 577, 578, 581, 583, 584, 585, 587, 588, 589, 590, 592, 593, 594, 595, 597, 598, 602, 603, 604, 605, 606, 608, 609, 611, 613, 614, 618, 619, 620, 621, 622, 624, 625, 626, 627, 628, 630, 631, 632, 633, 634, 635, 636, 639, 640, 641, 642, 645, 647, 649, 651, 652, 653, 655, 656, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 679, 680, 683, 685, 687, 689, 693, 694, 696, 697, 698, 699, 700, 701, 702, 703, 706, 707, 708, 711, 712, 715, 717, 718, 719, 723, 728, 729, 735, 741, 743, 744, 749, 750, 752, 753, 755, 756, 758, 759, 762, 767, 769, 771, 773, 774, 776, 777, 779, 780, 782, 783, 788, 789, 792, 793, 795, 796, 797, 798, 800, 801, 802, 803, 804, 806, 807, 808, 809, 812, 815, 816, 817, 818, 819, 821, 822, 823, 824, 825, 826, 827, 829, 831, 833, 834, 836, 837, 838, 840, 842, 844, 845, 848, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 863, 865, 868, 869, 870]  # Înlocuiește cu ID-urile reale

if(len(user_liked_recipe_ids)==0):
    ...
    # returnam toate retelele
else:
    # filtram retetele care au placut utilizatorului
    liked_recipes = retete_df[retete_df['id'].isin(user_liked_recipe_ids)]
    liked_indices = liked_recipes.index.tolist()

    #calculam similaritatea cosinus
    similarities = cosine_similarity(combined_matrix[liked_indices], combined_matrix)

    # scorul mediu
    average_similarity = similarities.mean(axis=0)
    retete_df['similarity'] = average_similarity

    # Excludem retetele deja placute si le sortam pe cele ramase
    unliked_recipes = retete_df[~retete_df['id'].isin(user_liked_recipe_ids)]
    recommended_recipes = unliked_recipes.sort_values(by='similarity', ascending=False).head(5)

    # Afișăm recomandările
    print("Rețete recomandate pentru utilizator, bazate pe rețetele plăcute:\n")
    print(recommended_recipes[['id', 'Name', 'Ingredients', 'similarity']])

    # # Afișăm caracteristicile extrase
    # word_features = vectorizer.get_feature_names_out()
    # print("Caracteristici din cuvinte individuale:")
    # print(word_features)
    #
    # ingredient_features = mlb.classes_
    # print("Caracteristici din ingrediente de sine stătătoare:")
    # print(ingredient_features)
