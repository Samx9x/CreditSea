"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = __importDefault(require("xml2js"));
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class XMLParserService {
    constructor() {
        this.parser = new xml2js_1.default.Parser({
            explicitArray: false,
            ignoreAttrs: true,
            trim: true
        });
    }
    /**
     * Parse XML string to JavaScript object
     */
    async parseXML(xmlString) {
        try {
            if (!xmlString || xmlString.trim().length === 0) {
                throw new errors_1.ValidationError('XML content is empty');
            }
            const result = await this.parser.parseStringPromise(xmlString);
            if (!result || !result.INProfileResponse) {
                throw new errors_1.ValidationError('Invalid XML structure: INProfileResponse node not found');
            }
            return result;
        }
        catch (error) {
            logger_1.default.error(`XML parsing failed: ${error.message}`);
            if (error instanceof errors_1.ValidationError) {
                throw error;
            }
            throw new errors_1.ValidationError(`XML parsing failed: ${error.message}`);
        }
    }
    /**
     * Extract basic details from parsed XML
     */
    extractBasicDetails(xmlObject) {
        try {
            const currentApplicant = xmlObject?.INProfileResponse?.Current_Application?.Current_Application_Details?.Current_Applicant_Details;
            const score = xmlObject?.INProfileResponse?.SCORE;
            let firstName = currentApplicant?.First_Name || null;
            let middleName = currentApplicant?.Middle_Name1 || null;
            let lastName = currentApplicant?.Last_Name || null;
            let mobilePhone = currentApplicant?.MobilePhoneNumber || null;
            let pan = currentApplicant?.IncomeTaxPan || null;
            let dateOfBirth = currentApplicant?.Date_Of_Birth_Applicant || null;
            let gender = null;
            let email = null;
            let passport = null;
            let voterId = null;
            let drivingLicense = null;
            let rationCard = null;
            let universalId = null;
            // Fallback to first account holder if current applicant data is missing
            const firstAccount = this.getFirstAccountDetails(xmlObject);
            if (!firstName && !lastName && firstAccount?.CAIS_Holder_Details) {
                firstName = firstAccount.CAIS_Holder_Details.First_Name_Non_Normalized || null;
                lastName = firstAccount.CAIS_Holder_Details.Surname_Non_Normalized || null;
                pan = firstAccount.CAIS_Holder_Details.Income_TAX_PAN || pan;
                dateOfBirth = firstAccount.CAIS_Holder_Details.Date_of_birth || dateOfBirth;
                gender = firstAccount.CAIS_Holder_Details.Gender_Code || null;
                passport = firstAccount.CAIS_Holder_Details.Passport_Number || null;
                voterId = firstAccount.CAIS_Holder_Details.Voter_ID_Number || null;
            }
            if (!mobilePhone && firstAccount?.CAIS_Holder_Phone_Details) {
                mobilePhone = firstAccount.CAIS_Holder_Phone_Details.Telephone_Number ||
                    firstAccount.CAIS_Holder_Phone_Details.Mobile_Telephone_Number || null;
                email = firstAccount.CAIS_Holder_Phone_Details.EMailId || null;
            }
            if (firstAccount?.CAIS_Holder_ID_Details) {
                const idDetails = Array.isArray(firstAccount.CAIS_Holder_ID_Details)
                    ? firstAccount.CAIS_Holder_ID_Details[0]
                    : firstAccount.CAIS_Holder_ID_Details;
                passport = passport || idDetails.Passport_Number || null;
                voterId = voterId || idDetails.Voter_ID_Number || null;
                drivingLicense = idDetails.Driver_License_Number || null;
                rationCard = idDetails.Ration_Card_Number || null;
                universalId = idDetails.Universal_ID_Number || null;
                email = email || idDetails.EMailId || null;
            }
            const creditScore = score?.BureauScore ? parseInt(score.BureauScore, 10) : null;
            // Validate credit score range
            if (creditScore !== null && (creditScore < 300 || creditScore > 900)) {
                logger_1.default.warn(`Credit score out of range: ${creditScore}`);
            }
            // Format gender
            if (gender === '1')
                gender = 'Male';
            else if (gender === '2')
                gender = 'Female';
            else if (gender)
                gender = 'Other';
            return {
                firstName,
                middleName,
                lastName,
                mobilePhone,
                pan,
                creditScore,
                dateOfBirth,
                gender,
                email,
                passport,
                voterId,
                drivingLicense,
                rationCard,
                universalId
            };
        }
        catch (error) {
            logger_1.default.error(`Error extracting basic details: ${error.message}`);
            throw new errors_1.ValidationError(`Failed to extract basic details: ${error.message}`);
        }
    }
    /**
     * Extract report summary from parsed XML
     */
    extractReportSummary(xmlObject) {
        try {
            const caisSummary = xmlObject?.INProfileResponse?.CAIS_Account?.CAIS_Summary;
            const totalCaps = xmlObject?.INProfileResponse?.TotalCAPS_Summary;
            const creditAccount = caisSummary?.Credit_Account || {};
            const totalBalance = caisSummary?.Total_Outstanding_Balance || {};
            return {
                totalAccounts: parseInt(creditAccount.CreditAccountTotal, 10) || 0,
                activeAccounts: parseInt(creditAccount.CreditAccountActive, 10) || 0,
                closedAccounts: parseInt(creditAccount.CreditAccountClosed, 10) || 0,
                currentBalance: parseInt(totalBalance.Outstanding_Balance_All, 10) || 0,
                securedBalance: parseInt(totalBalance.Outstanding_Balance_Secured, 10) || 0,
                unsecuredBalance: parseInt(totalBalance.Outstanding_Balance_UnSecured, 10) || 0,
                enquiriesLast7Days: parseInt(totalCaps?.TotalCAPSLast7Days, 10) || 0
            };
        }
        catch (error) {
            logger_1.default.error(`Error extracting report summary: ${error.message}`);
            throw new errors_1.ValidationError(`Failed to extract report summary: ${error.message}`);
        }
    }
    /**
     * Extract credit accounts from parsed XML
     */
    extractCreditAccounts(xmlObject) {
        try {
            const accountDetails = xmlObject?.INProfileResponse?.CAIS_Account?.CAIS_Account_DETAILS;
            if (!accountDetails) {
                logger_1.default.warn('No account details found in XML');
                return [];
            }
            const accounts = Array.isArray(accountDetails) ? accountDetails : [accountDetails];
            return accounts.map(account => ({
                subscriberName: (account.Subscriber_Name || '').trim(),
                accountNumber: account.Account_Number || '',
                portfolioType: account.Portfolio_Type || '',
                accountType: account.Account_Type || '',
                accountStatus: account.Account_Status || '',
                currentBalance: parseInt(account.Current_Balance, 10) || 0,
                amountOverdue: parseInt(account.Amount_Past_Due, 10) || 0,
                creditLimit: parseInt(account.Credit_Limit_Amount, 10) || 0,
                openDate: account.Open_Date || '',
                dateReported: account.Date_Reported || '',
                dateClosed: account.Date_Closed || '',
                paymentRating: account.Payment_Rating || ''
            }));
        }
        catch (error) {
            logger_1.default.error(`Error extracting credit accounts: ${error.message}`);
            throw new errors_1.ValidationError(`Failed to extract credit accounts: ${error.message}`);
        }
    }
    /**
     * Extract addresses from parsed XML
     */
    extractAddresses(xmlObject) {
        try {
            const addresses = [];
            const accountDetails = xmlObject?.INProfileResponse?.CAIS_Account?.CAIS_Account_DETAILS;
            if (!accountDetails) {
                return addresses;
            }
            const accounts = Array.isArray(accountDetails) ? accountDetails : [accountDetails];
            const addressMap = new Map();
            accounts.forEach(account => {
                const addressDetails = account.CAIS_Holder_Address_Details;
                if (addressDetails) {
                    const addressKey = [
                        addressDetails.First_Line_Of_Address_non_normalized,
                        addressDetails.City_non_normalized,
                        addressDetails.ZIP_Postal_Code_non_normalized
                    ].filter(Boolean).join('|');
                    if (addressKey && !addressMap.has(addressKey)) {
                        addressMap.set(addressKey, {
                            addressLine1: addressDetails.First_Line_Of_Address_non_normalized || '',
                            addressLine2: addressDetails.Second_Line_Of_Address_non_normalized || '',
                            addressLine3: addressDetails.Third_Line_Of_Address_non_normalized || '',
                            city: addressDetails.City_non_normalized || '',
                            state: addressDetails.State_non_normalized || '',
                            postalCode: addressDetails.ZIP_Postal_Code_non_normalized || '',
                            countryCode: addressDetails.CountryCode_non_normalized || ''
                        });
                    }
                }
            });
            return Array.from(addressMap.values());
        }
        catch (error) {
            logger_1.default.error(`Error extracting addresses: ${error.message}`);
            // Don't throw error for addresses as they're not critical
            return [];
        }
    }
    /**
     * Get first account details for fallback data extraction
     */
    getFirstAccountDetails(xmlObject) {
        try {
            const accountDetails = xmlObject?.INProfileResponse?.CAIS_Account?.CAIS_Account_DETAILS;
            if (!accountDetails)
                return null;
            return Array.isArray(accountDetails) ? accountDetails[0] : accountDetails;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Extract all data from XML file
     */
    async extractAllData(xmlString) {
        try {
            logger_1.default.info('Starting XML data extraction');
            const xmlObject = await this.parseXML(xmlString);
            // Extract report metadata
            const header = xmlObject?.INProfileResponse?.CreditProfileHeader;
            const reportDate = header?.ReportDate || '';
            const reportNumber = header?.ReportNumber || '';
            logger_1.default.info(`Extracting data for report number: ${reportNumber}`);
            const data = {
                basicDetails: this.extractBasicDetails(xmlObject),
                reportSummary: this.extractReportSummary(xmlObject),
                creditAccounts: this.extractCreditAccounts(xmlObject),
                addresses: this.extractAddresses(xmlObject),
                reportDate,
                reportNumber
            };
            logger_1.default.info(`Successfully extracted data: ${data.creditAccounts.length} accounts, ${data.addresses.length} addresses`);
            return data;
        }
        catch (error) {
            logger_1.default.error(`Failed to extract data from XML: ${error.message}`);
            throw error;
        }
    }
}
exports.default = new XMLParserService();
//# sourceMappingURL=xmlParserService.js.map