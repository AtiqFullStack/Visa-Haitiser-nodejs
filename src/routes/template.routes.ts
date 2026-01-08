import { Router } from 'express'

const router = Router()

// API to serve EJS template
router.get('/visa-template', (req, res) => {
    // Sample data - you can replace this with dynamic data from database
    const visaData = {
        placeOfIssuing: 'PORTO PRÍNCIPE',
        visaNumber: '251127-510835',
        entries: 'ÚNICA/SINGLE',
        dateOfIssue: '09 DEZ/DEC 2025',
        visaType: 'VITEM XI',
        dateOfExpiry: '08 DEZ/DEC 2026',
        durationOfStay: '365 DIAS/DAYS',
        fullName: 'GREGOIRE NORMIL',
        documentNumber: 'R12732532',
        sex: 'M',
        dateOfBirth: '16 SET/SET 2005',
        nationality: 'HAITIANO',
        issuingAuthority: 'PORTO PRÍNCIPE EMB',
        verificationCode: 'GWZG.FQHL.6TCW.3PLF'
    }
    
    res.render('pdftemplate', visaData)
})

// API to serve template with custom data
router.post('/visa-template', (req, res) => {
    const visaData = req.body
    res.render('pdftemplate', visaData)
})

export default router