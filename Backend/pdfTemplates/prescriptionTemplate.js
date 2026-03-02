export const prescriptionHTMLTemplate = (appointment) => {
return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Summary</title>
    <style>
        /* Base & Reset */
        body {
            font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
            background-color: #f1f5f9;
            color: #334155;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        /* Main Document Wrapper */
        .document {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 50px 60px;
            border-radius: 16px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
        }

        /* Header Section */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px dashed #e2e8f0;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }

        .clinic-info img {
            height: 45px;
            margin-bottom: 12px;
        }

        .clinic-info p {
            margin: 2px 0;
            font-size: 14px;
            color: #64748b;
        }

        .meta-info {
            text-align: right;
        }

        .meta-info h2 {
            margin: 0 0 15px 0;
            color: #0f172a;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }

        .meta-info p {
            margin: 4px 0;
            font-size: 14px;
            color: #475569;
        }

        .meta-info strong {
            color: #94a3b8;
            font-weight: 500;
            margin-right: 5px;
        }

        /* DETAILS GRID - Modern Cards */
        .details-grid {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 40px;
        }

        .details-col {
            flex: 1;
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 24px;
        }

        .details-col h3 {
            font-size: 13px;
            color: #10b981;
            /* Modern Emerald Green */
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 700;
            margin: 0 0 16px 0;
        }

        .details-row {
            display: flex;
            margin-bottom: 12px;
            font-size: 14px;
        }

        .details-row:last-child {
            margin-bottom: 0;
        }

        .details-label {
            font-weight: 500;
            color: #64748b;
            width: 90px;
            flex-shrink: 0;
        }

        .details-value {
            color: #0f172a;
            font-weight: 500;
        }

        /* INVOICE/PAYMENT SECTION */
        .payment-section {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 50px;
        }

        .payment-header {
            background-color: #f8fafc;
            padding: 16px 24px;
            border-bottom: 1px solid #e2e8f0;
            font-weight: 600;
            color: #0f172a;
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .payment-body {
            padding: 10px 24px;
            background-color: #ffffff;
        }

        .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 14px 0;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 14px;
        }

        .payment-row:last-child {
            border-bottom: none;
        }

        .payment-row .label {
            color: #64748b;
            font-weight: 500;
        }

        .payment-row .value {
            color: #0f172a;
            font-weight: 600;
            text-align: right;
        }

        .payment-total {
            background-color: #ecfdf5;
            /* Very light green */
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .payment-total .label {
            color: #065f46;
            font-weight: 700;
            font-size: 16px;
        }

        .payment-total .value {
            color: #059669;
            font-weight: 800;
            font-size: 20px;
        }

        /* Footer & Signature */
        .footer-area {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 30px;
        }

        .disclaimer {
            font-size: 13px;
            color: #94a3b8;
            max-width: 350px;
            line-height: 1.5;
        }

        .signature-box {
            text-align: center;
            width: 220px;
        }

        .signature-line {
            border-top: 2px solid #cbd5e1;
            margin-bottom: 12px;
        }

        .signature-box p {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .signature-box .sub-text {
            font-weight: 400;
            color: #64748b;
            font-size: 13px;
            margin-top: 4px;
        }

        /* Mobile Responsive */
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }

            .document {
                padding: 30px 20px;
                border-radius: 12px;
            }

            .header,
            .details-grid,
            .footer-area {
                flex-direction: column;
                gap: 24px;
            }

            .meta-info {
                text-align: left;
            }

            .signature-box {
                width: 100%;
                margin-top: 30px;
            }
        }

        /* Print Styles */
        @media print {
            body {
                background-color: #ffffff;
                padding: 0;
            }

            .document {
                box-shadow: none;
                border: none;
                padding: 0;
                max-width: 100%;
            }

            .payment-section {
                break-inside: avoid;
            }
        }
    </style>
</head>

<body>

    <div class="document">

        <div class="header">
            <div class="clinic-info">
                <img src="https://res.cloudinary.com/dozq9qzhh/image/upload/v1769458899/logo_wkn1e5.png"
                    alt="Medicare Logo" />
                <p><strong>Medicare Healthcare Services</strong></p>
                <p>Bangalore, Karnataka, India</p>
                <p>Contact: +91 9876543210</p>
            </div>
            <div class="meta-info">
                <h2>PRESCRIPTION</h2>
                <p><strong>ID:</strong> ${appointment._id}</p>
                <p><strong>Date:</strong> ${appointment.slotDate}</p>
                <p><strong>Time:</strong> ${appointment.slotTime}</p>
            </div>
        </div>

        <div class="details-grid">
            <div class="details-col">
                <h3>Patient Details</h3>
                <div class="details-row">
                    <span class="details-label">Name : </span>
                    <span class="details-value">${appointment.userData?.name || "N/A"}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Email : </span>
                    <span class="details-value">${appointment.userData?.email || "N/A"}</span>
                </div>
            </div>

            <div class="details-col">
                <h3>Consulting Doctor</h3>
                <div class="details-row">
                    <span class="details-label">Doctor : </span>
                    <span class="details-value">${appointment.doctorData?.name || "N/A"}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Speciality : </span>
                    <span class="details-value">${appointment.doctorData?.speciality || "General Physician"}</span>
                </div>
            </div>
        </div>

        <div class="payment-section">
            <div class="payment-header">
                Payment Information
            </div>
            <div class="payment-body">
                <div class="payment-row">
                    <span class="label">Transaction ID : </span>
                    <span class="value">${appointment.transactionId || "N/A"}</span>
                </div>
                <div class="payment-row">
                    <span class="label">Payment Mode : </span>
                    <span class="value">${appointment.paymentMethod || "N/A"}</span>
                </div>
                <div class="payment-row">
                    <span class="label">Payment Status : </span>
                    <span class="value">${appointment.status || "Pending"}</span>
                </div>
            </div>
            <div class="payment-total">
                <span class="label">Total Paid : </span>
                <span class="value">₹${appointment.amount || "0"}</span>
            </div>
        </div>

        <div class="footer-area">
            <div class="disclaimer">
                <span style="font-weight: 900;">Notes: </span> This is a system-generated medical document issued by
                Medicare Healthcare Services. It serves as an official record of the appointment and payment transaction
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <p>Authorized Signature</p>
                <p class="sub-text">${appointment.doctorData?.name}</p>
            </div>
        </div>

    </div>

</body>

</html>
`;
};