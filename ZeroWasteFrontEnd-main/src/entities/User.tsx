export interface User {
    email : string;
    preferred_notification_hour : string;
    preferences: string[];
    allergies: string[];
    notification_day: number;
    dark_mode: boolean;
}