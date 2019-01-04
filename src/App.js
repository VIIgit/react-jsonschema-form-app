import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Form from "react-jsonschema-form";
import CustomForm from './components/CustomForm';

import 'codemirror/lib/codemirror.css';
import Editor from './components/Editor';

import 'codemirror/theme/material.css'
import './App.css'


require('codemirror/mode/javascript/javascript');
require('bootstrap') ;
require('util');

const draft07Schema = require('ajv/lib/refs/json-schema-draft-07.json');

const schema = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: {type: "string", title: "Title", default: "A new task"},
    date: {type: "string", format: "date", title: "Date"},
    date2: {type: "string", format: "date"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};

const log = (type) => console.log.bind(console, type);


/*
const CustomDescriptionField = ({id, description}) => {
  return <div id={id}>{description}</div>;
};

const fields = {
  TitleField: CustomTitleField,
  DescriptionField: CustomDescriptionField,
  StringField: CustomStringField
};

function CustomFieldTemplate(props) {
  const {id, classNames, label, help, required, description, errors, children} = props;
  
  return (
    <p className='{classNames} float-container '>
      <label htmlFor={id}>{label}{required ? "*" : null}</label>
      {children}
      {description}
      {errors}
      {help}
    </p>
  );
}

function transformErrors(errors) {
  console.log('ERRRRR');
  return errors.map(error => {
    if (error.name === "pattern") {
      error.message = "Only digits are allowed"
    }
    return error;
  });
}

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

const CustomCheckbox = function(props) {
  return (
    <button id="custom" className={props.value ? "checked" : "unchecked"} onClick={() => props.onChange(!props.value)}>
    	{props.value}
    </button>
  );
};

const widgets = {
  //TextWidget: CustomCheckbox
  datex: CustomCheckbox
};

*/
const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
var formData = {};




/*
const FloatLabel = function () {

  // add active class and placeholder 
  var handleFocus = function handleFocus(e) {
    var target = e.target;
    target.parentNode.classList.add('active');
    target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
  };

  // remove active class and placeholder
  var handleBlur = function handleBlur(e) {
    var target = e.target;
    if (!target.value) {
      target.parentNode.classList.remove('active');
    }
    target.removeAttribute('placeholder');
  };

  // register events
  var bindEvents = function bindEvents(element) {
    var floatField = element.querySelector('input');
    floatField.addEventListener('focus', handleFocus);
    floatField.addEventListener('blur', handleBlur);
  };

  // get DOM elements
  var init = function init() {
    var floatContainers = document.querySelectorAll('.float-container');

    floatContainers.forEach(function (element) {
      if (element.querySelector('input').value) {
        element.classList.add('active');
      }

      bindEvents(element);
    });
  };

  return {
    init: init };

}();


            <div className="col-md">
              <JsonSchemaEditor
                ref={this.jsonSchemaEditor} 
                title='My'
                schema = {this.state.schema}
                onChange={(value) => {
                  this.updateFormEditor(value);
                }}
              />
            </div>


*/
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
    	schema: schema,
      uiSchema: undefined
    };

    this.formEditor = React.createRef();
    this.jsonSchemaEditor = React.createRef();
    this.updateFormEditor = this.updateFormEditor.bind(this);
    this.updateJsonSchemaEditor= this.updateJsonSchemaEditor.bind(this);
    this.setState({ schema });
    //FloatLabel.init();
  }

  updateFormEditor (value) {
    try {
      //for (var prop in this.state.schema) { if (this.state.schema.hasOwnProperty(prop)) { delete this.state.schema[prop]; } };
      this.setState({ schema : JSON.parse(value)});
      //FloatLabel.init();
    } catch (err) {
      log('nok');
    }
  }

  updateJsonSchemaEditor () {
    var doc = this.updateForm.current;
    try {
      
    } catch (err) {
    }
  }

  onSchemaEdited = schema => {
    //this.setState({ schema: schema, shareURL: null });
    this.updateFormEditor(JSON.stringify (schema));
    console.log('changed: ' + JSON.stringify (schema));
  }

  onUISchemaEdited = uiSchema => this.setState({ uiSchema, shareURL: null });
  
  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  render() {
    return (
      <div className="App">

        <div className="container">
          <div className="row">
            <div className="col-md">
              <div className="widgetTitle">
                  Form
              </div>
              <div className="widget" style= {{"padding": "10px"}}>
                <CustomForm schema={this.state.schema}
                  ref={this.formEditor} 
                  onChange={log("changed")}
                  onSubmit={log("submitted")}
                  onError={
                    log("errors")
                  }
                  />
              </div>
            </div>
            


            <div className="col-md">
              <Editor
                title="JSONSchema"
                validationSchema={draft07Schema}
                code={toJson(schema)}
                onChange={this.onSchemaEdited}
              />
            </div>

            <div className="col-md">              
              <Editor
                  title="formData"
                  code={toJson(formData)}
                  onChange={this.onFormDataEdited}
                />            
            </div>

          </div>
        </div>

      </div>
    );
  }
}

export default App;





