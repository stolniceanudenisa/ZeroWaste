export interface Recipe {
    id: number;
    name: string;
    link: string;
    image: string;
    difficulty: number;
    time: number;
    recipe_type: string;
    rating: boolean|null;
}