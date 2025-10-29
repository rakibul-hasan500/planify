const successResponse = (res, statusCode=200, message='Success.', data={})=>{
    res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data
    })
}


const errorResponse = (res, statusCode=500, message='Internal server error.', error=null)=>{
    console.error('Error: ', error)
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: error?.message || null
    })
}







module.exports = {
    successResponse,
    errorResponse
}