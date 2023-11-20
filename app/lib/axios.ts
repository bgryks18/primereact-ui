import ax, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

const API = ax.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=7200',
  },
  withCredentials: true,
})

const requestBefore = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  return config
}

const requestAfter = (response: AxiosResponse): AxiosResponse => {
  return response
}

API.interceptors.request.use(requestBefore, (error: any) => {
  return Promise.reject(error)
})

API.interceptors.response.use(requestAfter, (error) => {
  let errorObj = { message: '' }
  if (error instanceof AxiosError) {
    const data = error.response?.data
    if (data?.error) {
      {
        errorObj.message = data?.error
      }
    } else {
      errorObj.message = 'An Error Occured'
    }
  }
  return Promise.reject(errorObj)
})

export default API
