import React from 'react';
import Form from "react-jsonschema-form";
import CustomStringField from './fields/CustomStringField';
//import ObjectFieldTemplate from "react-jsonschema-form/lib/components/fields";

const CustomDescriptionField = ({id, description}) => {
  return <div id={id}>{description}</div>;
};

const customFields = {
  //TitleField: CustomTitleField,
  DescriptionField: CustomDescriptionField,
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
    <button id="custom" className={props.value ? "checked" : "unchecked"} onClick={() => props.onChange(!props.value)}>
    	{props.value}
    </button>
  );
};

const customWidgets = {
  //markdown: CustomCheckbox
};

function CustomForm(props) {
  const { title, children } = props;
  return <Form 
    {...props} 
    fields={customFields} 
    widgets={customWidgets}
    //  ObjectFieldTemplate={CustomObjectFieldTemplate}
    //  FieldTemplate={CustomFieldTemplate} 
    ErrorList={ErrorListTemplate}
    transformErrors={transformErrors}
  >
  {children ? (
      children
    ) : <span></span>}
  </Form>;
}

export default CustomForm;