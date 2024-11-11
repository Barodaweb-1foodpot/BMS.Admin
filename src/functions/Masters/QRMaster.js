import axios from "axios";

export const createQRMaster  = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/QRMaster`,
    values
  );
};

export const removeQRMaster  = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/QRMaster/${_id}`
  );
};

export const listQRMaster  = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/QRMaster`
  );
};

export const updateQRMaster  = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/QRMaster/${_id}`,
    values
  );
};

export const getQRMaster  = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/QRMaster/${_id}`
  );
};
