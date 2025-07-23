import { ReportAdapter } from "./ReportAdapter";
import { JsonReportAdapter } from "./JsonReportAdapter";
import { CsvReportAdapter } from "./CsvReportAdapter";
import { XmlReportAdapter } from "./XmlReportAdapter";
import { AnalyzerFacade } from "./AnalyzerFacade";
import * as fs from "fs";
import * as path from "path";

export class ReportManager {
  private format: string;

  constructor(format: string) {
    this.format = format.toLowerCase();
  }

  generateReport(dirPath: string): void {
    try {
      let adapter;
      switch (this.format) {
        case 'json':
          adapter = new JsonReportAdapter();
          break;
        case 'csv':
          adapter = new CsvReportAdapter();
          break;
        case 'xml':
          adapter = new XmlReportAdapter();
          break;
        default:
          throw new Error(`Unsupported format: ${this.format}`);
      }

      const facade = new AnalyzerFacade(adapter);
      const reportContent = facade.generateReport(dirPath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `report-${timestamp}.${this.format}`;

      const reportsDir = path.resolve('reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
      }

      const filePath = path.join(reportsDir, fileName);
      fs.writeFileSync(filePath, reportContent);

      console.log(`Report generated successfully: ${filePath}`);
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  }
}
