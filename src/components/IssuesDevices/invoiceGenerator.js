import React from "react";

const Invoice = () => {
  const invoiceData = {
    invoiceNumber: "GST/24-25/05/233",
    invoiceDate: "07/05/2024",
    invoicePeriod: "May-2024",
    sender: {
      name: "Watsoo Express Pvt. Ltd.",
      address:
        "Plot No. 872, 1st Floor, Udyog Vihar, Phase -5, Gurgaon, Haryana - 122016",
      GSTIN: "06AACCW0191M1Z5",
      PAN: "AACCW0191M",
    },
    recipient: {
      name: "Srijana Gurung",
      address: "T.N.Road Sonada, Dist Darjeeling, West Bengal",
      GSTIN: "URP",
      state: "WEST BENGAL",
      stateCode: "19",
    },
    items: [
      {
        description: "Sim Cost Charges for 1 Year Renewal Qty-1",
        quantity: 1,
        rate: 1700,
        HSN: "998422",
        taxableValue: 1700,
        CGST: 0,
        SGST: 0,
        IGST: 306,
        total: 2006,
      },
    ],
    bankDetails: {
      accountNumber: "920030066126416",
      IFSC: "UTIB0003102",
      bankName: "AXIS BANK",
      authorizedSignatory: "Watsoo Express Pvt. Ltd.",
    },
  };

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #000",
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.5,
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    section: {
      marginBottom: "20px",
    },
    bold: {
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
    },
    th: {
      border: "1px solid #000",
      padding: "8px",
      backgroundColor: "#f2f2f2",
    },
    td: {
      border: "1px solid #000",
      padding: "5px",
      verticalAlign: "top",
    },
    footer: {
      textAlign: "right",
    },
    headerLogo: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #000",
      paddingBottom: "10px",
      marginBottom: "20px",
    },
    headerDetails: {
      textAlign: "right",
    },
    tableContainer: {
      width: "100%",
      border: "1px solid #000",
      borderCollapse: "collapse",
    },
    tableRow: {
      border: "1px solid #000",
    },
    tableCell: {
      border: "1px solid #000",
      padding: "5px",
      verticalAlign: "top",
    },
    totalRow: {
      borderTop: "1px solid #000",
      fontWeight: "bold",
    },
    footerSignature: {
      marginTop: "20px",
      textAlign: "right",
    },
    bankDetails: {
      display: "flex",
      justifyContent: "space-between",
      border: "1px solid #000",
      paddingTop: "10px",
      marginTop: "25px",
    },
    bankDetailsColumn: {
      width: "45%",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerLogo}>
        <div>
          <img
            src="https://www.watsoo.com/wp-content/uploads/2018/07/Logowhite.png"
            alt="Watsoo Express Pvt. Ltd."
            width="150"
          />
        </div>
        <div style={styles.headerDetails}>
          <h2>WATSOO EXPRESS PVT LTD</h2>
          <p>Web: www.watsoo.com</p>
          <p>CIN: U74999DL2017PTC318683</p>
        </div>
      </div>
      <h1 style={styles.header}>Tax Invoice</h1>
      <table style={styles.tableContainer}>
        <tbody>
          <tr>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Name:</span> Watsoo Express Pvt. Ltd.
            </td>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Invoice No:</span>{" "}
              {invoiceData.invoiceNumber}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Address:</span>{" "}
              {invoiceData.sender.address}
            </td>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Invoice Date:</span>{" "}
              {invoiceData.invoiceDate}
            </td>
          </tr>
          <tr>
            <td style={styles.tableCell}>
              <span style={styles.bold}>PAN No:</span> {invoiceData.sender.PAN}
            </td>
            <td style={styles.tableCell}>
              <span style={styles.bold}>GSTIN:</span> {invoiceData.sender.GSTIN}
            </td>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Invoice Period:</span>{" "}
              {invoiceData.invoicePeriod}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>State:</span> Haryana, State Code : 06
            </td>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Reverse Charge (Y/N):</span> N
            </td>
          </tr>
          <tr>
            <td colSpan="4" style={{ ...styles.tableCell, ...styles.bold }}>
              Bill to Party
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Name:</span>{" "}
              {invoiceData.recipient.name}
            </td>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>State Code:</span>{" "}
              {invoiceData.recipient.stateCode}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>Address:</span>{" "}
              {invoiceData.recipient.address}
            </td>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>State:</span>{" "}
              {invoiceData.recipient.state}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={styles.tableCell}>
              <span style={styles.bold}>GSTIN:</span>{" "}
              {invoiceData.recipient.GSTIN}
            </td>
            <td colSpan="2" style={styles.tableCell}></td>
          </tr>
        </tbody>
      </table>
      <table style={styles.tableContainer}>
        <thead>
          <tr>
            <th style={styles.th}>S. No.</th>
            <th style={styles.th}>Product Description</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Rate</th>
            <th style={styles.th}>HSN/SAC Code</th>
            <th style={styles.th}>Taxable Value</th>
            <th style={styles.th}>CGST (9%)</th>
            <th style={styles.th}>SGST (9%)</th>
            <th style={styles.th}>IGST (18%)</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{item.description}</td>
              <td style={styles.td}>{item.quantity}</td>
              <td style={styles.td}>{formatCurrency(item.rate)}</td>
              <td style={styles.td}>{item.HSN}</td>
              <td style={styles.td}>{formatCurrency(item.taxableValue)}</td>
              <td style={styles.td}>{formatCurrency(item.CGST)}</td>
              <td style={styles.td}>{formatCurrency(item.SGST)}</td>
              <td style={styles.td}>{formatCurrency(item.IGST)}</td>
              <td style={styles.td}>{formatCurrency(item.total)}</td>
            </tr>
          ))}
          <tr style={styles.totalRow}>
            <td colSpan="5" style={styles.td}>
              Total Amount Before Tax
            </td>
            <td style={styles.td}>
              {formatCurrency(
                invoiceData.items.reduce(
                  (acc, item) => acc + item.taxableValue,
                  0
                )
              )}
            </td>
            <td style={styles.td}>
              {formatCurrency(
                invoiceData.items.reduce((acc, item) => acc + item.CGST, 0)
              )}
            </td>
            <td style={styles.td}>
              {formatCurrency(
                invoiceData.items.reduce((acc, item) => acc + item.SGST, 0)
              )}
            </td>
            <td style={styles.td}>
              {formatCurrency(
                invoiceData.items.reduce((acc, item) => acc + item.IGST, 0)
              )}
            </td>
            <td style={styles.td}>
              {formatCurrency(
                invoiceData.items.reduce((acc, item) => acc + item.total, 0)
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <div style={styles.footer}>
        <p>
          <span style={styles.bold}>Amount (In words):</span> Two Thousand Six
          Only
        </p>
      </div>
      <div style={styles.bankDetails}>
        <div
          style={{
            ...styles.bankDetailsColumn,
            padding: "0px 5px",
            borderRight: "1px solid #000",
          }}
        >
          <p>
            <span style={styles.bold}>Bank Details:</span>{" "}
            {/* {invoiceData.bankDetails.bankName} */}
          </p>
          <p>
            <span style={styles.bold}>Name:</span>{" "}
            {"Watsoo express private limited"}
          </p>
          <p>
            <span style={styles.bold}>Bank Name:</span>{" "}
            {invoiceData.bankDetails.bankName}
          </p>
          <p>
            <span style={styles.bold}>Bank A/C:</span>{" "}
            {invoiceData.bankDetails.accountNumber}
          </p>
          <p>
            <span style={styles.bold}>Bank IFSC:</span>{" "}
            {invoiceData.bankDetails.IFSC}
          </p>
        </div>
        <div
          style={{
            // ...styles.bankDetailsColumn,

            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            alignSelf: "flex-start",
          }}
        >
          <p style={styles.footerSignature}>For Watsoo Express Pvt. Ltd.</p>
          <p style={{ ...styles.footerSignature, ...styles.bold }}>
            {invoiceData.bankDetails.authorizedSignatory}
          </p>
          <p style={styles.bold}>Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
