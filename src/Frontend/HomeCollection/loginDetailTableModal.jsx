import React from 'react'
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Loading from '../util/Loading';
import { useTranslation } from "react-i18next";


const LoginDetailTableModal = ({
    show,
    handleClose,
    data,
}) => {

    // for translation
    const { t } = useTranslation();

    console.log(data)
    return (
        <Modal show={show} size='lg'>
            <Modal.Header className='modal-header'>
                <Modal.Title className='modal-title'>
                    Details
                </Modal.Title>
                <button type='button' className='close' onClick={handleClose}>x</button>
            </Modal.Header>
            <Modal.Body>
                <div
                    className="box-body divResult boottable table-responsive"
                    id="no-more-tables" >
                    <div className="row">
                        <table
                            className="table table-bordered table-hover table-striped tbRecord "
                            cellPadding="{0}"
                            cellSpacing="{0}"
                        >
                            <thead className="cf text-center" style={{ zIndex: 99 }}>
                                <tr>
                                    <th className="text-center">{t("#")}</th>
                                    <th className="text-center">{t("DateTime")}</th>
                                    <th className="text-center">{t("Battery")}</th>
                                    <th className="text-center">{t("Status")}</th>
                                    <th className="text-center">{t("PreBookingID")}</th>
                                </tr>
                            </thead>
                            {data && data.map((ele, index) => (
                                <tbody>
                                    <tr key={index}>
                                        <td data-title="#" className="text-center">
                                            {index + 1}
                                        </td>
                                        <td data-title="endate" className="text-center">
                                            {ele.endate}
                                        </td>
                                        <td data-title="BatteryPercentage" className="text-center">
                                            {ele.BatteryPercentage}&nbsp;
                                        </td>
                                        <td data-title="status" className="text-center">
                                            {ele.STATUS}&nbsp;
                                        </td>
                                        <td data-title="PreBookingId" className="text-center">
                                            {ele.PreBookingId}&nbsp;
                                        </td>
                                    </tr >
                                </tbody>))}
                        </table>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LoginDetailTableModal


