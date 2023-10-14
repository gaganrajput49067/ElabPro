import { Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { Document, PDFViewer, Page, View } from "@react-pdf/renderer";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { dateConfig } from "../../Frontend/util/DateConfig";
import { Font } from "@react-pdf/renderer";

function ReceiptPDFDynamic() {
  const [pageSetting, setPageSetting] = useState({
    BookingData: [],
    ReceiptData: [],
    SettlementData: [],
    pageData: [],
  });
  const fetch = () => {
    axios
      .post("/api/v1/Receipt/GetReceiptData", {
        LedgerTransactionID: "abf13d01-67bd-4f1a-a724-d93b6d03c8ad",
      })
      .then((res) => {
        const response = res?.data?.message;
        const data = JSON.parse(response?.pageData[0]?.ReportConfiguration);
        const val = [...response?.pageData];
        val[0]["ReportConfiguration"] = data;
        setPageSetting({ ...response, pageData: val });
      })
      .catch((err) => console.log(err));
  };

  console.log(pageSetting);

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
    page: {
      backgroundColor: "white",
      color: "black",
      paddingBottom:
        pageSetting?.pageData[0]?.ReportConfiguration?.pageSetup?.MarginBottom,
      paddingRight:
        pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.MarginRight,
      paddingTop:
        pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.MarginTop,
      paddingLeft:
        pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.MarginLeft,
    },
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    // header: {
    //   height:
    //     pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.HeaderHeight,
    // },
    // footer: {
    //   height:
    //     pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.FooterHeight,
    // },
    table: {
      display: "table",
      width: "100%",
      textAlign: "left",
    },
    tableRow: {
      flexDirection: "row",
      borderStyle: "solid",
      fontSize: 9,
    },
    tableCol: {
      width: "65px",
      fontSize: "8px",
    },
    tableCell: {
      marginTop: 5,
      fontSize: 8,
    },
  });

  useEffect(() => {
    fetch();
  }, []);

  const positionSet = () => {
    let lastTopPosition = 0;
    pageSetting?.pageData[0]?.ReportConfiguration?.headerSetup?.map((ele) => {
      if (ele.Top > lastTopPosition) {
        lastTopPosition = ele?.Top;
      }
    });
    return lastTopPosition + 10;
  };

  console.log(pageSetting?.pageSetup?.PageSize);

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page
          size={
            pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.PageSize
          }
          orientation={
            pageSetting.pageData[0]?.ReportConfiguration?.pageSetup
              ?.PageOrientation
          }
          //  style={styles.page}
        >
          <View>
            {/* <Text style={{ position: "fixed", top: "100px", left: "200px" }}> */}
            {/* {pageSetting?.pageData[0]?.ReportConfiguration?.headerSetup?.map(
              (data, index) =>
                pageSetting?.BookingData?.map(
                  (ele) =>
                    data?.Print && (
                      <>
                        <Text
                          style={{
                            fontSize: data?.FontSize,
                            fontWeight: data?.Bold,
                            position: "absolute",
                            left: `${data?.Left}pt`,
                            top: `${data?.Top}pt`,
                          }}
                          key={index}
                        >
                          {data?.LabelDetail} :
                          {data?.LabelID === "Date"
                          ? dateConfig(ele[data?.LabelID])
                          : ele[data?.LabelID]}
                        </Text>

                        <Text
                          style={{
                            fontSize: data?.FontSize,
                            fontWeight: data?.Bold,
                            position: "absolute",
                            left: `${data?.DetailXPosition}pt`,
                            top: `${data?.Top}pt`,
                          }}
                          key={index}
                        >
                          {data?.LabelID === "Date"
                            ? dateConfig(ele[data?.LabelID])
                            : ele[data?.LabelID]}
                        </Text>
                      </>
                    )
                )
            )} */}

            <View
              style={[
                styles.table,
                {
                  //   borderBottom: "1px",
                  paddingBottom: "3px",
                  //   top: positionSet(),
                },
                styles.page,
              ]}
            >
              <View
                style={[
                  styles.tableRow,
                  {
                    borderBottom: "1px",
                    borderTop: "1px",
                    fontFamily: "Lato Bold",
                  },
                ]}
              >
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text style={[styles.tableCell]}>Sr.No.</Text>
                </View>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text style={styles.tableCell}>Department</Text>
                </View>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text style={styles.tableCell}>TestCode</Text>
                </View>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text style={styles.tableCell}>Test Name</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "25%", textAlign: "right" },
                  ]}
                >
                  <Text style={styles.tableCell}>Test Rate</Text>
                </View>
              </View>
              {pageSetting?.ReceiptData?.map((data, ind) => (
                <View style={styles.tableRow} key={ind}>
                  <View style={[styles.tableCol, { width: "10%" }]}>
                    <Text style={[styles.tableCell, { textAlign: "left" }]}>
                      {ind + 1}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, { width: "25%" }]}>
                    <Text style={styles.tableCell}>{data?.DepartmentName}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "25%" }]}>
                    <Text style={styles.tableCell}>{data?.TestCode}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "25%" }]}>
                    <Text style={styles.tableCell}>
                      {data?.InvestigationName}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCol,
                      { width: "25%", textAlign: "right" },
                    ]}
                  >
                    <Text style={styles.tableCell}>
                      {Math.round(data?.Rate)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={[
                styles.page,
                {
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "10px",
                  justifyContent: "space-between",
                //   borderBottom: "1px solid black",
                  paddingBottom: "3px",
                },
              ]}
            >
              <View style={[styles.table, { marginTop: "20px", width: "80%" }]}>
                <View
                  style={[
                    styles.tableRow,
                    {
                      borderBottom: "1px",
                      borderTop: "1px",
                      fontFamily: "Lato Bold",
                    },
                  ]}
                >
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>Settlement</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.tableCell}>Payment</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.tableCell}>Receipt No</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.tableCell}>Mode</Text>
                  </View>

                  <View style={[styles.tableCol]}>
                    <Text style={styles.tableCell}>Amount</Text>
                  </View>

                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell, { textAlign: "right" }]}>
                      TotalAmount
                    </Text>
                  </View>
                </View>
                {pageSetting?.SettlementData?.map((data, ind) => (
                  <View style={styles.tableRow} index={ind}>
                    <View style={[styles.tableCol]}>
                      <Text style={styles.tableCell}>Settlement</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={styles.tableCell}>
                        {dateConfig(data?.strEntryDateTime)}
                      </Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={styles.tableCell}>{data?.ReceiptNo}</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={styles.tableCell}>{data?.PaymentMode}</Text>
                    </View>

                    <View style={[styles.tableCol]}>
                      <Text style={styles.tableCell}>{data?.Amount}</Text>
                    </View>

                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell, { textAlign: "right" }]}>
                        {data?.Amount}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              {/* <View
                style={{
                  marginTop: "20px",
                  textAlign: "right",
                  width: "30%",
                }}
              >
                <Text
                  style={{
                    fontSize: "8px",
                    margin: "2px 0px",
                  }}
                >
                  <Text style={{ fontFamily: "Lato Bold" }}>Total:</Text>{" "}
                  {state?.TotalAmount}
                </Text>
                <Text
                  style={{
                    fontSize: "8px",
                    margin: "2px 0px",
                  }}
                >
                  <Text style={{ fontFamily: "Lato Bold" }}>Discount:</Text>{" "}
                  {state?.TotalDiscount}
                </Text>
                <Text
                  style={{
                    fontSize: "8px",
                    margin: "2px 0px",
                  }}
                >
                  <Text style={{ fontFamily: "Lato Bold" }}> Amount Paid:</Text>{" "}
                  {state?.TotalPaidAmount}
                </Text>
                <Text
                  style={{
                    fontSize: "8px",
                    margin: "2px 0px",
                  }}
                >
                  <Text style={{ fontFamily: "Lato Bold" }}> Due Amount:</Text>{" "}
                  <Html>{`<div style="color:red; font-size:8px" >${state?.TotalDueAmount}</div>`}</Html>
                </Text>
              </View> */}
            </View>
            {/* </Text> */}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default ReceiptPDFDynamic;
