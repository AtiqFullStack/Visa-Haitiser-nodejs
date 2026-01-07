import * as path from "path";

import express from 'express'

import cors from 'cors'

import { PORT } from './src/utils/cofig'
import { dbConnect } from './src/services'
import routes from './src/routes'
import errorHandler from './src/middlewares/errorHandler'

import crypto from 'crypto';
import { GEETEST_ID, GEETEST_KEY } from './src/utils/cofig';


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    res.send('Hello  from visa haitiser Server')
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