import { CreditReportData, BasicDetails, ReportSummary, CreditAccount, Address } from '../types';
declare class XMLParserService {
    private parser;
    constructor();
    /**
     * Parse XML string to JavaScript object
     */
    parseXML(xmlString: string): Promise<any>;
    /**
     * Extract basic details from parsed XML
     */
    extractBasicDetails(xmlObject: any): BasicDetails;
    /**
     * Extract report summary from parsed XML
     */
    extractReportSummary(xmlObject: any): ReportSummary;
    /**
     * Extract credit accounts from parsed XML
     */
    extractCreditAccounts(xmlObject: any): CreditAccount[];
    /**
     * Extract addresses from parsed XML
     */
    extractAddresses(xmlObject: any): Address[];
    /**
     * Get first account details for fallback data extraction
     */
    private getFirstAccountDetails;
    /**
     * Extract all data from XML file
     */
    extractAllData(xmlString: string): Promise<CreditReportData>;
}
declare const _default: XMLParserService;
export default _default;
//# sourceMappingURL=xmlParserService.d.ts.map