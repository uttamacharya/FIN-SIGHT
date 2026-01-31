import { getUserByIdService } from "./user.service.js";


const getMyProfile= async(req, res, next)=>{
    try {
        const userId=req.user.id; //from auth middlewere
        const user= await getUserByIdService(userId);
        res.status(200).json({
            success:true,
            data:user
        })
    } catch (error) {
        next(error);
    }
}

export { getMyProfile};