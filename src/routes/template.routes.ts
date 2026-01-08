import { Router } from 'express'
import puppeteer from 'puppeteer'
import path from 'path'

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

// API to generate PDF
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

        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process'
            ]
        })
        const page = await browser.newPage()

        const html = await new Promise<string>((resolve, reject) => {
            res.app.render('pdftemplate', visaData, (err: any, html: string) => {
                if (err) reject(err)
                else resolve(html)
            })
        })

        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        })

        await browser.close()

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="visa.pdf"')
        res.send(pdf)

    } catch (error) {
        console.error('PDF generation error:', error)
        res.status(500).json({ error: 'PDF generation failed' })
    }
})

// API to generate PDF with custom data
router.post('/visa-pdf', async (req, res) => {
    try {
        const visaData = req.body
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: '/usr/bin/google-chrome-stable', // या '/usr/bin/google-chrome'
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });





        const page = await browser.newPage()

        const html = await new Promise<string>((resolve, reject) => {
            res.app.render('pdftemplate', visaData, (err: any, html: string) => {
                if (err) reject(err)
                else resolve(html)
            })
        })

        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        })

        await browser.close()

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="visa.pdf"')
        res.send(pdf)

    } catch (error) {
        console.error('PDF generation error:', error)
        res.status(500).json({ error: 'PDF generation failed' })
    }
})

export default router