import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";
import axios from "axios";
import report from "./reportImages/report.jpeg";
import { dateConfig } from "../../util/DateConfig";
import PDFTable from "./PDFTable";

const PatientLeftSideData = [
  { label: "Patient Data : ", value: "PName" },
  { label: "DOB/Age/Gender : ", value: "Age" },
  { label: "Patient ID / UHID : ", value: "PatientCode" },
  { label: "Referred By : ", value: "ReferDoctor" },
  { label: "Sample Type : ", value: "PName" },
  { label: "Barcode No : ", value: "SINNo" },
];

const PatientRightSideData = [
  { label: "", value: "" },
  { label: "Bill Date : ", value: "RegDate" },
  { label: "Sample Collected : ", value: "SampleDate" },
  { label: "Sample Received : ", value: "SampleReceiveDate" },
  { label: "Report Date : ", value: "ApprovedDate" },
  { label: "Report Status : ", value: "Status" },
];

function ReprintPDF() {
  const [PDFData, setPDFData] = useState([]);

  Font.register({
    family: "Open Sans",
    src: `https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf`,
  });

  Font.register({
    family: "Lato",
    src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
  });

  Font.register({
    family: "Lato Italic",
    src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
  });

  Font.register({
    family: "Lato Bold",
    src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
  });

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },

    mt3: {
      marginTop: "15px",
    },
    page: {
      flexDirection: "column",
    },

    section: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },

    patientDetailSection: {
      width: "100%",
      padding: "0px 50px",
      top: "15%",
    },
    DisplayFlex: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    patientDetailStyle: {
      fontSize: "9px",
      flexDirection: "row",
      fontWeight: "bold",
      padding: "2px 0px",
    },
  });

  const fetch = () => {
    axios
      .post("/api/v1/receipt/getReceiptData", {
        LedgerTransactionID: "6bc1863a-7a56-dbca-67fc-8e59-51ea1a7e",
      })
      .then((res) => {
        setPDFData(res?.data?.message?.pageData);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handlePatientDetailsSection = (data) => {
    return data.map((ele, index) => (
      <View style={styles.patientDetailStyle} key={index}>
        <Text style={{ fontFamily: "Lato Bold" }}>{ele.label} </Text>
        <Text>
          {[
            "Bill Date : ",
            "Sample Collected : ",
            "Sample Received : ",
            "Report Date : ",
          ].includes(ele?.label)
            ? dateConfig(PDFData[0]?.[ele?.value])
            : PDFData[0]?.[ele?.value]}
        </Text>
      </View>
    ));
  };

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.section} fixed>
            <Image src={report} />
          </View>

          <View style={styles.patientDetailSection}>
            <View style={styles.DisplayFlex} fixed>
              <View>{handlePatientDetailsSection(PatientLeftSideData)}</View>
              <View>{handlePatientDetailsSection(PatientRightSideData)}</View>
            </View>

            <View style={styles.mt3}>
              <View style={styles.patientDetailStyle}>
                <PDFTable data={PDFData} />
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default ReprintPDF;
