import express from 'express';
import {
  uploadReport,
  getAllReports,
  getReportById,
  deleteReport,
  getReportStats
} from '../controllers/reportController';
import { uploadSingleXML } from '../middleware/upload';

const router = express.Router();

// Statistics route (must be before :id route)
router.get('/stats', getReportStats);

// Upload XML credit report
router.post('/upload', uploadSingleXML, uploadReport);

// Get all reports with pagination
router.get('/', getAllReports);

// Get single report by ID
router.get('/:id', getReportById);

// Delete report by ID
router.delete('/:id', deleteReport);

export default router;
