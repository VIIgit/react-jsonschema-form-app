import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import CustomForm from './components/CustomForm';
import { shouldRender } from 'react-jsonschema-form/lib/utils';

//import Switch from "react-switch";
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';

import 'codemirror/lib/codemirror.css';
import Editor from './components/Editor';

import JsonSchemaValidator from './components/JsonSchemaValidator';
import JsonConverter from './components/JsonConverter';
import YamlConverter from './components/YamlConverter';

import 'codemirror/theme/material.css';
import './App.css';

import CopyLink from './components/CopyLink';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { samples } from "./samples";
import sampleSimple from './samples/mostCommon';

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
      <div className="btn-group">
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
      schemaError: undefined
    };

    this.schemaValidator = new JsonSchemaValidator({validationSchema: draft07Schema});
    this.dataValidator = new JsonSchemaValidator();

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
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        error = {
          title: 'Invalid Json ',
          description: err.message
        };
      } else {
        error = {
          title: 'Error',
          description: err.message
        };
        console.log(err.stack);
      }
    }
    this.setState({ 
      schema: schemaObj,
      schemaError: error,
      formDataError: dataError,
    });
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
          title: 'Error',
          description: err.message
        }
      });
    }
  };
  
  onFormDataEdited = (editor, metadata, formDataAsString) => {

    const converter = this.state.schemaAsJson ? JsonConverter : YamlConverter;
    var dataError = undefined;

    try { 
    
      var formData = converter.toObject(formDataAsString);
      dataError = this.dataValidator.getValidationError(formData);
      
    } catch (err) {
      dataError = {
        title: 'Error',
        description: err.message
      };
    }

    this.setState({ 
      formDataError: dataError,
      formData: formData,
      formDataAsString: formDataAsString
    });
  };
  
  onUIFormEdited = formModel => {
    const converter = this.state.schemaAsJson ? JsonConverter : YamlConverter;
    var dataError = undefined;
    var formDataAsString = ' ';
    try { 
      formDataAsString = converter.toString(formModel.formData);
      dataError = this.dataValidator.getValidationError(formModel.formData);
      
    } catch (err) {
      dataError = {
        title: 'Error',
        description: err.message
      };
    }
    this.setState({ 
      formDataError: dataError,
      formData: formModel.formData,
      formDataAsString: formDataAsString
    });
  };

  onShare = () => {
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
  
  notifyError = (err) => {
    const toastId = err.title + err.description;
    if (! toast.isActive(toastId)) {
      toast.error( <div><h3>{err.title}</h3>{err.description}</div>, {
        toastId: toastId
      });
    }
  };

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
      
    } = this.state;

    if (schemaError) {
      this.notifyError(schemaError);
    }
    if (formDataError) {
      this.notifyError(formDataError);
    }
    if (!schemaError && !formDataError) {
      toast.dismiss();
    }
    

    return (
      <div className="App">

        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="#">
            <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          JSONSchema Form
          </a>
          <Selector onSelected={this.load} />
        </nav>

        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        <div className="container-fluid">
          <div className="row">

            <div className="col-sm-7 left-nav">
              <div className="container sticky-top"> 
                <div className="row">
                  <div className="col">

                    <div className="panel panel-default">
                      <div className={`${!schemaError ? "valid" : "invalid"} panel-heading btn-toolbar justify-content-between`} role="toolbar" aria-label="Toolbar with button groups">
                        <div >
                          <span className={`rounded-circle unicode_${!schemaError ? "ok" : "nok"}`} />
                            {"JSONSchema"}
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
                      <div className={`${!formDataError ? "valid" : "invalid"} panel-heading btn-toolbar justify-content-between`} role="toolbar" aria-label="Toolbar with button groups">
                        <div >
                          <span className={`rounded-circle unicode_${!formDataError ? "ok" : "nok"}`} />
                            {"Form Data"}
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
              <CustomForm 
                title="Form"
                schema={schema}
                formData={formData}
                liveSettings = {liveSettings}
                onChange={(e) =>  this.onUIFormEdited(e)}
                showErrorList={true}
                valid={!formDataError}
                >
              
                <div className="text-right">
                  <CopyLink
                    shareURL={this.state.shareURL}
                    onShare={this.onShare}
                  />
                </div>
            
              </CustomForm>                 
            
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