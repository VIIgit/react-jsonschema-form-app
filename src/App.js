import React, { Component , Alert} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import CustomForm from './components/CustomForm';
import { shouldRender } from 'react-jsonschema-form/lib/utils';

import 'codemirror/lib/codemirror.css';
import Editor from './components/Editor';

import 'codemirror/theme/material.css';
import './App.css';

import CopyLink from './components/CopyLink'

import { samples } from "./samples";
import sampleSimple from './samples/widgets';

import Logo from './images/w.png';

require('codemirror/mode/javascript/javascript');
require('bootstrap') ;
require('util');

const draft07Schema = require('ajv/lib/refs/json-schema-draft-07.json');
const log = (type) => console.log.bind(console, type);

const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);


class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Simple" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <div class="btn-group">
        <button class="btn btn-warning btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          JSON schema examples
        </button>
        <div class="dropdown-menu">

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
    try{
      this.setState({ 
        schema: schema, 
        shareURL: null,
        valid: false
       });
    } catch(err) {
      this.setState({ 
        shareURL: null,
        valid: false
       });
       alert('Error: \n' + err.message);
    }
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

        <nav class="navbar navbar-light bg-light">
          <a class="navbar-brand" href="#">
            <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          JSONSchema Form
          </a>
          <Selector onSelected={this.load} />
        </nav>

        <div className="container-fluid">
          <div className="row">

            <div className="col-sm-7 left-nav">
              <div className="container sticky-top"> 
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
                      className="form-data"
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