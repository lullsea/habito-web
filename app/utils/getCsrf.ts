import axios from "axios";


export default async function getCsrf() {
    const config = useRuntimeConfig();
    const resp = await axios.get(`${config.public.baseUrl}/sanctum/csrf-cookie`, {
        headers: {
            // Origin: "http://localhost:3000", // Ensure this matches your frontend URL
            Accept: "application/json",
        },
        withCredentials: true, // This ensures that cookies are included with the request
    });
    return resp.status;
}
