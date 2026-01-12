import * as path from "path";

import express from 'express'
import axios from 'axios'
import cors from 'cors'

import { PORT } from './src/utils/cofig'
import { dbConnect } from './src/services'
import routes from './src/routes'
import errorHandler from './src/middlewares/errorHandler'

import crypto from 'crypto';
import { GEETEST_ID, GEETEST_KEY } from './src/utils/cofig';
import puppeteer from "puppeteer";


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// EJS view engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'src/ejs'))

// Static files for CSS
app.use('/static', express.static(path.join(process.cwd(), 'src/ejs')))

// db connection
dbConnect()
app.use(cors())

//upload == public
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public"))
);

app.use('/api', routes)

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/generate-pdf', async (req, res) => {
  console.log('api called')
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
        '--disable-dev-shm-usage', // Helps with low memory environments
        '--disable-gpu' // Can help in some headless environments
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
    console.log(error)
    res.status(500).json({ error: 'PDF generation failed', err: error });
  }
});

// API to serve EJS template
app.get('/api/visa-template', (req, res) => {
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
 
// ---------------------------------------------------------
//                       Captcha
// ---------------------------------------------------------

const md5 = (str:any) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

 // register captcha 

 app.get('/api/geetest/register', async (req, res) => {
  try {
    // Geetest API को call करें
    const timestamp = Date.now();
    const registerUrl = 'https://api.geetest.com/register.php';
    
    const params = {
      gt: GEETEST_ID, // Your Geetest ID
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
        offline: false, // ✅ IMPORTANT: false for interactive mode
        new_captcha: true,
        api_server: 'api.geetest.com'
      });
    } else {
      // Fallback (should not happen for production)
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
    
    // Fallback if API fails
    res.json({
      success: 1,
      gt: GEETEST_ID,
      challenge: md5(Date.now().toString()),
      offline: true,
      new_captcha: true
    });
  }
});






// Error handling middleware (must be last)
app.use(errorHandler)




app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})



// -----------------captcha--------------------
// import express from 'express';
// import axios from 'axios';
// import cors from 'cors';


// const app = express();

// // CORS configuration
// app.use(cors());
// app.use(express.json());

// // Geetest v3 Credentials - अपने credentials डालें


// // MD5 helper function


// // 1. Geetest v3 First Register API
// // server.js में
// app.get('/api/geetest/register', async (req, res) => {
//   try {
//     // Geetest API को call करें
//     const timestamp = Date.now();
//     const registerUrl = 'https://api.geetest.com/register.php';
    
//     const params = {
//       gt: '2d3cf37005b89b79df11eb1f607bfb79', // Your Geetest ID
//       json_format: 1,
//       sdk: 'node_3.3.0',
//       t: timestamp,
//       client_type: 'web'
//     };

//     console.log('Calling Geetest API with params:', params);

//     const response = await axios.get(registerUrl, { params });
    
//     console.log('Geetest API response:', response.data);

//     if (response.data.status === 'success') {
//       const challenge = response.data.challenge;
      
//       res.json({
//         success: 1,
//         gt: params.gt,
//         challenge: challenge,
//         offline: false, // ✅ IMPORTANT: false for interactive mode
//         new_captcha: true,
//         api_server: 'api.geetest.com'
//       });
//     } else {
//       // Fallback (should not happen for production)
//       res.json({
//         success: 1,
//         gt: params.gt,
//         challenge: md5(timestamp.toString()),
//         offline: true,
//         new_captcha: true
//       });
//     }
    
//   } catch (error) {
//     console.error('Geetest register error:', error);
    
//     // Fallback if API fails
//     res.json({
//       success: 1,
//       gt: '2d3cf37005b89b79df11eb1f607bfb79',
//       challenge: md5(Date.now().toString()),
//       offline: true,
//       new_captcha: true
//     });
//   }
// });

// // 2. Geetest v3 Validate API
// app.post('/api/geetest/validate', async (req, res) => {
//   try {
//     const { 
//       geetest_challenge, 
//       geetest_validate, 
//       geetest_seccode 
//     } = req.body;

//     console.log('Validation Request:', req.body);

//     // Validate using Geetest v3 API
//     const validateUrl = 'http://api.geetest.com/validate.php';

//     const params = {
//       geetest_challenge,
//       geetest_validate,
//       geetest_seccode,
//       json_format: 1
//     };

//     console.log('Geetest v3 Validate Params:', params);

//     const response = await axios.post(validateUrl, null, { params });
    
//     console.log('Geetest v3 Validate Response:', response.data);

//     if (response.data.status === 'success') {
//       res.json({
//         success: true,
//         message: 'Captcha verification successful'
//       });
//     } else {
//       // Local validation fallback
//       const challengeStr = geetest_challenge;
//       const validateStr = geetest_validate;
      
//       const localMd5 = md5(GEETEST_KEY + 'geetest' + challengeStr);
      
//       if (validateStr === localMd5) {
//         res.json({
//           success: true,
//           message: 'Captcha verification successful (fallback)'
//         });
//       } else {
//         res.json({
//           success: false,
//           message: 'Captcha verification failed'
//         });
//       }
//     }
//   } catch (error) {
//     console.error('Geetest v3 Validate Error:', error.message);
    
//     // Fallback validation
//     const { geetest_challenge, geetest_validate } = req.body;
//     const localMd5 = md5(GEETEST_KEY + 'geetest' + geetest_challenge);
    
//     if (geetest_validate === localMd5) {
//       res.json({
//         success: true,
//         message: 'Captcha verification successful (fallback)'
//       });
//     } else {
//       res.json({
//         success: false,
//         message: 'Captcha verification failed'
//       });
//     }
//   }
// });

// // 3. Test endpoint
// app.get('/api/test', (req, res) => {
//   res.json({
//     message: 'Backend is working!',
//     geetestId: GEETEST_ID ? 'Configured' : 'Not configured'
//   });
// });

// // 4. Form submission endpoint
// app.post('/api/submit-form', async (req, res) => {
//   try {
//     const { formData, captchaData } = req.body;
    
//     // First validate captcha
//     const captchaResponse = await axios.post('http://localhost:3001/api/geetest/validate', captchaData);
    
//     if (!captchaResponse.data.success) {
//       return res.status(400).json({
//         success: false,
//         message: 'Captcha validation failed',
//         error: captchaResponse.data.message
//       });
//     }
    
//     // Process your form data here
//     console.log('Form submitted:', formData);
    
//     res.json({
//       success: true,
//       message: 'Form submitted successfully',
//       data: formData
//     });
    
//   } catch (error) {
//     console.error('Form submission error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`✅ Geetest v3 Backend running on http://localhost:${PORT}`);
//   console.log(`📝 Test endpoint: http://localhost:${PORT}/api/test`);
//   console.log(`🔐 Geetest Register: http://localhost:${PORT}/api/geetest/register`);
// });