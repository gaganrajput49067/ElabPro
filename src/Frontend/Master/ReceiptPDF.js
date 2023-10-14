import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import axios from "axios";
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

import { dateConfig } from "../../Frontend/util/DateConfig";
import { Html } from "react-pdf-html";
import { toWords } from "../../Frontend/util/Commonservices";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../Frontend/util/Loading";

function ReceiptPDF() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [load, setLoad] = useState(true);
  const [state, setState] = useState({
    TotalAmount: 0,
    TotalDiscount: 0,
    TotalDueAmount: 0,
    TotalPaidAmount: 0,
  });

  const [pageSetting, setPageSetting] = useState({
    BookingData: [],
    ReceiptData: [],
    SettlementData: [],
    pageData: [],
  });

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
      marginBottom:
        pageSetting?.pageData[0]?.ReportConfiguration?.pageSetup?.MarginBottom,
      marginRight:
        pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.MarginRight,
      marginTop:
        pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.MarginTop,
      marginLeft:
        pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.MarginLeft,
    },
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    header: {
      height:0
        // pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.HeaderHeight,
    },
    footer: {
      height:
        pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.FooterHeight,
    },
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
  const fetch = () => {

    axios
      .post("/api/v1/Receipt/GetReceiptData", {
        LedgerTransactionID: id,
      })
      .then((res) => {
        const response = res?.data?.message;
        if (response) {
          const data = JSON.parse(response?.pageData[0]?.ReportConfiguration);
          const val = [...response?.pageData];
          val[0]["ReportConfiguration"] = data;
          setPageSetting({ ...response, pageData: val });
          setLoad(false);
        } else {
          navigate("/login");
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(pageSetting);

  useEffect(() => {
    let TotalAmount = 0;
    let TotalDiscount = 0;
    let TotalPaidAmount = 0;

    for (let i = 0; i < pageSetting?.ReceiptData.length; i++) {
      TotalAmount = TotalAmount + pageSetting.ReceiptData[i].Rate;
      TotalDiscount =  TotalDiscount + pageSetting.ReceiptData[i].DiscountAmt
    }

    for (let i = 0; i < pageSetting?.SettlementData.length; i++) {
      TotalPaidAmount = TotalPaidAmount + pageSetting?.SettlementData[i].Amount;
    }

    let TotalDueAmount = TotalAmount - Math.floor(TotalDiscount) - TotalPaidAmount;

    setState({
      ...state,
      TotalAmount: TotalAmount,
      TotalDiscount: Math.floor(TotalDiscount),
      TotalDueAmount: TotalDueAmount,
      TotalPaidAmount: TotalPaidAmount,
    });
  }, [pageSetting?.ReceiptData]);

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <PDFViewer style={styles.viewer}>
          {/* Start of the document*/}
          <Document>
            {/*render a single page*/}
            <Page
              size={pageSetting.pageData[0]?.ReportConfiguration?.pageSetup?.PageSize}
              style={styles.page}
              orientation={
                pageSetting.pageData[0]?.ReportConfiguration?.pageSetup
                  ?.PageOrientation
              }
            >
              <View>
                {pageSetting?.pageData[0]?.TemplateID == 1 ? (
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Sr.No.</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Service Code</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Perticulars</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Services</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Departments</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Delivery Date</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Rate</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Rate(Rs.)</Text>
                      </View>
                    </View>
                    <View style={styles.tableRow}>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Sr.No.</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Service Code</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Perticulars</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Services</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Departments</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Delivery Date</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Rate</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Rate(Rs.)</Text>
                      </View>
                    </View>
                  </View>
                ) : pageSetting?.pageData[0]?.TemplateID == 2 ? (
                  <View>
                    <View
                      style={{
                        marginTop: "10px",
                        height:
                          pageSetting.pageData[0]?.ReportConfiguration
                            ?.pageSetup?.HeaderHeight,
                      }}
                    >
                      {pageSetting?.pageData[0]?.ReportConfiguration?.DynamicReportData.map(
                        (ele, index) => (
                          <>
                            <Text
                              key={index}
                              style={{
                                textAlign: "center",
                                // top: ele?.PositionTop,
                                // left: ele?.PositionLeft,
                                // height: ele?.Height,
                                // width: ele?.Width,
                              }}
                            >
                              <Html>{ele?.Text}</Html>
                            </Text>
                            {/* {ele?.ImageData.trim() !== "undefined" && (
                        <Image src={ele?.ImageData} ></Image>
                        // <Html>{`<img src=${ele?.ImageData}/>`}</Html>
                      )} */}
                          </>
                        )
                      )}
                    </View>

                    {pageSetting?.pageData[0]?.ReportConfiguration?.headerSetup?.map(
                      (data, index) =>
                        pageSetting?.BookingData?.map(
                          (ele) =>
                            data?.Print && (
                              <Text
                                style={{
                                  fontSize: data?.FontSize,
                                  fontWeight: data?.Bold,
                                  position: "absolute",
                                  left: data?.Left,
                                  top: data?.Top,
                                }}
                                key={index}
                              >
                                <Text style={{ fontFamily: "Lato Bold" }}>
                                  {data?.LabelDetail} :
                                </Text>{" "}
                                {data?.LabelID === "Date"
                                  ? dateConfig(ele[data?.LabelID])
                                  : ele[data?.LabelID]}
                              </Text>
                            )
                        )
                    )}

                    <View style={[styles.table, { width: "96.5%" }]}>
                      <View
                        style={[
                          styles.tableRow,
                          { borderBottom: "1px", borderTop: "1px" },
                        ]}
                      >
                        <View
                          style={[
                            styles.tableCol,
                            { width: "16%", textAlign: "left" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              { fontFamily: "Lato Bold" },
                            ]}
                          >
                            Sr.No.
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            { width: "16%", textAlign: "left" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              { fontFamily: "Lato Bold" },
                            ]}
                          >
                            Service Code
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.tableCol,
                            { width: "20%", textAlign: "left" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              { fontFamily: "Lato Bold" },
                            ]}
                          >
                            Services
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.tableCol,
                            { width: "16%", textAlign: "right" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              { fontFamily: "Lato Bold" },
                            ]}
                          >
                            Reporting DeliveryDate
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            { width: "16%", textAlign: "right" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              { fontFamily: "Lato Bold" },
                            ]}
                          >
                            Rate
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            { width: "16%", textAlign: "right" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCell,
                              { fontFamily: "Lato Bold" },
                            ]}
                          >
                            Total
                          </Text>
                        </View>
                      </View>
                      {pageSetting?.ReceiptData?.map((data, ind) => (
                        <View style={styles.tableRow} key={ind}>
                          <View
                            style={[
                              styles.tableCol,
                              { width: "16%", textAlign: "left" },
                            ]}
                          >
                            <Text style={styles.tableCell}>{ind + 1}</Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              { width: "16%", textAlign: "left" },
                            ]}
                          >
                            <Text style={styles.tableCell}>
                              {data?.TestCode}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.tableCol,
                              { width: "20%", textAlign: "left" },
                            ]}
                          >
                            <Text style={styles.tableCell}>
                              {data?.InvestigationName}{" "}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.tableCol,
                              { width: "16%", textAlign: "right" },
                            ]}
                          >
                            <Text style={styles.tableCell}>
                              28/Mar/2023 12:56 PM
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              { width: "16%", textAlign: "right" },
                            ]}
                          >
                            <Text style={styles.tableCell}>{data?.Rate}</Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              { width: "16%", textAlign: "right" },
                            ]}
                          >
                            <Text style={styles.tableCell}>{data?.Amount}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "10px",
                        justifyContent: "space-between",
                        width: "96.5%",
                        alignItems: "flex-end",
                      }}
                    >
                      <View
                        style={[
                          styles.table,
                          { marginTop: "20px", width: "80%" },
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
                            <Text
                              style={[styles.tableCell, { textAlign: "right" }]}
                            >
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
                              <Text style={styles.tableCell}>
                                {data?.ReceiptNo}
                              </Text>
                            </View>
                            <View style={[styles.tableCol]}>
                              <Text style={styles.tableCell}>
                                {data?.PaymentMode}
                              </Text>
                            </View>

                            <View style={[styles.tableCol]}>
                              <Text style={styles.tableCell}>
                                {data?.S_Amount}
                              </Text>
                            </View>

                            <View style={[styles.tableCol]}>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { textAlign: "right" },
                                ]}
                              >
                                {data?.Amount}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "800",
                            margin: "3px 0px",
                          }}
                        >
                          Total: {state?.TotalAmount}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "800",
                            margin: "3px 0px",
                          }}
                        >
                          Discount: {state?.TotalDiscount}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "800",
                            margin: "3px 0px",
                          }}
                        >
                          Amount Paid: {state?.TotalPaidAmount}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "800",
                            margin: "3px 0px",
                          }}
                        >
                          Due Amount:{" "}
                          <Html>{`<div style="color:red; font-size:8px" >${state?.TotalDueAmount}</div>`}</Html>
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        borderTop: "1px",
                        marginTop: "10px",
                        width: "96.5%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "8px",
                          marginTop: "4px",
                          fontFamily: "Lato Bold",
                        }}
                      >
                        Received With Thanks: {toWords(state?.TotalAmount)}
                      </Text>
                    </View>
                  </View>
                ) : pageSetting?.pageData[0]?.TemplateID == 5 ? (
                  <View style={{ width: "75%" }}>
                    <View
                      style={{
                        marginTop: "10px",
                        textAlign: "center",
                        height:
                          pageSetting.pageData[0]?.ReportConfiguration
                            ?.pageSetup?.HeaderHeight,
                      }}
                    >
                      {pageSetting?.pageData[0]?.ReportConfiguration?.DynamicReportData.map(
                        (ele, index) => (
                          <Text key={index} style={{ marginTop: "5px" }}>
                            <Html>{ele?.Text}</Html>
                          </Text>
                        )
                      )}
                    </View>

                    {pageSetting?.pageData[0]?.ReportConfiguration?.headerSetup?.map(
                      (data, index) =>
                        pageSetting?.BookingData?.map(
                          (ele) =>
                            data?.Print && (
                              <Text
                                style={{
                                  fontSize: data?.FontSize,
                                  fontWeight: data?.Bold,
                                  position: "absolute",
                                  left: data?.Left,
                                  top: data?.Top,
                                }}
                                key={index}
                              >
                                <Text style={{ fontFamily: "Lato Bold" }}>
                                  {data?.LabelDetail} :
                                </Text>{" "}
                                {data?.LabelID === "Date"
                                  ? dateConfig(ele[data?.LabelID])
                                  : ele[data?.LabelID]}
                              </Text>
                            )
                        )
                    )}
                    <View
                      style={[
                        styles.table,
                        { borderBottom: "1px", paddingBottom: "3px" },
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
                        <View style={styles.tableRow}>
                          <View style={[styles.tableCol, { width: "10%" }]}>
                            <Text
                              style={[styles.tableCell, { textAlign: "left" }]}
                            >
                              {ind + 1}
                            </Text>
                          </View>
                          <View style={[styles.tableCol, { width: "25%" }]}>
                            <Text style={styles.tableCell}>
                              {data?.DepartmentName}
                            </Text>
                          </View>
                          <View style={[styles.tableCol, { width: "25%" }]}>
                            <Text style={styles.tableCell}>
                              {data?.TestCode}
                            </Text>
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
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "10px",
                        justifyContent: "space-between",
                        borderBottom: "1px solid black",
                        paddingBottom: "3px",
                      }}
                    >
                      <View
                        style={[
                          styles.table,
                          { marginTop: "20px", width: "80%" },
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
                            <Text
                              style={[styles.tableCell, { textAlign: "right" }]}
                            >
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
                              <Text style={styles.tableCell}>
                                {data?.ReceiptNo}
                              </Text>
                            </View>
                            <View style={[styles.tableCol]}>
                              <Text style={styles.tableCell}>
                                {data?.PaymentMode}
                              </Text>
                            </View>

                            <View style={[styles.tableCol]}>
                              <Text style={styles.tableCell}>
                                {data?.Amount}
                              </Text>
                            </View>

                            <View style={[styles.tableCol]}>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { textAlign: "right" },
                                ]}
                              >
                                {data?.Amount}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                      <View
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
                          <Text style={{ fontFamily: "Lato Bold" }}>
                            Total:
                          </Text>{" "}
                          {state?.TotalAmount}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            margin: "2px 0px",
                          }}
                        >
                          <Text style={{ fontFamily: "Lato Bold" }}>
                            Discount:
                          </Text>{" "}
                          {state?.TotalDiscount}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            margin: "2px 0px",
                          }}
                        >
                          <Text style={{ fontFamily: "Lato Bold" }}>
                            {" "}
                            Amount Paid:
                          </Text>{" "}
                          {state?.TotalPaidAmount}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            margin: "2px 0px",
                          }}
                        >
                          <Text style={{ fontFamily: "Lato Bold" }}>
                            {" "}
                            Due Amount:
                          </Text>{" "}
                          <Html>{`<div style="color:red; font-size:8px" >${state?.TotalDueAmount}</div>`}</Html>
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: "8px",
                          marginTop: "10px",
                          fontFamily: "Lato Bold",
                        }}
                      >
                        Received With Thanks: {toWords(state?.TotalPaidAmount)}
                      </Text>
                    </View>

                    <View>
                      <View>
                        <Text style={{ fontSize: "8px", marginTop: "10px" }}>
                          * This is a Computer generated document, does not
                          require any signature.
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  ""
                )}
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
}

export default ReceiptPDF;
