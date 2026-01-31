import api from "./axios";

export const loginApi = (payload) => {
  return api.post("/auth/login", payload);
};

export const refreshApi=()=>{
    return api.post("/auth/refresh")
}
