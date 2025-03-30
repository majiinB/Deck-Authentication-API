/**
 * An interface for the user.
 */
export interface User {
    user_id: string,
    email: string,
    name: string,
    role: string,
    cover_photo?: string,
    fcm_token: string,
}
