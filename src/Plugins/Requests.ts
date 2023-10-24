import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const BaseUrl: string = "https://vps4you.hu/api.php";

async function Post(data?: any | undefined, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<any, any>> {
    return axios.post(BaseUrl, 
    { 
        ...data,
        json: 1
    },
    { 
        ...config,
        headers: { ...config?.headers, "Content-Type": 'application/x-www-form-urlencoded' }
    });
}

async function Get(config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<any, any>> {
    return axios.get(BaseUrl, 
    { 
        ...config,
        params: { json: 1, ...config?.params },
        headers: { ...config?.headers, "Content-Type": 'application/x-www-form-urlencoded' }
    });
}

export default { Get, Post }