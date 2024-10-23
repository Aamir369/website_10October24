import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (data, fileName, table) => {
  const headers =
    table === "flha"
      ? [
          "Company ID",
          "Company Name",
          "User Name",
          "User Email",
          "PPE Inspected",
          "To Do Work",
          "Site Location",
          "Submitted Date and Time",
          "Environmental Hazards (Flhf)",
          "Ergonomics Hazards",
          "Access/Egress Hazards",
          "Overhead/Underground Hazards",
          "Equipment/Vac Truck Hazards",
          "Personal Limitations Hazards",
          "All Hazard Remaining",
          "All Permits Closed Out",
          "Any Incident",
          "Area Cleaned Up At End",
          "Master Point Location",
          "Permit Job Number",
          "Signature URL",
          "Suggestion Page",
        ]
      : [
          "FullName",
          "Email",
          "CompanyName",
          "BirthDate",
          "CompanyID",
          "CreatedAt",
          "JobID",
          "JoinedDate",
          "ProfilePic",
          "Role",
          "SiteID",
        ];

  const formattedData =
    table === "flha"
      ? data.map((flha) => {
          const dateTimeConversion = (timestamp) => {
            const seconds = timestamp.seconds;
            const nanoseconds = timestamp.nanoseconds;
            const milliseconds = seconds * 1000 + nanoseconds / 1000000;
            const date = new Date(milliseconds);
            const formattedDate = date.toISOString().split("T")[0];
            const timeFormatter = new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
            const formattedTimeIn12Hour = timeFormatter.format(date);
            return `${formattedDate} ${formattedTimeIn12Hour}`;
          };

          return {
            "Company ID": flha.company_id,
            "Company Name": flha.company_name,
            "User Name": flha.user_name,
            "User Email": flha.user_email,
            "PPE Inspected": flha.data.ppe_inspected ? "True" : "False",
            "To Do Work": flha.data.to_do_work,
            "Site Location": flha.data.site_location,
            "Submitted Date and Time": dateTimeConversion(flha.submitted_at),
            "Environmental Hazards (Flhf)": flha.data.flhf.join(", "),
            "Ergonomics Hazards": flha.data.ergonomics.join(", "),
            "Access/Egress Hazards": flha.data.aeHazards.join(", "),
            "Overhead/Underground Hazards": flha.data.ouHazards.join(", "),
            "Equipment/Vac Truck Hazards": flha.data.evtHazards.join(", "),
            "Personal Limitations Hazards": flha.data.plHazards
              .slice(0, -1)
              .join(", "),
            "All Hazard Remaining": flha.data.job_completion
              .all_hazard_remaining
              ? "True"
              : "False",
            "All Permits Closed Out": flha.data.job_completion
              .all_permits_closed_out
              ? "True"
              : "False",
            "Any Incident": flha.data.job_completion.any_incident
              ? "True"
              : "False",
            "Area Cleaned Up At End": flha.data.job_completion
              .area_cleaned_up_at_end
              ? "True"
              : "False",
            "Master Point Location":
              flha.data.job_completion.master_point_location,
            "Permit Job Number": flha.data.permit_job_number,
            "Signature URL": flha.data.signature_url,
            "Suggestion Page": `Pre-Use Inspection Of Tools: ${
              flha.data.suggestionPage.preUseInspectionOfTools
            }\nSuggestions: ${flha.data.suggestionPage.suggestions.join(", ")}`,
          };
        })
      : data.map((user) => ({
          FullName: user.fullName,
          Email: user.email,
          CompanyName: user.companyName,
          BirthDate: user.birthDate,
          CompanyID: user.companyID,
          CreatedAt: user.createdAt,
          JobID: user.jobID,
          JoinedDate: user.joinedDate,
          ProfilePic: user.profilePic,
          Role: user.role,
          SiteID: user.siteID,
        }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    header: headers,
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "FLHA");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = async (data, fileName, table) => {
  const headers =
    table === "flha"
      ? [
          "Company Name",
          "User Name",
          "User Email",
          "PPE Inspected",
          "To Do Work",
          "Site Location",
          "Submitted Date and Time",
          "Environmental Hazards (Flhf)",
          "Ergonomics Hazards",
          "Access/Egress Hazards",
          "Overhead/Underground Hazards",
          "Equipment/Vac Truck Hazards",
          "Personal Limitations Hazards",
          "Signature",
        ]
      : [
          "FullName",
          "Email",
          "CompanyName",
          "BirthDate",
          "CompanyID",
          "CreatedAt",
          "JobID",
          "JoinedDate",
          "ProfilePic",
          "Role",
          "SiteID",
        ];

  const signatureUrl =
    "https://firebasestorage.googleapis.com/v0/b/constructiondata1-d35a0.appspot.com/o/signatures%2F1723351193972.jpg?alt=media&token=c52f5e24-f638-4ff0-9ac9-29f731ead5e0";

  const formattedData =
    table === "flha"
      ? data.map((flha) => {
          const dateTimeConversion = (timestamp) => {
            const seconds = timestamp.seconds;
            const nanoseconds = timestamp.nanoseconds;
            const milliseconds = seconds * 1000 + nanoseconds / 1000000;
            const date = new Date(milliseconds);
            const formattedDate = date.toISOString().split("T")[0];
            const timeFormatter = new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
            const formattedTimeIn12Hour = timeFormatter.format(date);
            return `${formattedDate} ${formattedTimeIn12Hour}`;
          };

          return [
            flha.company_name,
            flha.user_name,
            flha.user_email,
            flha.data.ppe_inspected ? "True" : "False",
            flha.data.to_do_work,
            flha.data.site_location,
            dateTimeConversion(flha.submitted_at),
            `Work area clean: ${flha.data.flhf[0]}\nMaterial storage identified: ${flha.data.flhf[1]}\nDust/Mist/Fumes: ${flha.data.flhf[2]}\nNoise in area: ${flha.data.flhf[3]}\nExtreme temperatures: ${flha.data.flhf[4]}\nSpill potential: ${flha.data.flhf[5]}\nWaste Properly Managed: ${flha.data.flhf[6]}\nExcavation Permit Required: ${flha.data.flhf[7]}\nOther Workers In Area: ${flha.data.flhf[8]}\nWeather Conditions: ${flha.data.flhf[9]}\nMSDS Reviewed: ${flha.data.flhf[10]}`,
            `Awkward body Position: ${flha.data.ergonomics[0]}\nOver extension: ${flha.data.ergonomics[1]}\nProlonged twisting/bending motion: ${flha.data.ergonomics[2]}\nWorking in tight area: ${flha.data.ergonomics[3]}\nLift too heavy / awkward to lift: ${flha.data.ergonomics[4]}\nHands not in line of sight: ${flha.data.ergonomics[5]}\nWorking above your head: ${flha.data.ergonomics[6]}`,
            `Site Access/ road conditions: ${flha.data.aeHazards[0]}\nScaffold (Inspected & Tagged): ${flha.data.aeHazards[1]}\nLadders (tied off): ${flha.data.aeHazards[2]}\nSlips / Trips: ${flha.data.aeHazards[3]}\nHoisting (tools, equipment etc): ${flha.data.aeHazards[4]}\nExcavation (alarms, routes, ph#): ${flha.data.aeHazards[5]}\nConfined space entry permit required: ${flha.data.aeHazards[6]}`,
            `Barricades & signs in place: ${flha.data.ouHazards[0]}\nHole coverings identified: ${flha.data.ouHazards[1]}\nTrenching/underground structures: ${flha.data.ouHazards[2]}\nRig guidelines: ${flha.data.ouHazards[3]}\nPowerlines: ${flha.data.ouHazards[4]}\nFalling Items: ${flha.data.ouHazards[5]}\nHoisting or moving loads overhead: ${flha.data.ouHazards[6]}`,
            `Proper tools for the job: ${flha.data.evtHazards[0]}\nEquipment / tools inspected: ${flha.data.evtHazards[1]}\nTank plumbing: ${flha.data.evtHazards[2]}\nHoses inspected: ${flha.data.evtHazards[3]}\nHigh pressure: ${flha.data.evtHazards[4]}\nHigh temperature fluids: ${flha.data.evtHazards[5]}`,
            `Procedure not available for task: ${flha.data.plHazards[0]}\nConfusing instructions: ${flha.data.plHazards[1]}\nNo training for task or tools to be used: ${flha.data.plHazards[2]}\nFirst time performing the task: ${flha.data.plHazards[3]}\nWorking alone: ${flha.data.plHazards[4]}\nPPE inspected / used properly: ${flha.data.plHazards[5]}`,
          ];
        })
      : data.map((user) => [
          user.fullName,
          user.email,
          user.companyName,
          user.birthDate,
          user.companyID,
          user.createdAt,
          user.jobID,
          user.joinedDate,
          user.profilePic,
          user.role,
          user.siteID,
        ]);

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(6);
  doc.text(
    `Company Name: ${
      table === "flha" ? data[0]?.company_name : data[0]?.companyName
    }`,
    15,
    15
  );
  doc.text(
    `Report Printed By: ${
      table === "flha" ? data[0]?.user_name : data[0]?.fullName
    }`,
    15,
    20
  );

  doc.setLineWidth(0.5);
  doc.line(10, 40, 290, 40);

  autoTable(doc, {
    head: [headers],
    body: formattedData,
    startY: 45,
    theme: "grid",
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      fontSize: 5,
      valign: "middle",
      halign: "center",
    },
    bodyStyles: {
      fillColor: [245, 245, 245],
      textColor: 50,
      fontSize: 4,
      valign: "middle",
      halign: "center",
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    margin: { top: 25, bottom: 25 },
    styles: {
      overflow: "linebreak",
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      10: { cellWidth: 20, cellHeight: 20 }, // Adjust the column width for the signature
    },
    didDrawCell: async (data) => {
      if (data.column.index === 13 && data.row.index >= 0) {
        const img = new Image();
        img.src = data?.data?.signature || signatureUrl;
        doc.addImage(
          img,
          "JPEG",
          data.cell.x,
          data.cell.y,
          data.column.width,
          data.row.height
        );
      }
    },
  });

  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, 148, 207, { align: "center" });
  }

  doc.save(`${fileName}.pdf`);
};

// Helper function to fetch the logo as a base64 image
async function getBase64LogoFromFirebase() {
  // Simulate fetching a logo
  return new Promise((resolve) => {
    const base64Logo = "data:image/png;base64,..."; // Replace with your base64 logo
    resolve(base64Logo);
  });
}
