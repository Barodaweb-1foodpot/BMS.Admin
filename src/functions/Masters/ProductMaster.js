import axios from "axios";

export const createProductMaster  = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/ProductMaster`,
    values
  );
};

export const removeProductMaster  = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/ProductMaster/${_id}`
  );
};

export const listProductMaster  = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/ProductMaster`
  );
};

export const updateProductMaster  = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/ProductMaster/${_id}`,
    values
  );
};

export const getProductMaster  = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/ProductMaster/${_id}`
  );
};
