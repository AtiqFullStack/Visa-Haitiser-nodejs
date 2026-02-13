const QrCode = require('../../models/QrCode');
const { ApiResponse, asyncHandler, generateTokenOfQr } = require('../../utils');
const pdfService = require('../../services/pdfService');
const path = require('path');
const fs = require('fs');

const createQR = async (req, res) => {
    try {
        const { data, options } = req.body;

        if (!data || !options) {
            return res.status(400).json({
                message: "QR data and options are required",
            });
        }
        const token = generateTokenOfQr();

        const qr = await QrCode.create({
            data,
            options,
            createdBy: req.user?.id,
            token: token
        });

        // Generate PDF
        const pdfDir = path.join(__dirname, '../../../public/pdf');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        const pdfFileName = `visa_${qr._id}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFileName);

        const pdfServiceInstance = new pdfService();
        data.logoImage = "https://visa-haiti-serpro-gov-br.info/backend/uploads/logos/newl.png"
        const qrCodeUrl = `https://visa-haiti-serpro-gov-br.info/sci/pages/web?key=${qr.token}`;
        console.log(qrCodeUrl)
        data.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`;
        await pdfServiceInstance.generatePDF(data, pdfPath);

        // Update QR with PDF path
        await QrCode.findByIdAndUpdate(qr._id, {
            pdfUrl: `/public/pdf/${pdfFileName}`
        });

        const url = `https://visa-haiti-serpro-gov-br.info/backend/public/pdf/${pdfFileName}`;
        // const url = `http://localhost:5001/public/pdf/${pdfFileName}`;
        res.status(201).json({
            success: true,
            message: "QR saved successfully",
            qr: { ...qr.toObject(), pdfUrl: url },
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        });
    }
};

const getQrWithToken = asyncHandler(async (req, res) => {
    const { token } = req.query
    if (!token) {
        throw new Error('No Data Found')
    }
    const data = await QrCode.findOne({ token })
    if (!data) throw new Error('No Data Found')
    if (data) {

        res.status(200).json(
            new ApiResponse(200, data, 'Data found')
        )
    }

})

const getAllQRs = async (_req, res) => {
    try {
        const qrs = await QrCode.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: qrs,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSingle = async (_req, res) => {
    try {
        const qrs = await QrCode.findOne({ _id: _req.params.id }).sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, qrs, 'Data fetched'));
    } catch (error) {
        throw new Error(error.message);
    }
};

const increaseDownloadCount = async (req, res) => {
    try {
        const { id } = req.params;

        await QrCode.findByIdAndUpdate(id, {
            $inc: { downloadCount: 1 },
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changeStatusOfQrCode = async (req, res) => {
    try {
        const { id } = req.params;

        const qr = await QrCode.findById(id);

        if (!qr) {
            return res.status(404).json({ message: "QR Code not found" });
        }

        const newStatus = qr.status === "active" ? "inactive" : "active";

        await QrCode.findByIdAndUpdate(id, {
            status: newStatus,
        });

        res.json({
            success: true,
            status: newStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteQrCode = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await QrCode.findByIdAndDelete(id);
        return res.status(200).json(
            new ApiResponse(200, data, 'QR Code deleted successfully')
        );
    } catch (error) {
        throw new Error(error);
    }
};

// =============================== with special character =========================================

// const verifyAuthenticity = asyncHandler(async (req, res) => {
//     const { applicationNumber, code } = req.body;
//     console.log(applicationNumber,code)

//     if (!applicationNumber || !code) {
//         return res.status(400).json({
//             success: false,
//             status: 400,
//             message: "Please provide application number and code"
//         });
//     }

//     const isValid = await QrCode.findOne({
//         "data.visaNumber": applicationNumber,
//         "data.verificationCode": code
//     });

//     if (!isValid) {
//         return res.status(400).json({
//             success: false,
//             status: 400,
//             message: "Document not found"
//         });
//     }

//     return res
//         .status(200)
//         .json(new ApiResponse(200, isValid, "Document found"));
// });


// =============================== without special character =========================================
const verifyAuthenticity = asyncHandler(async (req, res) => {
    const { applicationNumber, code } = req.body;

    if (!applicationNumber || !code) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Please provide application number and code",
        });
    }

    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const result = await QrCode.aggregate([
        {
            $match: {
                "data.visaNumber": applicationNumber,
            },
        },
        {
            $addFields: {
                normalizedDbCode: {
                    $toUpper: {
                        $replaceAll: {
                            input: {
                                $replaceAll: {
                                    input: "$data.verificationCode",
                                    find: ".",
                                    replacement: "",
                                },
                            },
                            find: "-",
                            replacement: "",
                        },
                    },
                },
            },
        },
        {
            $match: {
                normalizedDbCode: cleanCode,
            },
        },
    ]);

    if (!result.length) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Document not found",
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, result[0], "Document found"));
});


const updateQRsWithoutToken = async (req, res) => {
    try {
        const qrsWithoutToken = await QrCode.find({ token: { $exists: false } });
        // console.log(qrsWithoutToken.length)
        // return 

        for (const qr of qrsWithoutToken) {
            const token = generateTokenOfQr();
            await QrCode.findByIdAndUpdate(qr._id, { token });
        }

        res.status(200).json({
            success: true,
            message: `Updated ${qrsWithoutToken.length} QR codes with tokens`,
            count: qrsWithoutToken.length
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createQR,
    getAllQRs,
    increaseDownloadCount,
    getSingle,
    changeStatusOfQrCode,
    deleteQrCode,
    verifyAuthenticity,
    getQrWithToken,
    updateQRsWithoutToken
};
