import React from 'react';
import Form from "react-jsonschema-form";
import CustomStringField from './fields/CustomStringField';
import FilePreviewWidget from './widgets/FilePreviewWidget';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab} from 'react-bootstrap';
import TextareaWidget from 'react-jsonschema-form/lib/components/widgets/TextareaWidget'
import TextWidget from 'react-jsonschema-form/lib/components/widgets/TextWidget'
import NumberFormat from 'react-number-format'

const ReactMarkdown = require('react-markdown')

const customFields = {
  StringField: CustomStringField
};

function ErrorListTemplate(props) {
  const {errors} = props;
  return (
    <div>
      {errors.map((error, i) => {
        return (
          <li key={i}>
            {error.stack}
          </li>
        );
      })}
    </div>
  );
}

export function CustomFieldTemplate(props) {
  const {id, label, help, required, description, errors, children} = props;
  
  return (
    <div className=' float-container '>
      <label htmlFor={id}>{label}{required ? " *" : null}</label>
      {children}
      {description}
      {errors}
      {help}
    </div>
  );
}

export function CustomObjectFieldTemplate({ TitleField, properties, title, description }) {
  return (
    <div>
      <TitleField title={title} />
      <div className="row">
        {properties.map(prop => (
          <div
            className="col-lg-2 col-md-4 col-sm-6 col-xs-12"
            key={prop.content.key}>
            {prop.content}
          </div>
        ))}
      </div>
      {description}
    </div>
  );
}

function transformErrors(errors) {
  return errors.map(error => {
    if (error.name === "pattern") {
      error.message = "Only digits are allowed"
    }
    return error;
  });
}

const DecimalFormatWidget = function(props) {
  const str = props.value;
  let decimalScale = 0;
  let value = "";
  const displayType = props.schema.readOnly ? 'text' : 'input';
  if(str){
    try{
      const decimalPos = str.lastIndexOf(".");
      decimalScale = (decimalPos >-1 ) ? str.length - decimalPos - 1 : 0;
      value = Number(str);
    } catch(err){
      console.log(err.message);
    }
    decimalScale = Math.max( Math.min(decimalScale, 100), 0);
  }
  return (
    <NumberFormat id={props.id}  className="form-control form-control-decimal" 
        value={value}
        displayType={displayType}
        decimalScale= {decimalScale}
        fixedDecimalScale= {true} 
        thousandSeparator={true} 
        //prefix={'$'}
        onValueChange={(values) => {
          let {floatValue} = values;
          // formattedValue = $2,223
          // value ie, 2223
          const strValue = isNaN(floatValue) ? undefined : Number(floatValue).toFixed(decimalScale);
          props.onChange(strValue);
        }}
       />
  );
};

const PercentageFormatWidget = function(props) {
  const str = props.value;
  let decimalScale = 0;
  let value = "";
  const displayType = props.schema.readOnly ? 'text' : 'input';
  if(str){
    try{
      const decimalPos = str.lastIndexOf(".");
      decimalScale = (decimalPos >-1 ) ? str.length - decimalPos - 1 : 0;
      value = Number(str);
    } catch(err){
      console.log(err.message);
    }
    decimalScale = Math.max( Math.min(decimalScale, 100), 0);
  }
  return (
    <NumberFormat id={props.id}  className="form-control form-control-decimal" 
        value={value}
        displayType={displayType}
        decimalScale= {decimalScale}
        fixedDecimalScale= {true} 
        thousandSeparator={true} 
        suffix={'%'}
        onValueChange={(values) => {
          let {floatValue} = values;
          // formattedValue = $2,223
          // value ie, 2223
          const strValue = isNaN(floatValue) ? undefined : Number(floatValue).toFixed(decimalScale);
          props.onChange(strValue);
        }}
       />
  );
};

const MarkdownWidget = function(props) {
  if(props.schema.readOnly){
    return (
      <div className="form-control-markdown">
        <ReactMarkdown id={props.id} source={props.value} />
      </div>
    )
  }
  return (
    <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example" className="preview-menu">
      <Tab eventKey={1} title="Edit" className="tab">
        <TextareaWidget  {...props} />
      </Tab>
      <Tab eventKey={2} title="Preview" className="tab">
        <div className="form-control-markdown">
          <ReactMarkdown id={props.id} source={props.value} />
        </div>
      </Tab>
    </Tabs>
  );
};

const UnsupportedWidget = function(props) {
  console.log(JSON.stringify(props));

  const readOnly = props.schema.readOnly;
  if (readOnly) {
    return <div className="unsupported-widget">
      <div className="form-control">{props.value}</div>
      No default Editor for format <strong>'{props.schema.format}'</strong>
      </div> 
  }
  return <div className="unsupported-widget">
      <TextWidget  {...props} />  
      No default Editor for format <strong>'{props.schema.format}'</strong>
      </div> 
};
const customWidgets = {
  markdown: MarkdownWidget,
  "text/markdown": MarkdownWidget,
  "text/plain": TextareaWidget,
  decimal: DecimalFormatWidget,
  percentage: PercentageFormatWidget,
  UnsupportedWidget: UnsupportedWidget,
  "data-url": FilePreviewWidget,
  "int64": DecimalFormatWidget,
  "int32": DecimalFormatWidget
};

function CustomForm(props) {
  const { children, liveSettings } = props;

  return <div style= {{"padding": "10px"}}>        

    <Form 
      {...props} 
      fields={customFields} 
      widgets={customWidgets}
      //  ObjectFieldTemplate={CustomObjectFieldTemplate}
      //FieldTemplate={CustomFieldTemplate} 
      ErrorList={ErrorListTemplate}
      showErrorList={false}
      liveValidate={liveSettings.validate}
      disabled={liveSettings.disable}
      transformErrors={(errors)=> transformErrors(errors)}
    >
    {children ? (
        children
      ) : <span></span>}
    </Form>

  </div>;
}

export default CustomForm;