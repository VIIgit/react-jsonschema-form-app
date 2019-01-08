import React from 'react';
import Form from "react-jsonschema-form";
import BaseInput from 'react-jsonschema-form/lib/components/widgets/BaseInput';
import CustomStringField from './fields/CustomStringField';
import { setState } from 'react-jsonschema-form/lib/utils';

import { Button, OverlayTrigger, Tooltip, Tabs, Tab} from 'react-bootstrap';
import TextareaWidget from 'react-jsonschema-form/lib/components/widgets/TextareaWidget'
import TextWidget from 'react-jsonschema-form/lib/components/widgets/TextWidget'
import NumberFormat from 'react-number-format'

//import ObjectFieldTemplate from "react-jsonschema-form/lib/components/fields";
const ReactMarkdown = require('react-markdown')

const CustomDescriptionField = ({id, description}) => {
  return <div id={id}>{description}</div>;
};

const customFields = {
  //TitleField: CustomTitleField,
  //DescriptionField: CustomDescriptionField,
  StringField: CustomStringField
  
};

const CustomTitleField = ({title, required}) => {
  const legend = required ? title + '*x' : title;
  return <div id="custom"> xxxxx {legend}</div>;
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
  const {id, classNames, label, help, required, description, errors, children} = props;
  
  return (
    <div className='{classNames} float-container '>
      <label htmlFor={id}>{label}{required ? "*" : null}</label>
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

const CustomCheckbox = function(props) {
  return (
    <button id={props.id} className={props.value ? "checked" : "unchecked"} onClick={() => props.onChange(!props.value)}>
    	{props.value}
    </button>
  );
};

const DecimalFormatWidget = function(props) {
  const str = props.value;
  let decimalScale = 0;
  let value = 0;
  const displayType = props.schema.readOnly ? 'text' : 'input';
  if(str){
    const decimalPos = str.lastIndexOf(".");
    decimalScale = (decimalPos >-1 ) ? str.length - decimalPos - 1 : 0;
    value = Number(str);
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
          let {formattedValue, value, floatValue} = values;
          // formattedValue = $2,223
          // value ie, 2223
          floatValue = isNaN(floatValue) ? 0 : floatValue; 
          const strValue = Number(floatValue).toFixed(decimalScale);
          props.onChange(strValue);
        }}
       />
  );
};

const PercentageFormatWidget = function(props) {
  const str = props.value;
  let decimalScale = 0;
  let value = 0;
  const displayType = props.schema.readOnly ? 'text' : 'input';
  if(str){
    const decimalPos = str.lastIndexOf(".");
    decimalScale = (decimalPos >-1 ) ? str.length - decimalPos - 1 : 0;
    value = Number(str) * 100;
  }
  return (
    <NumberFormat id={props.id}  className="form-control form-control-decimal" 
        value={value}
        displayType={displayType}
        decimalScale= {decimalScale-2}
        fixedDecimalScale= {true} 
        thousandSeparator={true} 
        suffix={'%'}
        onValueChange={(values) => {
          let {formattedValue, value, floatValue} = values;
          // formattedValue = $2,223
          // value ie, 2223
          floatValue = isNaN(floatValue) ? 0 : floatValue/100; 
          const strValue = Number(floatValue).toFixed(decimalScale);
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
    <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
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
  decimal: DecimalFormatWidget,
  percentage: PercentageFormatWidget,
  UnsupportedWidget: UnsupportedWidget
};

function CustomForm(props) {
  const { title, children, liveSettings } = props;

  const icon = props.valid ? "ok" : "nok";
  const cls = props.valid ? "valid" : "invalid";

  return <div className="panel panel-default">        
      <div className={`${cls} panel-heading`}>
        <span className={`rounded-circle unicode_${icon}`} />
        {" " + title}
      </div>
      <div className="widget" style= {{"padding": "10px"}}>
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
      </div>
    </div>;
}

export default CustomForm;