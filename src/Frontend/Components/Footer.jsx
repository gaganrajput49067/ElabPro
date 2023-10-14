import React from "react";

const Footer = () => {
  return (
    
      <footer className="main-footer">
        <div className="pull-right hidden-xs">
          <b>Version</b> {process.env.REACT_APP_Version}
        </div>
        <strong>
          Copyright © {(new Date()).getFullYear()} <a href="http://uat.elabpro.in" target="blank"><b>{process.env.REACT_APP_firstName}</b>{process.env.REACT_APP_lastName}</a>.
        </strong>
        All rights reserved.
      </footer>
  );
};

export default Footer;