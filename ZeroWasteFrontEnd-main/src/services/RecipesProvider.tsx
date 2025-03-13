import React, { createContext, useContext, useEffect, useState } from 'react';
import { Recipe } from '../entities/Recipe';
import { GetRecipes, RateRecipe, FilterRecipes, SearchRecipes, RefreshRecipes } from './apiClient';
import { useAuth } from './authProvider';
import { useWebSocket } from './WebSocketProvider';
import { get } from 'axios';
import { refresh } from 'ionicons/icons';

interface RecipesContextValue {
    recipes: Recipe[];
    getRecipes: () => Promise<void>;
    rateRecipe: (recipeId: number, rating: boolean | null) => Promise<void>;
    filterRecipes: (time: number | null, difficulty: number[] | null, recipe_type: string | null, favourites: boolean | null,) => Promise<void>;
    searchRecipes: (searchText: string) => Promise<void>;
    refreshRecipes: () => Promise<void>;
    loadMoreRecipes: () => Promise<void>;
    loadMoreFilteredRecipes: (time: number | null, difficulty: number[] | null, recipe_type: string | null, favourites: boolean | null, isInitialLoad: boolean) => Promise<void>;
    loadMoreSearchRecipes: (searchText: string, isInitialLoad: boolean) => Promise<void>;
    resetRecipes: () => Promise<void>;
    hasMore: boolean;
    isLoading: boolean;
}

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined);

export const RecipesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [limit] = useState<number>(10);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { accessToken, refreshAccessToken } = useAuth();
    const { recipeMessages, isConnected } = useWebSocket();

    useEffect(() => {
        if (accessToken && isConnected) {
            console.log("Getting recipes");
            resetRecipes();
        }
    }, [accessToken, recipeMessages, isConnected]);


    const resetRecipes = async () => {
        setRecipes([]);
        setOffset(0);
        setHasMore(true);
        await getRecipes(true);
    };

    const getRecipes = async (isInitialLoad = false) => {
        if (isLoading || (!hasMore && !isInitialLoad)) return;
        setIsLoading(true);
        const response = await GetRecipes(limit, isInitialLoad ? 0 : offset);
        if (response) {
            setRecipes((prev) => (isInitialLoad ? response.results : [...prev, ...response.results]));
            setOffset((prev) => prev + limit);
            setHasMore(!!response.next); 
        } else {
            if (localStorage.getItem("refreshToken")) {
                refreshAccessToken();
            }
        }
        setIsLoading(false);
    };

    const rateRecipe = async (recipeId: number, rating: boolean | null) => {
        RateRecipe(recipeId, rating).then((response) => {
            if (response) {
                setRecipes((prev) => prev.map((recipe) => {
                    if (recipe.id === recipeId) {
                        return { ...recipe, rating };
                    }
                    return recipe;
                }));
            }
        });

    };

const filterRecipes = async (
    time: number | null,
    difficulty: number[] | null,
    recipe_type: string | null,
    favourites: boolean | null,
    isInitialLoad = false
) => {
    if (isLoading || (!hasMore && !isInitialLoad)) return;

    setIsLoading(true);
    if (isInitialLoad) {
        setOffset(0);
    }
    try{
        const response = await FilterRecipes({ time, difficulty, recipe_type, favourites }, limit, isInitialLoad ? 0 : offset);
        if (response) {
            setRecipes((prev) => (isInitialLoad ? response.results : [...prev, ...response.results]));
            setOffset((prev) => prev + limit);
            setHasMore(!!response.next);
        } else {
            if (localStorage.getItem("refreshToken")) {
                refreshAccessToken();
            }
            }
    } catch (error) {
        throw error;
    }
    setIsLoading(false);
    };
    
    const searchRecipes = async (searchText: string, isInitialLoad = false) => {
        if (isLoading || (!hasMore && !isInitialLoad)) return;
        setIsLoading(true);
        if (isInitialLoad) {
            setOffset(0);
        }
        try {
            const response = await SearchRecipes(searchText, limit, isInitialLoad ? 0 : offset);
            if (response) {
                setRecipes((prev) =>isInitialLoad? response.results: [...prev, ...response.results]);
                setOffset((prev) => prev + limit);
                setHasMore(!!response.next);
            } else {
                if (localStorage.getItem("refreshToken")) {
                    refreshAccessToken();
                }
            }
        } catch (error) {
            throw error;
        }
        setIsLoading(false);
    };

    const refreshRecipes = async () => {
        await RefreshRecipes();
    }


    const loadMoreFilteredRecipes = async (
        time: number | null,
        difficulty: number[] | null,
        recipe_type: string | null,
        favourites: boolean | null,
        isInitialLoad : boolean = false
    ) => {
        await filterRecipes(time, difficulty, recipe_type, favourites, isInitialLoad);
    };

    const loadMoreSearchRecipes = async (searchText: string, isInitialLoad: boolean = false) => {
        await searchRecipes(searchText,isInitialLoad);
    };

    const loadMoreRecipes = async () => {
        await getRecipes();
    };

    return (
        <RecipesContext.Provider value={{ recipes, getRecipes, rateRecipe, filterRecipes, searchRecipes, refreshRecipes, loadMoreFilteredRecipes, loadMoreSearchRecipes, loadMoreRecipes, hasMore, isLoading, resetRecipes }}>
            {children}
        </RecipesContext.Provider>
    );
};

export const useRecipes = () => {
    const context = useContext(RecipesContext);
    if (!context) {
        throw new Error('useRecipes must be used within a RecipesProvider');
    }
    return context;
};
