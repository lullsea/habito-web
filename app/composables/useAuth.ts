import { ref } from "vue";

const user = ref(null);
export const useAuth = () => {
    const { $axios } = useNuxtApp();
    const error = ref<string | null>(null);
    const loading = ref(false);

    // Get current authenticated user
    const fetchUser = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await $axios.get("/api/user");
            user.value = data;
        } catch (err: any) {
            user.value = null;
            error.value = err.response?.data?.message || "Failed to fetch user";
        } finally {
            loading.value = false;
        }
    };

    // Login function
    const login = async (credentials: { email: string; password: string }) => {
        loading.value = true;
        error.value = null;
        try {
            // Get CSRF cookie first
            await $axios.post("/login", credentials);
            await fetchUser();
        } catch (err: any) {
            error.value = err.response?.data?.message || "Login failed";
        } finally {
            loading.value = false;
        }
    };

    // Register function
    const register = async (credentials: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }) => {
        loading.value = true;
        error.value = null;
        try {
            await $axios.post("/register", credentials);
            await fetchUser();
        } catch (err: any) {
            error.value = err.response?.data?.message || "Registration failed";
        } finally {
            loading.value = false;
        }
    };

    // Logout function
    const logout = async () => {
        loading.value = true;
        error.value = null;
        try {
            await $axios.post("/logout", {});
            user.value = null;
        } catch (err: any) {
            error.value = err.response?.data?.message || "Logout failed";
        } finally {
            loading.value = false;
        }
    };

    return {
        user,
        error,
        loading,
        fetchUser,
        login,
        register,
        logout,
    };
};
export default useAuth;
