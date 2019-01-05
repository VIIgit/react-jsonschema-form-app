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
      validate: true,
      liveSettings: {
        validate: true,
        disable: false,
      }
    };

    this.formEditor = React.createRef();
    this.jsonSchemaEditor = React.createRef();
    this.updateFormEditor = this.updateFormEditor.bind(this);
    this.updateJsonSchemaEditor= this.updateJsonSchemaEditor.bind(this);
    //this.setState({ liveSettings });
    //FloatLabel.init();
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  updateFormEditor (value) {
    try {
      //for (var prop in this.state.schema) { if (this.state.schema.hasOwnProperty(prop)) { delete this.state.schema[prop]; } };
      //this.setState({ schema : JSON.parse(value)});
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
    //this.updateFormEditor(JSON.stringify (schema));
    console.log('form changed: ' + JSON.stringify (schema));
  };
  
  onFormDataEdited = value => {
    //this.setState({ formData: formModel.formData });
    console.log('formData changedx: ' +   JSON.stringify (value) );
  };

  onUIFormEdited = formModel => {
   this.setState({ formData: formModel.formData });
   console.log('UI form  changedx: ' +   JSON.stringify (formModel.formData) );
  };

  render() {

    const {
      schema,
      formData,
      liveSettings,
      validate,
      editor
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
                      onChange={this.onFormDataEdited}
                    />            
                  </div>
                </div>

              </div>
            </div>
            
            <div className="col-md">

              <div className="panel panel-default">
                <div className="panel-heading">
                    Form
                </div>
                <div className="widget" style= {{"padding": "10px"}}>
                  <CustomForm 
                    schema={schema}
                    //ref={this.formEditor} 
                    formData={formData}
                    liveSettings = {liveSettings}
                    //validate = {validate}
                    onChange={(e) =>  this.onUIFormEdited(e)}
                    onError={
                      (errors) => {log("I have" + errors.length + "errors to fix");
                    }
                    }
                    >
                  </CustomForm>                 
                </div>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    );
  }
}

export default App;