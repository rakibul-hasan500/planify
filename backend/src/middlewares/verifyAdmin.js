const { errorResponse } = require("../../utils/responseHandler")

const verifyAdmin = async (req, res, next)=>{
    try{
        // Get User From Verify AUth
        const user = req.user
        if(!user){
            return errorResponse(res, 401, "Unauthorized. No user found.");
        }

        // Check role
        if(user.role !== 'admin'){
            return errorResponse(res, 403, 'Sorry, this action is restricted to admin users.')
        }

        // Send User
        req.user = user

        next()
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}






module.exports = verifyAdmin