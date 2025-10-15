import mongoose, { Schema, Document } from 'mongoose';
import { ICreditReport } from '../types';

interface ICreditReportDocument extends Omit<ICreditReport, '_id'>, Document {}

const creditAccountSchema = new Schema({
  subscriberName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  portfolioType: { type: String, trim: true },
  accountType: { type: String, trim: true },
  accountStatus: { type: String, trim: true },
  currentBalance: { type: Number, default: 0 },
  amountOverdue: { type: Number, default: 0 },
  creditLimit: { type: Number, default: 0 },
  openDate: { type: String, trim: true },
  dateReported: { type: String, trim: true },
  dateClosed: { type: String, trim: true },
  paymentRating: { type: String, trim: true }
}, { _id: false });

const addressSchema = new Schema({
  addressLine1: { type: String, trim: true },
  addressLine2: { type: String, trim: true },
  addressLine3: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  countryCode: { type: String, trim: true }
}, { _id: false });

const creditReportSchema = new Schema({
  basicDetails: {
    firstName: { type: String, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    fullName: { type: String, trim: true },
    mobilePhone: { type: String, trim: true },
    pan: { type: String, trim: true, uppercase: true },
    creditScore: { type: Number, min: 300, max: 900 },
    dateOfBirth: { type: String, trim: true },
    gender: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    passport: { type: String, trim: true },
    voterId: { type: String, trim: true },
    drivingLicense: { type: String, trim: true },
    rationCard: { type: String, trim: true },
    universalId: { type: String, trim: true }
  },
  reportSummary: {
    totalAccounts: { type: Number, default: 0 },
    activeAccounts: { type: Number, default: 0 },
    closedAccounts: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    securedBalance: { type: Number, default: 0 },
    unsecuredBalance: { type: Number, default: 0 },
    enquiriesLast7Days: { type: Number, default: 0 }
  },
  creditAccounts: [creditAccountSchema],
  addresses: [addressSchema],
  uploadedAt: { type: Date, default: Date.now },
  reportDate: { type: String, trim: true },
  reportNumber: { type: String, trim: true, index: true }
}, {
  timestamps: true
});

// Indexes for better query performance
creditReportSchema.index({ uploadedAt: -1 });
creditReportSchema.index({ 'basicDetails.pan': 1 });
creditReportSchema.index({ 'basicDetails.creditScore': 1 });
creditReportSchema.index({ reportNumber: 1 });
creditReportSchema.index({ createdAt: -1 });

// Pre-save middleware to compute fullName
creditReportSchema.pre('save', function(next) {
  if (this.basicDetails) {
    const { firstName, middleName, lastName } = this.basicDetails;
    this.basicDetails.fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(' ');
  }
  next();
});

// Static methods for common queries
creditReportSchema.statics.findByPAN = function(pan: string) {
  return this.find({ 'basicDetails.pan': pan });
};

creditReportSchema.statics.findByCreditScoreRange = function(min: number, max: number) {
  return this.find({
    'basicDetails.creditScore': { $gte: min, $lte: max }
  });
};

const CreditReport = mongoose.model<ICreditReportDocument>('CreditReport', creditReportSchema);

export default CreditReport;
