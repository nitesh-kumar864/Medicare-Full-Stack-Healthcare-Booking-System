import axios from "axios";
import PDFDocument from "pdfkit";

export const generatePrescriptionPDF = async (appointment, res) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  // Set Response Headers 
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=prescription-${appointment._id}.pdf`
  );

  doc.pipe(res);

  //  Logo
  const logoUrl = "https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png";
  let logoBuffer = null;

  try {
    const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
    logoBuffer = Buffer.from(response.data);
  } catch (error) {
    console.error("Logo load failed:", error.message);
  }

      // HEADER SECTION

  const headerY = 40;

  if (logoBuffer) {
    doc.image(logoBuffer, 50, headerY, { width: 150 });
  }

  // Left Side Info
  let infoY = headerY + 40;
  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor("#64748b")
    .text("Medicare Healthcare Services", 50, infoY);

  infoY += 18;
  doc.text("Bangalore, Karnataka, India", 50, infoY);

  infoY += 18;
  doc.text("Contact: +91 9876543210", 50, infoY);

  // Right Side Meta Info
  const rightStartY = headerY + 5;
  doc
    .fontSize(24)
    .fillColor("#475569")
    .font("Helvetica-Bold")
    .text("PRESCRIPTION", 350, rightStartY, { align: "right" });

  let metaY = rightStartY + 30;
  const gap = 18;

  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#475569")
    .text(`ID: ${appointment._id}`, 350, metaY, { align: "right" });

  metaY += gap;
  doc.text(`Date: ${appointment.slotDate}`, 350, metaY, { align: "right" });

  metaY += gap;
  doc.text(`Time: ${appointment.slotTime}`, 350, metaY, { align: "right" });

  doc.moveDown(3);

  /* =========== PATIENT & DOCTOR BOX ================ */

  const boxY = 180;

  // Patient Box
  doc
    .roundedRect(50, boxY, 230, 160, 10)
    .fillAndStroke("#f8fafc", "#e2e8f0");

  doc
    .fillColor("#10b981")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("PATIENT DETAILS", 65, boxY + 15);

  doc
    .fillColor("#0f172a")
    .fontSize(11)
    .font("Helvetica");

  let patientY = boxY + 40;

  doc.text(`Name: ${appointment.userData?.name || "N/A"}`, 65, patientY);
  patientY += 18;

  doc.text(`Phone: ${appointment.userData?.phone || "N/A"}`, 65, patientY);
  patientY += 18;

  doc.text(`Email: ${appointment.userData?.email || "N/A"}`, 65, patientY);
  patientY += 18;

  doc.text(`Gender: ${appointment.userData?.gender || "N/A"}`, 65, patientY);
  patientY += 18;

  doc.text(`DOB: ${appointment.userData?.dob || "N/A"}`, 65, patientY);
  patientY += 18;

  doc.text(
    `Address: ${appointment.userData?.address?.line1 || ""} ${appointment.userData?.address?.line2 || "N/A"
    }`,
    65,
    patientY
  );

  // Doctor Box

  doc
    .roundedRect(320, boxY, 230, 160, 10)
    .fillAndStroke("#f8fafc", "#e2e8f0");

  doc
    .fillColor("#10b981")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("CONSULTING DOCTOR", 335, boxY + 15);

  doc
    .fillColor("#0f172a")
    .fontSize(11)
    .font("Helvetica");

  let doctorY = boxY + 40;

  doc.text(`Doctor: ${appointment.doctorData?.name || "N/A"}`, 335, doctorY);
  doctorY += 18;

  doc.text(`Email: ${appointment.doctorData?.email || "N/A"}`, 335, doctorY);
  doctorY += 18;

  doc.text(`Speciality: ${appointment.doctorData?.speciality || "General Physician"}`, 335, doctorY);
  doctorY += 18;

  doc.text(`Degree: ${appointment.doctorData?.degree || "General Physician"}`, 335, doctorY);
  doctorY += 18;

  doc.text(`Experience: ${appointment.doctorData?.experience || "General Physician"}`, 335, doctorY);
  doctorY += 18;

 
  /* ============ PAYMENT SECTION ============ */
  const payY = 370;

  doc
    .roundedRect(50, payY, 500, 180, 10)
    .fillAndStroke("#ffffff", "#e2e8f0");

  doc
    .fillColor("#0f172a")
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("PAYMENT INFORMATION", 65, payY + 15);

  const rowStart = payY + 50;

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#64748b")
    .text("Transaction ID:", 65, rowStart)
    .fillColor("#0f172a")
    .text(appointment.transactionId || "N/A", 350, rowStart);

  doc
    .fillColor("#64748b")
    .text("Payment Mode:", 65, rowStart + 25)
    .fillColor("#0f172a")
    .text(appointment.paymentMethod || "N/A", 350, rowStart + 25);

  doc
    .fillColor("#64748b")
    .text("Payment Status:", 65, rowStart + 50)
    .fillColor("#0f172a")
    .text(appointment.status || "Pending", 350, rowStart + 50);

  // Total Paid Box
  const totalBoxY = rowStart + 85;
  const totalBoxHeight = 55;
  const totalBoxWidth = 480;
  const totalBoxX = 60;

  doc
    .roundedRect(totalBoxX, totalBoxY, totalBoxWidth, totalBoxHeight, 12)
    .fill("#ecfdf5");

  doc
    .fillColor("#065f46")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Total Paid", totalBoxX + 20, totalBoxY + 18);

  doc
    .fillColor("#059669")
    .fontSize(18)
    .text(`Rs. ${appointment.amount || "0"}/-`, totalBoxX, totalBoxY + 16, {
      width: totalBoxWidth - 20,
      align: "right",
    });

  /* ========================= FOOTER================ */
let footerStartY = 620;
// ---- NOTES ----
doc
  .fillColor("#94a3b8")
  .fontSize(12)
  .font("Helvetica");

doc.text(
  "Notes: This is a system-generated medical document issued by Medicare Healthcare Services. It serves as an official record of the appointment and payment transaction.",
  50,
  footerStartY,
  { width: 350 } // keep left side only
);

// Get Y after notes automatically
let afterNotesY = doc.y + 30;


// ---- SIGNATURE LINE ----
const signX = 400;

doc
  .moveTo(signX, afterNotesY)
  .lineTo(signX + 160, afterNotesY)
  .strokeColor("#cbd5e1")
  .stroke();

doc
  .fillColor("#0f172a")
  .fontSize(11)
  .text("Authorized Signature", signX + 10, afterNotesY + 10);

doc
  .fillColor("#64748b")
  .fontSize(10)
  .text(
    appointment.doctorData?.name || "Dr. Authorized",
    signX + 20,
    afterNotesY + 25
  );

doc.end();
}