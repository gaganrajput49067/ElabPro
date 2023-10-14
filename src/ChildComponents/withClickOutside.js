import React, { useRef, useEffect } from "react";

function withClickOutside(Component) {
  return function WithClickOutside(props) {
    const ref = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          props.setOpen(false);
        } 
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, props]);

    return <Component ref={ref} {...props} />;
  };
}

export default withClickOutside;
