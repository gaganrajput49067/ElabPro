import React from "react";
import { useTranslation } from "react-i18next";
const CouponMaster = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">
            {t("Coupon Master")}
          </h3>
        </div>

        <div className="box-body"></div>
      </div>
    </>
  );
};

export default CouponMaster;
