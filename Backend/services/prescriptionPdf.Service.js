import puppeteer from "puppeteer";
import { prescriptionHTMLTemplate } from "../pdfTemplates/prescriptionTemplate.js";

export const generatePrescriptionPDF = async (appointment, res) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const html = prescriptionHTMLTemplate(appointment);

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.waitForSelector("img");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "20px",
      bottom: "20px",
      left: "20px",
    },
    preferCSSPageSize: true,
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=prescription-${appointment._id}.pdf`,
  });

  res.send(pdfBuffer);
};