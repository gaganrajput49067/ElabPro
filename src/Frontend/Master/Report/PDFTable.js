import React, { useState } from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";

function PDFTable({ data }) {
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
    table: {
      display: "table",
      width: "auto",
      // paddingBottom:100,
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: "auto",
      marginTop: 5,
      fontSize: 8,
    },
  });

  return (
    <View style={styles.table} >
      <View style={styles.tableRow} >
        {["Test Name", "Result", "Unit(s)", "Reference Range", "Method"].map(
          (ele, index) => (
            <View style={styles.tableCol} key={index} >
              <Text style={[styles.tableCell,{fontFamily:"Lato Bold"}]}>{ele}</Text>
            </View>
          )
        )}
      </View>
      {data?.map((ele, index) => (
        <View style={styles.tableRow} key={index}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ele?.TestName}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ele?.VALUE} </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>2019-02-20 - 2020-02-19</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>5€</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ele?.MethodName}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default PDFTable;
