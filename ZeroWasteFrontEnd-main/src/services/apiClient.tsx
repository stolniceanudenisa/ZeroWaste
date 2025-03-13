import axios from "axios";
import { User } from "../entities/User";
import { Recipe } from "../entities/Recipe";

const url = "http://192.168.101.17:8000/";
// const url = "http://localhost:8000/";
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post<{ access: string; refresh: string }>(
      `${url}login/`,
      {
        email,
        password,
      }
    );

    const { access, refresh } = response.data;
    sessionStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    return access;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const registerUser = async (
  email: string,
  password: string,
  confirm_password: string
) => {
  try {
    const response = await axios.post(`${url}register/`, {
      email,
      password,
      confirm_password,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const VerifyEmail = async (token: string, uid: number) => {
  try {
    const response = await axios.post(`${url}verify-email/`, {
      token,
      uid,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const RefreshAccessToken = async () => {
  try {
    const response = await axios.post<{ access: string }>(
      `${url}api/token/refresh/`,
      {
        refresh: localStorage.getItem("refreshToken"),
      }
    );
    const { access } = response.data;
    sessionStorage.setItem("accessToken", access);
    return access;
  } catch (error: any) {
    localStorage.removeItem("refreshToken");
    throw error.response.data;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get<User>(`${url}user/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${url}logout/`,
      {
        refresh: localStorage.getItem("refreshToken"),
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );

    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const UserdeleteAccount = async (password: string) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${url}delete-account/`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      data: {
        password,
      },
    });

    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const ChangePassword = async (
  old_password: string,
  new_password: string,
  confirm_password: string
) => {
  try {
    const response = await axios.post(
      `${url}change-password/`,
      {
        old_password,
        new_password,
        confirm_password,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error : any) {
    throw error.response.data;
  }
}

export const ForgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${url}forgot-password/`, {
      email,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const ResetPassword = async(
  password: string,
  confirm_password: string,
  token: string,
  uid: number
) => {
  try {
    const response = await axios.post(`${url}reset-password/`, {
      token,
      uid,
      password,
      confirm_password,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}


export const GetProductList = async () => {
  try {
    const response = await axios.get<{ share_code: string; products: any[] }>(
      `${url}user-product-list/`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    const { share_code, products } = response.data;
    sessionStorage.setItem("share_code", share_code);
    return { share_code, products };
  } catch (error) {
    console.error(error);
  }
};

export const DeleteProduct = async (product_id: number) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${url}user-product-list/`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      data: {
        id: product_id,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const AddProduct = async (
  name: string,
  best_before: string,
  opened: string,
  consumption_days: string
) => {
  try {
    const response = await axios.post(
      `${url}user-product-list/`,
      {
        name,
        best_before : best_before ? best_before : null,
        consumption_days: consumption_days ? consumption_days : null,
        opened: opened ? opened : null,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const UpdateProduct = async (
  id: number,
  name: string,
  best_before: string,
  opened: string,
  consumption_days: string
) => {
  try {
    const response = await axios.put(
      `${url}user-product-list/`,
      {
        id,
        name,
        best_before: best_before ? best_before : null,
        consumption_days: consumption_days ? consumption_days : null,
        opened: opened ? opened : null,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const JoinProductList = async (share_code: string) => {
  try {
    const response = await axios.post(
      `${url}change-list/`,
      {
        share_code,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const GetCollaborators = async () => {
  try {
    const response = await axios.get<{ email: string }[]>(
      `${url}collaborators/`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    sessionStorage.setItem("collaborators", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const UpdatePreferences = async (preferences : string[] ) => {
  try {
    const response = await axios.patch(
      `${url}user/update/preferences/`,
      {
        preferences
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const UpdateAllergies = async (allergies: string[]) => {
  try {
    const response = await axios.patch(
      `${url}user/update/allergies/`,
      {
        allergies
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const UpdateNotificationDay = async (notification_day: number) => {
  try {
    const response = await axios.patch(
      `${url}user/update/notification_day/${notification_day}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const UpdatePreferredNotificationHour = async (preferred_notification_hour: string) => {
  try {
    const response = await axios.patch(
      `${url}user/update/preferred_notification_hour/${preferred_notification_hour}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const UpdateDarkMode = async () => {
  try {
    const response = await axios.patch(
      `${url}user/update/dark_mode/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}


export const UploadReceipt = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      `${url}upload-receipt/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const GetRecipes = async (limit: number, offset: number) => {
  try {
    const response = await axios.get<{  count: number;
  next: string | null;
  previous: string | null;
  results: Recipe[];}>(`${url}recipes/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      params: {
        limit,
        offset,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export const RateRecipe = async (recipe_id: number, rating: boolean|null) => {
  try {
    const response = await axios.post(
      `${url}rate-recipe/`,
      {
        recipe_id,
        rating,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

interface RecipeFilter {
  time: number | null;
  difficulty: number[] | null;
  recipe_type: string | null;
  favourites: boolean | null;
}

export const FilterRecipes = async (filter: RecipeFilter, limit: number, offset: number) => {
  try {
    const response = await axios.get<{  count: number;
  next: string | null;
  previous: string | null;
  results: Recipe[];}>(`${url}filter-recipes/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      params: {
        filter,
        limit,
        offset,
      },
  });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const SearchRecipes = async (search: string, limit: number, offset: number) => {
  try {
    const response = await axios.get<{  count: number;
  next: string | null;
  previous: string | null;
  results: Recipe[];}>(`${url}search-recipes/`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      params: {
        search,
        limit,
        offset,
      },
  });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const RefreshRecipes = async () => {
  try {
    const response = await axios.get(
      `${url}refresh-recipes/`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}