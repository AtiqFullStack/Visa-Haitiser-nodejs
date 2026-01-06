
export { registerAdmin, loginAdmin,changePassword } from './admin/Authcontroller'

export { createQR, getAllQRs, increaseDownloadCount } from './admin/QrControllers'

export { uploadSingleImage, uploadMultipleImages, uploadLogo, getAllLogos, deleteLogo } from './upload.controller'

export { getDashboardStats } from './admin/dashboard.controller'

export {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    deleteTemplate,
    updateTemplate

} from './admin/template.controller'