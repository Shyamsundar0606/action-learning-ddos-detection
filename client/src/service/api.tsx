'use client';

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 20000,
});

instance.interceptors.request.use(
  function(config: InternalAxiosRequestConfig) {
    const authenticationkey = localStorage.getItem("authentication");

    if (authenticationkey) {
      config.headers["Authentication"] = authenticationkey;
    }
    return config;
  },
  function(error: AxiosError) {
    return Promise.reject(error);
  }
);

instance.defaults.headers.common.Accept = 'application/json';

export default instance;