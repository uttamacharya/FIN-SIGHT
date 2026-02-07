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

export const requestOtp=(payload)=>{
  return api.post("/auth/request-otp", payload)
}

export const verifyOtp=(payload)=>{
  return api.post("/auth/verify-otp", payload)
}


// export const forgetPassword=(payload)=>{
//   return api.post("/auth/forget-password", payload)
// }

export const resetPassword=(payload)=>{
  return api.post("/auth/reset-password", payload)
}

export const logout=()=>{
  api.delete("/auth/logout");
}