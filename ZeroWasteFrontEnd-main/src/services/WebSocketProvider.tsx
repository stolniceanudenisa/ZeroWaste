import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authProvider';

// const url = "ws://localhost:8000/"
const url = "ws://192.168.101.17:8000/";

interface MessageData {
  type: string;
  payload: any;
}

interface WebSocketContextValue {
    sendMessage: (message: any) => void;
    messages: MessageData[];
    productMessages: MessageData[];
    recipeMessages: MessageData[];
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, accessToken, user, share_code } = useAuth();
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [productMessages, setProductMessages] = useState<MessageData[]>([]);
    const [recipeMessages, setRecipeMessages] = useState<MessageData[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user && share_code) {
            console.log("Connecting to WebSocket");
            const token = accessToken;
            if (!token) return;

            const wsUrl = `${url}ws/notifications/`;
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                socket.send(JSON.stringify({ type: 'authorization', payload: { token, share_code, email: user?.email} }));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('WebSocket message:', data);

                if (data.type === "authorization") {
                    if (data.payload.status === "success") {
                        setIsConnected(true);
                    }
                }
                if (data.type === "recipe") {
                    setRecipeMessages((prev) => [...prev, data.payload]);
                }
                else if (data.type === "productmessage") {
                    setProductMessages((prev) => [...prev, data.payload]);
                }
                else {
                    setMessages((prev) => [...prev, data]);
                }
            };

            socket.onclose = () => {
                setIsConnected(false);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            setWs(socket);

            return () => {
                socket.close();
            };
        };
        if (!isAuthenticated && ws) {
            ws.close();
            setWs(null);
        }
    }, [isAuthenticated, share_code, user?.email]);

    const sendMessage = (message: any) => {
        if (ws && isConnected) {
        ws.send(JSON.stringify(message));
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage, messages, isConnected, productMessages, recipeMessages }}>
        {children}
        </WebSocketContext.Provider>
    );
    };

    export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
