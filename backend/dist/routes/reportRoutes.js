"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controllers/reportController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Statistics route (must be before :id route)
router.get('/stats', reportController_1.getReportStats);
// Upload XML credit report
router.post('/upload', upload_1.uploadSingleXML, reportController_1.uploadReport);
// Get all reports with pagination
router.get('/', reportController_1.getAllReports);
// Get single report by ID
router.get('/:id', reportController_1.getReportById);
// Delete report by ID
router.delete('/:id', reportController_1.deleteReport);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map