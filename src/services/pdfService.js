class pdfService {
    constructor() {
        this.puppeteer = require('puppeteer');
        this.ejs = require('ejs');
        this.path = require('path');
    }

    async generatePDF(data) {
        try {
            const templatePath = this.path.join(__dirname, '../ejs/pdftemplate.ejs');
            const html = await this.ejs.renderFile(templatePath, { data });

            const browser = await this.puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.setContent(html);
            const buffer = await page.pdf({ format: 'A4' });
            await browser.close();

            return buffer;
        } catch (error) {
            throw new Error(`PDF generation failed: ${error.message}`);
        }
    }
}