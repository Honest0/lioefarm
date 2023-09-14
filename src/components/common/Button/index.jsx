import React from "react";
import { Button as Btn } from "@material-ui/core";
import "./index.css";

const Button = (props) => {
  let { classes, block, disabled, height, width, ...rest } = props;

  return (
    <Btn
      variant="contained"
      className={`btn${classes ? " " + classes : ""}${
        block ? " btn-block" : ""
      }`}
      disabled={disabled}
      style={{ height: `${height} !important`, width: `${width} !important` }}
      {...rest}
    >
      {props.children}
    </Btn>
  );
};

export default Button;
