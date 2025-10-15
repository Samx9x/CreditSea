"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupFile = exports.uploadSingleXML = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errors_1 = require("../utils/errors");
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        const filename = `${path_1.default.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});
// File filter to accept only XML files
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ['text/xml', 'application/xml'];
    const allowedExtensions = ['.xml'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(mimeType)) {
        cb(null, true);
    }
    else {
        cb(new errors_1.ValidationError('Only XML files are allowed'));
    }
};
// Configure multer
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});
// Middleware to handle single file upload
exports.uploadSingleXML = upload.single('xmlFile');
// Cleanup function to remove uploaded file
const cleanupFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
    catch (error) {
        console.error(`Error cleaning up file ${filePath}:`, error.message);
    }
};
exports.cleanupFile = cleanupFile;
//# sourceMappingURL=upload.js.map