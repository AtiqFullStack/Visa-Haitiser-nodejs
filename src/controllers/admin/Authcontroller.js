const { ApiResponse, asyncHandler } = require('../../utils');
// type import removed;
const { Admin } = require('../../models');
const { generateToken, passwordCompare, passwordHash, blacklistToken } = require('../../helper');

const registerAdmin = asyncHandler(async (req, res) => {
    const { email, password, phone, name } = req.body
    const admin = new Admin()
    admin.email = email
    admin.password = await passwordHash(password)
    admin.phone = phone
    admin.name = name
    const data = await admin.save()
    return res.status(200).json(
        new ApiResponse(200, data, 'Admin created successfully')
    )

})

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Test async handler error handling
    if (!email || !password) {
        throw new Error('Email and password are required')
    }

    const admin = await Admin.findOne({ email })

    if (!admin) {
        return res.status(404).json(
            new ApiResponse(404, null, 'Admin not found')
        )
    }
    if (!admin.password) {
        return res.status(404).json(
            new ApiResponse(404, null, 'Admin not found')
        )
    }

    const isMatch = await passwordCompare(password, admin.password)
    if (!isMatch) {
        return res.status(401).json(
            new ApiResponse(401, null, 'Invalid credentials')
        )
    }

    const token = generateToken({ id: admin._id, role: "admin" })
    return res.status(200).json(
        new ApiResponse(200, { admin, token: token }, 'Admin logged in successfully')
    )
})

const getAdminProfile = asyncHandler(async (req, res) => {
    const adminId = req.user.id

    const admin = await Admin.findById(adminId).select('-password')

    if (!admin) {
        return res.status(404).json(
            new ApiResponse(404, null, 'Admin not found')
        )
    }

    return res.status(200).json(
        new ApiResponse(200, admin, 'Admin profile fetched successfully')
    )
})

const logoutAdmin = asyncHandler(async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
        blacklistToken(token)
    }

    return res.status(200).json(
        new ApiResponse(200, null, 'Admin logged out successfully')
    )
})

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const adminId = req?.user?.id
    const admin = await Admin.findById(adminId)
    if (!admin) {
      throw new Error('Admin Not found')
    }
    if (!admin.password) {
       throw new Error('Admin Not found')
    }
    const isMatch = await passwordCompare(currentPassword, admin.password)
    if (!isMatch) {
       throw new Error('Invalid Credentials')
    }
    admin.password = await passwordHash(newPassword)
    await admin.save()
    return res.status(200).json(
        new ApiResponse(200, null, 'Password changed successfully')
    )
});

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    logoutAdmin,
    changePassword
};