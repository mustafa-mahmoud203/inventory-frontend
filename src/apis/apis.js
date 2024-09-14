import { Axios, AxiosForm } from "../helpers/axiosInstance.js";

// const yourAuthToken = "jjjj"
const yourAuthToken = localStorage.getItem("token");
// User APIs
export const userLoginApi = (data) => {
  const res = Axios.post("/users/login", JSON.stringify(data));
  return res;
};
export const updateUserDataApi = async (data, id, headers) => {
  const res = await Axios.put(`/users/${id}`, JSON.stringify(data), {
    headers,
  });
  return res;
};
export const userSignupApi = (data) => {
  const res = Axios.post("/users/", data);
  return res;
};

export const getUserApi = async (id, headers) => {
  const res = await Axios.get(`/users/${id}`, {
    headers,
  });
  return res;
};

// Book APIs
export const getProductApi = (id, headers) => {
  const res = Axios.get(`/products/${id}`, {
    headers,
  });
  return res;
};

export const getProductsApi = (headers) => {
  const res = Axios.get(`/products`, {
    headers,
  });
  return res;
};

export const getRecommendationBooksApi = (id, headers) => {
  const res = Axios.get(`/products/recommendation/${id}`, {
    headers,
  });
  return res;
};
export const addProductApi = (data, headers) => {
  const res = AxiosForm.post(`/products/`, data, {
    headers,
  });
  return res;
};


export const getHistoricatStockApi = (headers) => {
  const res = AxiosForm.get(`/historicals/`, {
    headers,
  });
  return res;
};



export const editProductApi = (id, data ) => {
  const res = Axios.put(`/products/${id}`, data );
  return res;
};


export const deleteProductApi = (id, headers) => {
  const res = Axios.delete(`/products/${id}`, {
    headers,
  });
  return res;
};

export const getOrdersApi = (headers) => {
  const res = Axios.get(`/orders/`, {
    headers,
  });
  return res;
};

export const getOrdersUserApi = (id, headers) => {
  const res = Axios.get(`/orders/users/${id}`, {
    headers,
  });
  return res;
};

export const getTrends = (headers) => {
  const res = Axios.get(`/orders/trends/`, {
    headers,
  });
  return res;
};

export const addOrderApi = (data, headers) => {
  const res = Axios.post(`/orders/`, data, {
    headers,
  });
  return res;
};

export const deleteOrderApi = (data, headers) => {
  const res = Axios.delete(`/order`, {
    headers,
    data: data,
  });
  return res;
};

// // Order APIs
// export const addOrderApi = (data, headers) => {
//   const res = Axios.post(`/orders/`, data, {
//     headers,
//   });
//   return res;
// };

export const getAllOrdersApi = (data, headers) => {
  const res = Axios.post(`/orders/get/`, data, {
    headers,
  });
  return res;
};

// Cart APIs
export const getOrderApi = (id, headers) => {
  const res = Axios.get(`/orders/${id}`, {
    headers,
  });
  return res;
};