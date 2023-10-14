import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function GetLabReport() {
  const location = useLocation();
  const { state } = location;
  const [HeaderData, setHeaderData] = useState([]);

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
      fontSize: "12px",
      paddingBottom:
        state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
          ?.MarginBottom,
      paddingRight:
        state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
          ?.MarginRight,
      paddingTop:
        state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
          ?.MarginTop,
      paddingLeft:
        state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
          ?.MarginLeft,
    },
    header: {
      height:
        state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
          ?.HeaderHeight,
    },
    footer: {
      height:
        state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
          ?.FooterHeight,
    },
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },

    table: {
      display: "table",
      width: "100%",
      textAlign: "left",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },
    tableRow: {
      flexDirection: "row",

      fontSize: 11,
    },
    tableCol: {
      width: "55px",
      fontSize: "8px",
    },
    tableCell: {
      marginTop: 5,
      fontSize: 9,
      padding: 5,
    },
  });

  const FindOne = () => {
    let id = "";
    let data = state?.data?.LabReport.filter((ele) => {
      if (ele.TestID !== id) {
        id = ele?.TestID;
        return ele;
      } else {
        id = ele?.TestID;
      }
    });
    setHeaderData(data);
  };

  useEffect(() => {
    FindOne();
  }, []);

  console.log(state?.data?.ReportSetting[0]?.ReportConfiguration?.headerSetup?.headerSetupData);

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page
          size={
            state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
              ?.PageSize
          }
          style={styles.page}
          orientation={
            state?.data?.ReportSetting[0]?.ReportConfiguration?.PageSetup
              ?.PageOrientation
          }
        >
          <View fixed style={[styles?.header]}>
            <Text>Header 1</Text>
          </View>

          <View
            fixed
            style={{
              
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "47%", border: "1px", padding: "4px" }}>
              {state?.data?.ReportSetting[0]?.ReportConfiguration?.headerSetup?.headerSetupData.map(
                (data, index) =>
                  data?.Print == 1 && (
                    <Text
                      style={{
                        // top: data?.Top,
                        // left: data?.Left,
                        fontSize: data?.FontSize,
                        // position: "absolute",
                      }}
                      key={index}
                    >
                      <Text style={{ fontFamily: "Lato Bold" }}>
                        {data?.LabelDetail}
                      </Text>{" "}
                      : {data?.LabelDetail}
                    </Text>
                  )
              )}
            </View>

            <View style={{ width: "47%", border: "1px", padding: "4px" }}>
              {state?.data?.ReportSetting[0]?.ReportConfiguration?.headerSetup?.headerSetupData.map(
                (data, index) =>
                  data?.Print == 1 && (
                    <Text
                      style={{
                        // top: data?.Top,
                        // left: data?.Left,
                        fontSize: data?.FontSize,
                        // position: "absolute",
                      }}
                      key={index}
                    >
                      <Text style={{ fontFamily: "Lato Bold" }}>
                        {data?.LabelDetail}
                      </Text>{" "}
                      : {data?.LabelDetail}
                    </Text>
                  )
              )}
            </View>
          </View>

          {/* header Table */}
          {HeaderData.map((ele, index) => (
            <View break={index > 0 ? true : false}>
              <View style={{ marginTop: "20px" }} key={index}>
                <View style={[styles.table]}>
                  <View style={[styles.tableRow, { borderBottom: "1px" }]}>
                    <View
                      style={[
                        styles.tableCol,
                        { width: "100%", textAlign: "center" },
                      ]}
                    >
                      <Text
                        style={[styles.tableCell, { fontFamily: "Lato Bold" }]}
                      >
                        {ele?.Department}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.tableRow, { fontFamily: "Lato Bold" }]}>
                    <View
                      style={[
                        styles.tableCol,
                        {
                          width: "40%",
                          textAlign: "center",
                          borderRight: "1px",
                        },
                      ]}
                    >
                      <Text style={styles.tableCell}>Test Name</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCol,
                        {
                          width: "15%",
                          textAlign: "center",
                          borderRight: "1px",
                        },
                      ]}
                    >
                      <Text style={styles.tableCell}>Result</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCol,
                        {
                          width: "15%",
                          textAlign: "center",
                          borderRight: "1px",
                        },
                      ]}
                    >
                      <Text style={styles.tableCell}>Unit </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCol,
                        {
                          width: "15%",
                          textAlign: "center",
                          borderRight: "1px",
                        },
                      ]}
                    >
                      <Text style={styles.tableCell}>Bio. Ref. Range</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCol,
                        { width: "15%", textAlign: "center" },
                      ]}
                    >
                      <Text style={styles.tableCell}>Method</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ marginTop: "10px" }}>
                <View style={[styles.table]}>
                  <View style={[styles.tableRow, { borderBottom: "1px" }]}>
                    <View
                      style={[
                        styles.tableCol,
                        { width: "100%", textAlign: "center" },
                      ]}
                    >
                      <Text
                        style={[styles.tableCell, { fontFamily: "Lato Bold" }]}
                      >
                        {ele?.ProfileName}
                      </Text>
                    </View>
                  </View>
                  {state?.data?.LabReport.map(
                    (data, ind) =>
                      data?.TestID === ele?.TestID && (
                        <View
                          style={[
                            styles.tableRow,
                            { fontFamily: "Lato Bold", borderBottom: "1px" },
                          ]}
                          key={ind}
                        >
                          <View
                            style={[
                              styles.tableCol,
                              {
                                width: "40%",
                                textAlign: "center",
                                borderRight: "1px",
                              },
                            ]}
                          >
                            <Text style={styles.tableCell}>
                              {data?.LabObservationName
                                ? data?.LabObservationName
                                : "No Data"}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                width: "15%",
                                textAlign: "center",
                                borderRight: "1px",
                              },
                            ]}
                          >
                            <Text style={styles.tableCell}>
                              {data?.VALUE ? data?.VALUE : "-"}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                width: "15%",
                                textAlign: "center",
                                borderRight: "1px",
                              },
                            ]}
                          >
                            <Text style={styles.tableCell}>{data?.Unit} </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                width: "15%",
                                textAlign: "center",
                                borderRight: "1px",
                              },
                            ]}
                          >
                            <Text style={styles.tableCell}>
                              {data?.ReferenceRange
                                ? data?.ReferenceRange
                                : "-"}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              { width: "15%", textAlign: "center" },
                            ]}
                          >
                            <Text style={styles.tableCell}>-</Text>
                          </View>
                        </View>
                      )
                  )}
                </View>
              </View>
            </View>
          ))}

          <Text
            render={({ pageNumber, totalPages }) =>
              `Page No : ${pageNumber} / ${totalPages}`
            }
            style={{
              position: "absolute",
              bottom: "20px",
              textAlign: "center",
              fontSize: "8px",
              width: "100%",
            }}
            fixed
          />
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default GetLabReport;
