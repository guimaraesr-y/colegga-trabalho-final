/* istanbul ignore file */

export interface MockUserDataInterface {
    email?: string;
    password?: string;
    name?: string;
}

/**
 * Creates a mock user object with the given email, password, and name.
 * If any of the parameters are not provided, it will use default values.
 */
export const mockUserData = (data?: MockUserDataInterface) => ({
    id: "123",
    name: data?.name || "Test User",
    email: data?.email || "test@example.com",
    password: data?.password || "hashedpassword",
    createdAt: new Date(),
    updatedAt: new Date(),
});