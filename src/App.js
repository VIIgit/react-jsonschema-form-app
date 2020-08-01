import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'codemirror/theme/material.css';
import 'react-toastify/dist/ReactToastify.css';
import 'rc-switch/assets/index.css';
import 'codemirror/lib/codemirror.css';
import './App.css';

import CustomForm from './components/CustomForm';
import SchemaValidationException from './components/SchemaValidationException';
import { shouldRender } from 'react-jsonschema-form/lib/utils';

//import Switch from "react-switch";
import Switch from 'rc-switch';

import Editor from './components/Editor';

import JsonSchemaValidator from './components/JsonSchemaValidator';
import JsonConverter from './components/JsonConverter';
import YamlConverter from './components/YamlConverter';

import CopyLink from './components/CopyLink';

import { ToastContainer, toast } from 'react-toastify';

import { samples } from "./samples";
import sampleSimple from './samples/mostCommon';
import jsf from 'json-schema-faker';

import Logo from './images/w.png';

require('codemirror/mode/javascript/javascript');
require('bootstrap') ;
require('util');

const draft07Schema = require('ajv/lib/refs/json-schema-draft-07.json');

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: 'Simple' };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = (label) => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      this.props.onSelected(samples[label]);
    }
  };

  render() {
    return (
      <div className="btn-group navbar-button">
        <button className="btn btn-warning btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          JSON schema examples
        </button>
        <div className="dropdown-menu">

          {Object.keys(samples).map((label, i) => {
            return (
              <a key={i}
                role="presentation" href="#" className={this.state.current === label ? "active dropdown-item" : "dropdown-item"} onClick={this.onLabelClick(label)} >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    );
  }
}
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      formData : {},
      formDataError: undefined,
      formDataSyntaxError : undefined,
      valid: true,
      validate: true,
      liveSettings: {
        validate: true,
        disable: false,
      },
      isSchemaValid: false,
      isFormDataValid: false,
      shareURL: null,
      schemaAsJson: true,
      schemaError: undefined,
      showForm: true
    };

    this.schemaValidator = new JsonSchemaValidator({validationSchema: draft07Schema});
    this.dataValidator = new JsonSchemaValidator();
    this.onShare = this.onShare.bind(this);
    this.onSchemaEdited = this.onSchemaEdited.bind(this);
    this.onFormDataEdited = this.onFormDataEdited.bind(this);
    this.onUIFormEdited = this.onUIFormEdited.bind(this);
    this.onFormatChange = this.onFormatChange.bind(this);
    this.updateSchemaObject = this.updateSchemaObject.bind(this);
    this.load = this.load.bind(this);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  updateSchemaObject = (schemaObj) => {
    var error = undefined;
    var dataError =  undefined;
    try {
      error = this.schemaValidator.getValidationError(schemaObj);
      if ( !error ) { 
        this.dataValidator.updateValidationSchema(schemaObj);
        dataError = this.dataValidator.getValidationError(this.state.formData);

        this.setState({ 
          schema: schemaObj,
          schemaError: error,
          formDataError: dataError,
        });
      }

    } catch (err) {
      if (err instanceof SyntaxError) {
        error = {
          title: 'JSONSchema - Syntax Error',
          description: err.message
        };
      } else {
        error = {
          title: 'JSONSchema - Error',
          description: err.message
        };
        console.log(err.stack);
      }
      this.setState({ 
        schemaError: error,
        formDataError: dataError,
      });
    }
  }

  onSchemaEdited = (editor, metadata, schema) => {
    this.state.schemaAsString= schema;
    try {
      const converter = this.state.schemaAsJson ? JsonConverter : YamlConverter;
      var jsonObj = converter.toObject(schema);
      this.updateSchemaObject(jsonObj);
    } catch (err) {
      this.setState({ 
        schemaError: {
          title: 'JSONSchema - Syntax Error',
          description: err.message
        }
      });
    }
  };
  
  onFormDataEdited = (editor, metadata, formDataAsString) => {

    const converter = this.state.schemaAsJson ? JsonConverter : YamlConverter;
    var dataError = undefined;
    var formData = undefined;
    try { 
    
      this.setState({ 
        formDataAsString: formDataAsString,
      });
      formData = converter.toObject(formDataAsString);
      this.onUIFormEdited ({formData: formData, formDataAsString: formDataAsString}); 
      this.setState({ 
        formDataSyntaxError: undefined
      });
    } catch (err) {
      dataError = {
        title: 'Form Data Error',
        description: err.message
      };
      this.setState({ 
        formDataSyntaxError: dataError
      });
    }

  };
  
  onUIFormEdited = formModel => {
    const converter = this.state.schemaAsJson ? JsonConverter : YamlConverter;
    var dataError = undefined;
    var formDataAsString = undefined;
    try { 
      dataError = this.dataValidator.getValidationError(formModel.formData);
      this.setState({ 
        formDataError: dataError,
        formData: formModel.formData
      });
      if (formModel.formDataAsString){
        formDataAsString = formDataAsString;
      } else if (!this.state.formDataSyntaxError){
        formDataAsString = converter.toString(formModel.formData);
        this.setState({ 
          formDataAsString: formDataAsString
        });
      }
    } catch (err) {
      dataError = {
        title: 'Error Form Data',
        description: err.message
      };
      this.setState({ 
        formDataError: dataError,
        formData: formModel.formData
      });
    }
  };

  onShare = (copied) => {
    if(copied){
      this.setState({ shareURL: null });
      this.notifySuccess(
        {
          title: 'Copied',
          description: 'Link copied to clipboard'
        }
      );
      return;
    }
    const { formData, schema } = this.state;
    const {
      location: { origin, pathname },
    } = document;
    try {
      const hash = btoa(JSON.stringify({ formData, schema }));
      this.setState({ shareURL: `${origin}${pathname}#${hash}` });
    } catch (err) {
      this.setState({ shareURL: null });
    }
  };

  
  load = data => {
    
    const schemaAsString = JsonConverter.toString(data.schema);
    const formDataAsString = JsonConverter.toString(data.formData);
    
    this.setState({
      ...data,
      schemaAsJson: true,
      schemaAsString: schemaAsString,
      formDataAsString: formDataAsString,
      formDataSyntaxError : undefined,
      form: false
    })
  };
    
  componentDidMount() {

    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === "string" && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert("Unable to load form setup data.");
      }
    } else {
      this.load(sampleSimple);
    }
  };

  onFormatChange = (value, event) => {
    event.preventDefault();

    const converter = value ? JsonConverter : YamlConverter;
    const schemaAsString = converter.toString(this.state.schema);
    const formDataAsString = converter.toString(this.state.formData);

    this.setState({ 
      schemaAsJson: value,
      schemaAsString: schemaAsString,
      formDataAsString: formDataAsString
    });    
  }

  onShowFormChange = (value, event) => {
    event.preventDefault();
    this.setState({ 
      showForm: value
    });    
  }

  notifyError = (toastId, err) => {
    if (!err){
      toast.dismiss(toastId);
      return 
    }
    if (!toast.isActive(toastId)) {
      toast.error( <div><h6>{err.title}</h6>{err.description}</div>, {
        toastId: toastId,
        autoClose: 4000
      });
    } else {
      toast.update(toastId, {
        render: <div><h6>{err.title}</h6>{err.description}</div>
      });
    }
  };

  notifySuccess = (msg) => {
    const toastId = 'toastIdSuccess' + msg.title;
    if (!toast.isActive(toastId)) {
      toast.success( <div><h6>{msg.title}</h6>{msg.description}</div>, {
        toastId: toastId,
        autoClose: 2000
      });
    } else {
      toast.update(toastId, {
        render: <div><h6>{msg.title}</h6>{msg.description}</div>
      });
    }
  };

  removeExample = () => {
    
    try {
      this.onUIFormEdited ({formData: {}}); 
    } catch (err) {
      console.log('Clear Data failed: ' + err.message);
      this.setState({ 
        formDataError: {
          title: 'Clear Data',
          description: err.message
        }
      });
    }
  };

  generateExample = () => {
    jsf.option({ alwaysFakeOptionals: false, optionalsProbability: 1 ,useDefaultValue: true, failOnInvalidTypes: false, failOnInvalidFormat: false });


    jsf.format('date', function (){ 
      var date = new Date();
      var days = Math.random() * (252460800000 - -1000) + -1000;
      date.setTime(date.getTime() - days);
      return date.toISOString();
    });
    
    try {
      const genData = jsf(this.state.schema);
      this.onUIFormEdited ({formData: genData}); 
    } catch (err) {
      console.log('JSONForm Data Generation failed: ' + err.message);
      this.setState({ 
        formDataError: {
          title: 'JSONForm Data Generation',
          description: err.message
        }
      });
    }
  };
  
  /*
  shouldComponentUpdate = (nextProps, nextState) =>{
    
    console.log ( 'should: ' +  JSON.stringify(this.state) + '======' + JSON.stringify(nextState))

    return true;
  };
  */
  render() {
    const {
      schema,
      formData,
      liveSettings,
      schemaAsJson,
      schemaAsString,
      schemaError,
      formDataAsString,
      formDataError,
      formDataSyntaxError,
      showForm
    } = this.state;

 
    this.notifyError('schemaError', schemaError);
    this.notifyError('formDataSyntaxError', formDataSyntaxError);
    
    let formOrError;
    if (showForm) {
      formOrError = 
          <CustomForm 
            schema={schema}
            formData={formData}
            liveSettings = {liveSettings}
            onChange={(e) =>  this.onUIFormEdited(e)}
            showErrorList={true}
            valid={!formDataError}
          />;
    } else {
      formOrError = <SchemaValidationException formDataError={formDataError}/>;
    }
    
    return (
      <div className="App">

        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="#">
            <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          JSONSchema Form
          </a>

          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            
            <li className="nav-item">
              <CopyLink
                  shareURL={this.state.shareURL}
                  onShare={this.onShare}
                />
            </li>
          </ul>

          <Selector onSelected={this.load} />
        </nav>

        <ToastContainer 
          position="top-center"
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          delay={2000}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        <div className="container-fluid main-content">
          <div className="row">

            <div className="col-sm-7 left-nav">
              <div className="container sticky-top"> 
                <div className="row">
                  <div className="col">
                  
                    <div className="panel panel-default">
                      <div className={`${!schemaError ? "valid" : "fatal"} panel-heading btn-toolbar justify-content-between`} role="toolbar" aria-label="Toolbar with button groups">
                        <div >
                          <span className={`rounded-circle unicode_${!schemaError ? "ok" : "nok"}`} />
                            {!schemaError ? " JSONSchema" : " JSONSchema - Syntax Error"}
                        </div>
                        <Switch
                          onChange={this.onFormatChange}
                          checked={schemaAsJson}
                          checkedChildren="JSON"
                          unCheckedChildren="YAML"
                        />
                      </div>

                      <Editor
                        codeAsString={schemaAsString}
                        onSchemaChange={this.onSchemaEdited}
                        yaml={!schemaAsJson}
                      />

                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">      
                    <div className="panel panel-default">
                      <div className={`${formDataSyntaxError ? "fatal" : (formDataError ? "invalid" : "valid")} panel-heading btn-toolbar justify-content-between`} role="toolbar" aria-label="Toolbar with button groups">
                        <div >
                          <span className={`rounded-circle unicode_${formDataError || formDataSyntaxError ? "nok" : "ok"}`} />
                            {formDataSyntaxError ? " Form Data - Syntax Error" : (formDataError ? " Form Data - Validation Error" : " Form Data")}
                        </div>
                        <div>
                          <a href="#" onClick={this.generateExample}>Generate Example </a> | <a href="#" onClick={this.removeExample}>Clear </a>
                        </div>
                      </div>

                      <Editor
                        className="form-data"
                        codeAsString={formDataAsString}
                        onSchemaChange={this.onFormDataEdited}
                        yaml={!schemaAsJson}
                      />     
                     </div>       
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-sm-5">
              <div className="panel panel-default">
                  <div className={`${!formDataError ? "valid" : "invalid"} panel-heading btn-toolbar justify-content-between`} role="toolbar" aria-label="Toolbar with button groups">
                    <div >
                      <span className={`rounded-circle unicode_${!formDataError ? "ok" : "nok"}`} />
                        {showForm ? " Form" : " Error Details"} {formDataError ? " - Validation Error" : ""}
                    </div>
                    <div>
                    <Switch
                      onChange={this.onShowFormChange}
                      checked={showForm}
                      checkedChildren="Form"  
                      unCheckedChildren="Details"
                    />
                    </div>
                  </div>
                  {formOrError}
              </div>
            </div>
          </div>
        </div>
        <div>
         <p className="footer">
            Inspired by <a href="https://github.com/mozilla-services/react-jsonschema-form">react-jsonschema-form</a> and powered by <a href="https://github.com/VIIgit/react-jsonschema-form-app">react-jsonschema-form-app</a>
          </p>
        </div>        
      </div>
    );
  }
};

export default App;