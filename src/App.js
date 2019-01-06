import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-jsonschema-form';
import CustomForm from './components/CustomForm';
import { shouldRender } from 'react-jsonschema-form/lib/utils';

import 'codemirror/lib/codemirror.css';
import Editor from './components/Editor';

import 'codemirror/theme/material.css';
import './App.css';

import sampleSimple from './sample/simple';


require('codemirror/mode/javascript/javascript');
require('bootstrap') ;
require('util');

const draft07Schema = require('ajv/lib/refs/json-schema-draft-07.json');
const log = (type) => console.log.bind(console, type);

const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);

class App extends Component {

  constructor(props) {
    super(props);

    const { schema, formData, validate } = sampleSimple;

    this.state = {
      schema: schema,
      formData : formData,
      valid: true,
      validate: true,
      liveSettings: {
        validate: true,
        disable: false,
      }
    };
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onSchemaEdited = schema => {
    this.setState({ 
      schema: schema, 
      
      shareURL: null
     });
    console.log('form changed: ' + JSON.stringify (schema));
  };
  
  onFormDataEdited = value => {
    this.setState({ formData: value });
    console.log('formData changedx: ' +   JSON.stringify (value) );
  };

  onUIFormEdited = formModel => {
   this.setState({ 
     formData: formModel.formData,
     valid: (formModel.errors.length === 0)
    });
  };

  render() {

    const {
      schema,
      formData,
      liveSettings,
      validate,
      valid
    } = this.state;

    return (
      <div className="App">

        <div className="container">
          <div className="row">

            <div className="col-md">

              <div className="container"> 
                <div className="row">
                  <div className="col-md">
                    <Editor
                      title="JSONSchema"
                      validationSchema={draft07Schema}
                      code={toJson(schema)}
                      onChange={this.onSchemaEdited}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md">              
                    <Editor
                      title="Form Data"
                      validationSchema={schema}
                      code={toJson(formData)}
                    />            
                  </div>
                </div>

              </div>
            </div>
            
            <div className="col-md">
              <CustomForm 
                title="Form"
                schema={schema}
                //ref={this.formEditor} 
                formData={formData}
                liveSettings = {liveSettings}
                //validate = {validate}
                onChange={(e) =>  this.onUIFormEdited(e)}
                showErrorList={true}
                valid={valid}
                >
              </CustomForm>                 
            
            </div>
          </div>
        
        </div>
      </div>
    );
  }
};

export default App;