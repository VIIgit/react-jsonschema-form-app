import React, { Component } from "react";
import FileWidget from 'react-jsonschema-form/lib/components/widgets/FileWidget'

function FilePreviewWidget(props) {
  const isAnImage = props.value && props.value.startsWith('data:image');
  if (!isAnImage) {
    return <FileWidget {...props} />;
  }
  return (
    <div>
      <FileWidget {...props} />
      <img className="previewImage" width="80px" height="80px" src={props.value} />
    </div>
  );
}

export default FilePreviewWidget;
