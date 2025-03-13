import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../entities/Product';
import { GetProductList, DeleteProduct, UpdateProduct, AddProduct, JoinProductList, UploadReceipt } from './apiClient';
import { useAuth } from './authProvider';
import { useWebSocket } from './WebSocketProvider';
import { get } from 'axios';

interface ProductListContextValue {
    products: Product[];
    filteredProducts: Product[];    
    getProductList: () => Promise<void>;
    deleteProduct: (product_id: number) => Promise<void>;
    updateProduct: (id: number,productName:string, expirationDate:string, openingDate:string, recommendedDays:string ) => Promise<void>;
    addProduct: (productName: string, expirationDate: string, openingDate: string, recommendedDays: string) => Promise<void>;
    searchProduct: (searchText: string) => Promise<void>;
    uploadReceipt: (file: File) => Promise<any>;
    joinProductList: (productId: string) => Promise<void>;
    loading: boolean;
}

const ProductListContext = createContext<ProductListContextValue | undefined>(undefined);

export const ProductListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const { refreshAccessToken, accessToken, setShareCode } = useAuth();
    const { productMessages, isConnected } = useWebSocket();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleMessages = (message: any) => {
        if (message.type === 'add_product') {
            setProducts((prev) => [message.data, ...prev]);
            setFilteredProducts((prev) => [message.data, ...prev]);
        }
        if (message.type === 'delete_product') {
            setProducts((prev) => prev.filter((product) => product.id !== message.data));
            setFilteredProducts((prev) => prev.filter((product) => product.id !== message.data));
        }
        if (message.type === 'update_product') {
            setProducts((prev) => prev.map((product) => product.id === message.data.id ? message.data : product));
            setFilteredProducts((prev) => prev.map((product) => product.id === message.data.id ? message.data : product));
        }
        if (message.type === 'add_products') {
            getProductList();    
            setLoading(false);
        }
    }

    useEffect(() => {
        if (accessToken) {
            getProductList();
        }
    }, [accessToken]);

    useEffect(() => {
        if (productMessages.length > 0 && accessToken) {
            const lastMessage = productMessages[productMessages.length - 1]; 
            handleMessages(lastMessage); 
        }
    }, [productMessages]);


    const getProductList = async () => {
        const response = await GetProductList();
        if (response) {
            setProducts(response.products);
            setFilteredProducts(response.products);
            setShareCode(response.share_code);
        }
        else {
        if(localStorage.getItem("refreshToken")){
          refreshAccessToken();}
        }
    };

    const deleteProduct = async (product_id: number) => {
        await DeleteProduct(product_id);
    };

    const updateProduct = async (id: number,productName:string, expirationDate:string, openingDate:string, recommendedDays:string ) => {
        await UpdateProduct(id, productName, expirationDate, openingDate, recommendedDays);
    };

    const addProduct = async (productName:string, expirationDate:string, openingDate:string, recommendedDays:string) => {
        await AddProduct(productName, expirationDate, openingDate, recommendedDays);
    };

    const searchProduct = async (searchText: string) => {
        if (searchText.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) => {
                return product.name.toLowerCase().includes(searchText.toLowerCase());
            });
            setFilteredProducts(filtered);
        }
    };

    const uploadReceipt = async (file: File) => {
        setLoading(true);
        UploadReceipt(file).then((response) => {
            if (response) {
                return response;
            }
        }).catch((error) => {
            setLoading(false);
            return error;
        }); 
    }

      const joinProductList = async (productId: string) => {
    try {
        await JoinProductList(productId);
        await getProductList();
    } catch (error) {
      console.error('Join product list failed:', error);
    }
    };


    return (
        <ProductListContext.Provider value={{ products, filteredProducts, getProductList, deleteProduct, updateProduct, addProduct, searchProduct, loading, uploadReceipt, joinProductList }}>
            {children}
        </ProductListContext.Provider>
    );
};

export const useProductList = () => {
    const context = useContext(ProductListContext);
    if (!context) {
        throw new Error('useProductList must be used within a ProductListProvider');
    }
    return context;
};
