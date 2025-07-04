import multer from 'multer';

// Use memory storage (faster, no temp files on disk)
const storage = multer.memoryStorage();

// You can also use fileFilter for file type validation
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

export default upload;
