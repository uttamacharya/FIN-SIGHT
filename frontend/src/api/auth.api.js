import api from "./axios";

export const signUpApi=(payload)=>{
  return api.post("/auth/signup",payload)
}
export const loginApi = (payload) => {
  return api.post("/auth/login", payload);
};

export const refreshApi=()=>{
    return api.post("/auth/refresh")
}
