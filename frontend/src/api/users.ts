import { type PublicUser } from "../types/user";
import { apiClient } from "./apiClient";

export function getCurrentUser() {
    return apiClient<PublicUser>('/users/me');
}