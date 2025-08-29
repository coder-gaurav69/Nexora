import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';

// Support for __dirname in ES6+ TypeScript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 2000;
const MONGODB_URL = process.env.MONGODB_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const CLOUDINARY_CLOUD_NAME=process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET=process.env.CLOUDINARY_API_SECRET
const TEST_KEY_ID=process.env.TEST_KEY_ID
const TEST_KEY_SECRET=process.env.TEST_KEY_SECRET
const JWT_ACCESS_SECRET_KEY=process.env.JWT_ACCESS_SECRET_KEY
const JWT_REFRESH_SECRET_KEY=process.env.JWT_REFRESH_SECRET_KEY
const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CALLBACK_URL=process.env.GOOGLE_CALLBACK_URL
const MODE = process.env.MODE;
const VALIDADMINS = process.env.VALIDADMINS;

export { PORT, MONGODB_URL ,FRONTEND_URL,CLOUDINARY_API_KEY,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_SECRET,TEST_KEY_ID,TEST_KEY_SECRET,JWT_ACCESS_SECRET_KEY,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_CALLBACK_URL,JWT_REFRESH_SECRET_KEY,MODE ,VALIDADMINS};
