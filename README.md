# qr-scanner-nodejs

A QR code scanner and generator application built with Node.js and Express.

## Installation

To install dependencies:

```bash
npm install
```

## Running the Application

For development (with auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

## Project Structure

This project uses:
- **JavaScript** (converted from TypeScript)
- **CommonJS** module system (require/module.exports)
- **Express.js** for the web server
- **MongoDB** with Mongoose for database
- **Puppeteer** for PDF generation

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
SALT_ROUND=15
GEETEST_ID=your_geetest_id
GEETEST_KEY=your_geetest_key
```

## API Endpoints

### Admin Routes
- `POST /api/admin/auth/register` - Register admin
- `POST /api/admin/auth/login` - Login admin
- `GET /api/admin/auth/profile` - Get admin profile
- `POST /api/admin/auth/logout` - Logout admin
- `PUT /api/admin/auth/changePassword` - Change password

### QR Code Routes
- `POST /api/admin/qr/create` - Create QR code
- `GET /api/admin/qr/getAll` - Get all QR codes
- `GET /api/admin/qr/get/:id` - Get single QR code
- `DELETE /api/admin/qr/delete/:id` - Delete QR code
- `POST /api/admin/qr/verifyAuthenticity` - Verify QR authenticity

### Template Routes
- `POST /api/admin/template/create` - Create template
- `GET /api/admin/template/get` - Get all templates
- `GET /api/admin/template/get/:id` - Get template by ID
- `PUT /api/admin/template/update/:id` - Update template
- `DELETE /api/admin/template/delete/:id` - Delete template

## Notes

- The project has been converted from TypeScript to JavaScript
- Module system changed from ES modules to CommonJS
- All `.ts` files have been converted to `.js` files
- TypeScript configuration files (tsconfig.json) are no longer needed
