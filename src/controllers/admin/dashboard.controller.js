// type import removed

const { ApiResponse } = require('../../utils/ApiResponse')
const { QrSchema, TemplateSchema, LogosSchema } = require('../../models')
const { asyncHandler } = require('../../utils')

const getDashboardStats = asyncHandler(async (req, res) => {
    // Get total counts
    const totalQRs = await QrSchema.countDocuments()
    const totalTemplates = await TemplateSchema.countDocuments()
    const totalLogos = await LogosSchema.countDocuments()

    // Get active QRs count
    const activeQRs = await QrSchema.countDocuments({ status: "active" })
    console.log(activeQRs)

    // Get recent QRs (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentQRs = await QrSchema.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })

    // Get total downloads
    const downloadStats = await QrSchema.aggregate([
        {
            $group: {
                _id: null,
                totalDownloads: { $sum: '$downloadCount' }
            }
        }
    ])

    const totalDownloads = downloadStats.length > 0 ? downloadStats[0].totalDownloads : 0

    // Get QR generation trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const qrTrend = await QrSchema.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: -1 }   // latest dates first
        },
        {
            $limit: 6
        },
        {
            $sort: { _id: 1 }    // optional: chart ke liye wapas ascending
        }
    ]);


    // Get template usage stats
    const templateUsage = await QrSchema.aggregate([
        {
            $group: {
                _id: '$templateId',
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'templates',
                localField: '_id',
                foreignField: '_id',
                as: 'template'
            }
        },
        {
            $unwind: '$template'
        },
        {
            $project: {
                templateName: '$template.templateName',
                count: 1
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 5
        }
    ])

    const dashboardData = {
        stats: {
            totalQRs,
            totalTemplates,
            totalLogos,
            activeQRs,
            recentQRs,
            totalDownloads
        },
        charts: {
            qrTrend,
            templateUsage
        }
    }

    return res.status(200).json(
        new ApiResponse(200, dashboardData, "Dashboard stats retrieved successfully")
    )
})
module.exports = {
    getDashboardStats
};
