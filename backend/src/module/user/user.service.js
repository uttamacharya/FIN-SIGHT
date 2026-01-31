

// get user profile by id

import { findUserByEmail, findUserById } from "./user.model.js"

const getUserByIdService= async(userId)=>{
    const user= await findUserById(userId);
    if(!user){
        throw new Error("User not found")
    }
    // password should not be in response
    console.log("USER FROM DB:", user)

    delete user.password
    console.log("USER FROM DB:", user)

    return user

}
// console.log("USER FROM DB:", user)


// check if email already exist

const checkUserByEmail= async({email})=>{
    const user= await findUserByEmail(email)
    return user
}

export {
    getUserByIdService,
    checkUserByEmail
}