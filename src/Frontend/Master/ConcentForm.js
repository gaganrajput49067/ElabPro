import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UploadModal from "../../Frontend/util/UploadModal";

const ConcentForm = () => {
  const [show, setShow] = useState(false);
  const [formTable,setFormTable] = useState([]);
  const [documentId, setDocumentID] = useState("");

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = () => {
    const guidNumber =
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4();

    setDocumentID(guidNumber);
  };

  useEffect(() => {
    guidNumber();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        {show?.modal && (
          <UploadModal
            show={show?.modal}
            handleClose={() => {
              setShow({ modal: false, data: "", index: -1 });
            }}
            // options={Identity}
            documentId={show?.data}
            pageName="Patient Registration"
            // handleUploadCount={handleUploadCount}
          />
        )}
        <div className="row">
          <div className="col-sm-6">
            <div className="box-header with-border">
              <h3 className="box-title">Concent Form</h3>
              <Link to="/ConcentFormMaster/Create" style={{ float: "right" }}>
                Create New
              </Link>
            </div>
            <div className="box-body">
              <div className="row">
                <div className="col-sm-3 ">
                  <label className="control-label">Concent Form Name:</label>
                  <input
                    className="form-control ui-autocomplete-input input-sm"
                    placeholder="Concent Form Name.."
                  />
                </div>
                <div className="col-sm-2">
                  <label className="control-label">Attach Files</label>

                  <button
                    className="btn btn-block btn-info btn-sm"
                    type="button"
                    id="btnUpload"
                    onClick={() => {
                      setShow(true);
                    }}
                  >
                    Attach Files
                  </button>
                </div>
              </div>
            </div>
            <div
              className=" box-body divResult table-responsive boottable"
              id="no-more-tables"
            >
              <table
                id="tblData"
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>Fields</th>
                    <th>Left</th>
                    <th>Top</th>
                    <th>Font</th>
                    <th>Size</th>
                    <th>Bold</th>
                    <th>Print</th>
                  </tr>
                </thead>
                <tbody>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tbody>
              </table>
            </div>
            <div className="box-footer">
              <button type="button" className="btn  btn-success">
                Save
              </button>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="box-header with-border">
              <p
                className="m-0 font-weight-bold text-primary "
                style={{ textAlign: "center" }}
              >
                Preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConcentForm;
