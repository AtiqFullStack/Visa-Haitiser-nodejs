const { registerAdmin, loginAdmin, changePassword } = require('./admin/Authcontroller');
const {
    createQR,
    getAllQRs,
    increaseDownloadCount,
    getSingle,
    changeStatusOfQrCode,
    deleteQrCode,
    verifyAuthenticity,
    getQrWithToken
} = require('./admin/QrControllers');
const { uploadSingleImage, uploadSingleImageUser, uploadMultipleImages, uploadLogo, getAllLogos, deleteLogo } = require('./upload.controller');
const { getDashboardStats } = require('./admin/dashboard.controller');
const {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    deleteTemplate,
    updateTemplate
} = require('./admin/template.controller');

module.exports = {
    registerAdmin,
    loginAdmin,
    changePassword,
    createQR,
    getAllQRs,
    increaseDownloadCount,
    getSingle,
    changeStatusOfQrCode,
    deleteQrCode,
    verifyAuthenticity,
    uploadSingleImage,
    uploadSingleImageUser,
    uploadMultipleImages,
    uploadLogo,
    getAllLogos,
    deleteLogo,
    getDashboardStats,
    createTemplate,
    getAllTemplates,
    getTemplateById,
    deleteTemplate,
    updateTemplate,
    getQrWithToken
};