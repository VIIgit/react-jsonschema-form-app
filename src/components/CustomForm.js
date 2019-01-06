import React from 'react';
import Form from "react-jsonschema-form";
import CustomStringField from './fields/CustomStringField';
import { setState } from 'react-jsonschema-form/lib/utils';
//import ObjectFieldTemplate from "react-jsonschema-form/lib/components/fields";

const CustomDescriptionField = ({id, description}) => {
  return <div id={id}>{description}</div>;
};

const customFields = {
  //TitleField: CustomTitleField,
  //DescriptionField: CustomDescriptionField,
  //StringField: CustomStringField
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
    <button id="custom" className={props.value ? "checked" : "unchecked"} onClick={() => props.onChange(!props.value)}>
    	{props.value}
    </button>
  );
};

const MarkdownWidget = function(props) {
  return (
    <button id="custom" className={props.value ? "checked" : "unchecked"} onClick={() => props.onChange(!props.value)}>
    	{props.value}
    </button>
  );
};

const customWidgets = {
  markdown: MarkdownWidget
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