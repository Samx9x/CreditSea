import mongoose, { Document } from 'mongoose';
import { ICreditReport } from '../types';
interface ICreditReportDocument extends Omit<ICreditReport, '_id'>, Document {
}
declare const CreditReport: mongoose.Model<ICreditReportDocument, {}, {}, {}, mongoose.Document<unknown, {}, ICreditReportDocument> & ICreditReportDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default CreditReport;
//# sourceMappingURL=CreditReport.d.ts.map