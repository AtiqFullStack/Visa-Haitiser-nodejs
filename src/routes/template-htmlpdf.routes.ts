import { Router } from 'express'
import pdf from 'html-pdf'
import path from 'path'

const router = Router()

// API to serve EJS template
router.get('/visa-template', (req, res) => {
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

// API to generate PDF with html-pdf
router.get('/visa-pdf', async (req, res) => {
    try {
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

        const html = await new Promise<string>((resolve, reject) => {
            res.app.render('pdftemplate', visaData, (err: any, html: string) => {
                if (err) reject(err)
                else resolve(html)
            })
        })

        const options = {
            format: 'A4',
            border: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        }

        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('PDF generation error:', err)
                return res.status(500).json({ error: 'PDF generation failed' })
            }

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename="visa.pdf"')
            res.send(buffer)
        })

    } catch (error) {
        console.error('PDF generation error:', error)
        res.status(500).json({ error: 'PDF generation failed' })
    }
})

export default router