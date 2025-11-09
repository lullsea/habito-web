import axios from "axios";
import useAuth from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig();
    const {fetchUser} = useAuth();
    // Configure Axios globally
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    axios.defaults.baseURL = config.public.baseUrl;

    // Check if CSRF cookie already exists
    const hasCsrfCookie = useCookie("XSRF-TOKEN").value;

    if (!hasCsrfCookie) {
        // Call only once at startup if missing
        await getCsrf();
        console.log("CSRF cookie initialized");
    }    // Optionally expose axios globally
    nuxtApp.provide("axios", axios);
});
