import React, { Component } from "react";
import FileWidget from 'react-jsonschema-form-local-link/lib/components/widgets/FileWidget'

function FilePreviewWidget(props) {
  const { BaseInput } = props.registry.widgets;
  return (
    <div>
      <p>
        <FileWidget {...props} />
      </p>
      <img width="100px" height="100px" src={props.value} alt="Roter Punkt" />
    </div>
  );
}

export default FilePreviewWidget;
