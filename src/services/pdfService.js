class pdfService {
    constructor() {
        this.puppeteer = require('puppeteer');
        this.ejs = require('ejs');
        this.path = require('path');
        this.fs = require('fs');
    }

    async generatePDF(data, savePath) {
        try {
            const templatePath = this.path.join(__dirname, '../ejs/pdftemplate.ejs');
            const html = await this.ejs.renderFile(templatePath, { data });

            const browser = await this.puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const buffer = await page.pdf({ 
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: false,
                scale: 0.8,
                margin: { top: '10px', bottom: '10px', left: '15px', right: '15px' }
            });
            await browser.close();

            if (savePath) {
                this.fs.writeFileSync(savePath, buffer);
            }

            return buffer;
        } catch (error) {
            throw new Error(`PDF generation failed: ${error.message}`);
        }
    }
}

module.exports = pdfService;