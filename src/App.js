import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import CustomForm from './components/CustomForm';
import { shouldRender } from 'react-jsonschema-form/lib/utils';

import 'codemirror/lib/codemirror.css';
import Editor from './components/Editor';

import 'codemirror/theme/material.css';
import './App.css';

import CopyLink from './components/CopyLink'

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

    const { schema, formData } = sampleSimple;

    this.state = {
      schema: schema,
      formData : formData,
      valid: true,
      validate: true,
      liveSettings: {
        validate: true,
        disable: false,
      },
      shareURL: null
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
    log('form changed: ' + JSON.stringify (schema));
  };
  
  onFormDataEdited = value => {
    this.setState({ formData: value, shareURL: null });
    console.log('formData changedx: ' +   JSON.stringify (value) );
  };

  onUIFormEdited = formModel => {
   this.setState({ 
     formData: formModel.formData,
     valid: (formModel.errors.length === 0)
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
    // force resetting form component instance
    console.log(data);
    
    this.setState({ form: true }, _ =>
        this.setState({
          ...data,
          form: false
        })
      );
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

  render() {
    const {
      schema,
      formData,
      liveSettings,
      valid
    } = this.state;

    return (
      <div className="App">

        <div className="container-fluid">
          <div className="row">

            <div className="col-sm-7">
              <div className="container"> 
                <div className="row">
                  <div className="col">
                    <Editor
                      title="JSONSchema"
                      validationSchema={draft07Schema}
                      code={toJson(schema)}
                      onChange={this.onSchemaEdited}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col">      
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
            
            <div className="col-sm-5">
              <CustomForm 
                title="Form"
                schema={schema}
                formData={formData}
                liveSettings = {liveSettings}
                onChange={(e) =>  this.onUIFormEdited(e)}
                showErrorList={true}
                valid={valid}
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