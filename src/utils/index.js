const asyncHandler = require('./asyncHandler');
const { ApiResponse, ApiError } = require('./ApiResponse');


const  generateTokenOfQr = ()=>{
    const short = Date.now().toString(36)
    return short
}

module.exports = {
    asyncHandler,
    ApiResponse,
    ApiError ,
    generateTokenOfQr
};
