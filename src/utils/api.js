import { create } from 'axios'
import {
  getToken,
  removeToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  removeUserEmail,
  removeUserRole,
} from './token'
import { toast } from 'react-toastify'
// const API = create({ baseURL: 'https://yokogawa-flow-center.herokuapp.com/' })
const API = create({ baseURL: 'http://217.160.49.198:8081/' })

let refreshFlag = 0

API.interceptors.request.use(
  config => {
    const token = getToken()

    if (token) {
      // API.defaults.headers.common.Authorization =
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

API.interceptors.response.use(null, async e => {
  if (e.response.status === 401 && e.config.url !== '/auth/login' && refreshFlag === 0) {
    try {
      console.log('Inside TRY')
      refreshFlag = 1
      const rs = await API.post('/auth/token/refresh/', {
        refresh: getRefreshToken(),
      })
      const { access, refresh } = rs.data
      toast.success('Refreshing Website')
      setToken(access)
      setRefreshToken(refresh)
      // window.location.reload()
    } catch (error) {
      toast.error('Session Expired, Login Again')
      console.log('Inside CATCH')
      removeToken()
      removeUserEmail()
      removeUserRole()
      window.location.href = '/auth/login'
    }
  }

  if (Array.isArray(e.response.data?.message) && e.response.status !== 401) {
    toast.error(e.response.data?.message[0])
  } else if (e.response.data?.message && e.response.data?.message[0] && e.response.status !== 401) {
    toast.error(e.response.data?.message)
  }
  toast.error(e.response.data?.email[0])
  toast.error(e.response.data?.new_password2[0])
  toast.error(e.response.data?.new_password2[1])

  if (e.response.status == 400) {
    e.response.data.message?.forEach(message => {
      toast.error(message)
    })
    e.response.data.email?.forEach(email => {
      toast.error(email)
    })
    e.response.data.password1?.forEach(password1 => {
      toast.error(password1)
    })
    e.response.data.password2?.forEach(password2 => {
      toast.error(password2)
    })
  }
  return e
})

// let isRefreshing = false;
// let failedRequestsQueue = [];

// API.interceptors.response.use(null, async (error) => {
//   if (error.response.status === 401 && error.config.url !== '/auth/login') {
//     if (!isRefreshing) {
//       isRefreshing = true;
//       try {
//         const rs = await API.post('/auth/token/refresh/', {
//           refresh: getRefreshToken(),
//         });
//         const { access, refresh } = rs.data;
//         setToken(access);
//         setRefreshToken(refresh);
//         // Retry failed requests
//         failedRequestsQueue.forEach((request) => {
//           request.headers['Authorization'] = 'Bearer ' + access;
//           API(request)
//             .then((response) => request.resolve(response))
//             .catch((err) => request.reject(err));
//         });
//         failedRequestsQueue = [];
//       } catch (refreshError) {
//         // Handle refresh token error
//         toast.error('Session Expired, Login Again');
//         removeToken();
//         removeUserEmail();
//         removeUserRole();
//         window.location.href = '/auth/login';
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     // Create new promise to wait for token refresh
//     const retryOriginalRequest = new Promise((resolve, reject) => {
//       // Add original request to the queue
//       failedRequestsQueue.push({ resolve, reject, ...error.config });
//     });
//     return retryOriginalRequest;
//   }

//   // Handle other error cases
//   if (Array.isArray(error.response.data?.message) && error.response.status !== 401) {
//     toast.error(error.response.data?.message[0]);
//   } else if (error.response.data?.message && error.response.data?.message[0] && error.response.status !== 401) {
//     toast.error(error.response.data?.message);
//   }
//   toast.error(error.response.data?.email[0]);
//   toast.error(error.response.data?.new_password2[0]);
//   toast.error(error.response.data?.new_password2[1]);

//   if (error.response.status == 400) {
//     error.response.data.message?.forEach((message) => {
//       toast.error(message);
//     });
//     error.response.data.email?.forEach((email) => {
//       toast.error(email);
//     });
//     error.response.data.password1?.forEach((password1) => {
//       toast.error(password1);
//     });
//     error.response.data.password2?.forEach((password2) => {
//       toast.error(password2);
//     });
//   }

//   return Promise.reject(error);
// });

export default API
