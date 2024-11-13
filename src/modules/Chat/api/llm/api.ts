import axios from 'axios'


import e from '../../../../utils/env'

const env = e.hostEnv

export const baseUrl = `https://${env}dalaran-ai.alibaba-inc.com`;
// export const baseUrl = `http://127.0.0.1:7002`;

axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl;
axios.interceptors.response.use(
  function (response) {
    const { data } = response;
    if (data.success === false) {
      // throw new Error('接口调用失败', data);
      return Promise.reject(data);
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);


export async function getUserInfo() {
    try {
      const res = await axios.get('/api/v1/aiCode/getUserInfo');
      return res?.data;
    } catch (error) {
      console.error('getUserInfo', error);
    }
  }


  export async function getAclInfo() {
    try {
      const res = await axios.get('/api/v1/aiCode/getAclInfo');
      console.log('getAclInfo', res?.data);
      return res?.data;
    } catch (error) {
      console.error('getAclInfo', error);
    }
  }
