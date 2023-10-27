import { AxiosResponse } from "axios";
import AxiosServices from "@/services/Axios";

const handleResponse = async <T,>(
  promise: Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchAll = async <T,>(url: string): Promise<T[]> => {
  return handleResponse<T[]>(AxiosServices.get<T[]>(url));
};

const getObject = async <T,>(url: string): Promise<T> => {
  return handleResponse<T>(AxiosServices.get<T>(url));
};

const createObject = async <TGet, TCreate>(
  url: string,
  object: TCreate
): Promise<TGet> => {
  return handleResponse<TGet>(AxiosServices.post<TGet>(url, object));
};

const updateObject = async <TGet, TUpdate>(
  url: string,
  object: TUpdate
): Promise<TGet> => {
  return handleResponse<TGet>(AxiosServices.put<TGet>(url, object));
};

const deleteObject = async (url: string): Promise<void> => {
  try {
    await AxiosServices.delete(url);
  } catch (error) {
    Promise.reject(error);
  }
};

export { fetchAll, createObject, updateObject, deleteObject, getObject };
