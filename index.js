const path = require('path');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const puppeteer = require('puppeteer');

const { PORT, GEETEST_ID, GEETEST_KEY } = require('./src/utils/cofig');
const { dbConnect } = require('./src/services');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/ejs'));

app.use('/static', express.static(path.join(process.cwd(), 'src/ejs')));

dbConnect();
app.use(cors());

app.use("/uploads", express.static(path.join(process.cwd(), "public")));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/generate-pdf', async (req, res) => {
  console.log('api called');
  try {
    const { html, options = {} } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();

    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      ...options
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
    res.send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'PDF generation failed', err: error });
  }
});

app.get('/api/visa-template', (req, res) => {
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
    };
    
    res.render('pdftemplate', visaData);
});

const md5 = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

app.get('/api/geetest/register', async (req, res) => {
  try {
    const timestamp = Date.now();
    const registerUrl = 'https://api.geetest.com/register.php';
    
    const params = {
      gt: GEETEST_ID,
      json_format: 1,
      sdk: 'node_3.3.0',
      t: timestamp,
      client_type: 'web'
    };

    console.log('Calling Geetest API with params:', params);

    const response = await axios.get(registerUrl, { params });
    
    console.log('Geetest API response:', response.data);

    if (response.data.status === 'success') {
      const challenge = response.data.challenge;
      
      res.json({
        success: 1,
        gt: params.gt,
        challenge: challenge,
        offline: false,
        new_captcha: true,
        api_server: 'api.geetest.com'
      });
    } else {
      res.json({
        success: 1,
        gt: params.gt,
        challenge: md5(timestamp.toString()),
        offline: true,
        new_captcha: true
      });
    }
    
  } catch (error) {
    console.error('Geetest register error:', error);
    
    res.json({
      success: 1,
      gt: GEETEST_ID,
      challenge: md5(Date.now().toString()),
      offline: true,
      new_captcha: true
    });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
