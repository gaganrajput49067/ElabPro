import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { useTranslation } from "react-i18next";



ChartJS.register(ArcElement, Tooltip, Legend);

function Chat2({ state }) {
 
  const { t } = useTranslation();

  const data = {
    labels: [
      t("Sample Collected"),
      t("Sample Not Collected"),
      t("Sample Received"),
      t("Sample Rejected"),
      t("Sample Approved"),
    ],
    datasets: [
      {
        data: [
          state?.SampleCollectionCount,
          state?.NotCollectedCount,
          state?.DepartmentReceiveCount,
          state?.RejectedCount,
          state?.ApprovedCount,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Doughnut data={data} />;
}

export default Chat2;
