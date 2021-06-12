import axios from "axios";

import Main from "./main.mjs";

const API_BASE = appEnv.API_BASE;

const axiosInstance = axios.create({
    baseURL: API_BASE
});

export default {
    baseUrl: API_BASE,
    main: Main(axiosInstance)
};
