import axios from "axios";

export const createCompanyMaster  = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/CompanyMaster`,
    values
  );
};

export const removeCompanyMaster  = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/CompanyMaster/${_id}`
  );
};

export const listCompanyMaster  = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/CompanyMaster`
  );
};

export const updateCompanyMaster  = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/CompanyMaster/${_id}`,
    values
  );
};

export const getCompanyMaster  = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/CompanyMaster/${_id}`
  );
};
