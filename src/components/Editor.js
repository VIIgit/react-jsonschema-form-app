import React, { Component } from 'react';
import Ajv from 'ajv';

import {UnControlled as CodeMirror} from 'react-codemirror2';
import { shouldRender } from "react-jsonschema-form/lib/utils";

import AlertMessage from './AlertMessage';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'codemirror/lib/codemirror.css';

const cmOptions = {
    mode: {
      name: 'javascript',
      json: true,
      statementIndent: 2,
    },
    height: 'auto',
    lineNumbers: true,
    lineWrapping: true,
    readOnly: false,
    autoRefresh: true,
    autofocus: false,
    matchBrackets: true,
    viewportMargin: Infinity,
    styleActiveLine: true,
    indentWithTabs: false,
    tabSize: 2
  };

const fromJson = json => JSON.parse(json);
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

class Editor extends Component {
  //ajv.addSch
  validate = undefined;
  
  constructor(props) {
    super(props);
    this.state = { 
      valid: undefined, 
      code: props.code
    };
    ajv.addFormat("markdown", function(data, cb) {
      return true;
    });
    ajv.addFormat("decimal", function(data, cb) {
      return !isNaN(data);
    });
    ajv.addFormat("percentage", function(data, cb) {
      return !isNaN(data);
    });
    
    this.validate = props.validationSchema ? ajv.compile(props.validationSchema) : undefined
  }
  
    componentWillReceiveProps(props) {
      this.setState({ valid: true, code: props.code });
    }
  
    shouldComponentUpdate(nextProps, nextState) {
      return shouldRender(this, nextProps, nextState);
    }

    toValidJsonObject(code){
      return fromJson(code);
    }

    validateJsonObject(jsonObj){
      if (this.validate) {
        //var valid = 
        if( !this.validate(jsonObj)){
          var messages = this.validate.errors.map(function(item) {
            return   item['dataPath'] + ' ' + item['message'];
          });
          this.setState({ 
            valid: false, 
            errorTitle: 'Invalid Schema',
            errorDescription: messages.toString()
          });
          return false;
        };
      }
      return true;
    }

    onCodeChange = (editor, metadata, code) => {
      
      const { onChange } = this.props;

      this.setState({ valid: true,
        errorTitle: undefined,
        errorDescription: undefined });
      
      setImmediate(() => {
        try {
            var jsonObj = this.toValidJsonObject(code);
            var valid = this.validateJsonObject(jsonObj);
            if (valid && onChange) {
              onChange(jsonObj);
            } 
        } catch (err) {
            if (err instanceof SyntaxError) {
              this.setState({ 
                  valid: false, 
                  errorTitle: 'Invalid Json ',
                  errorDescription: err.message
                  });
                    
            } else {
              this.setState({ valid: false,
                  errorTitle: 'Error',
                  errorDescription: err.message
                });
              console.log(err.stack);
            }
        }
      });
    };
  
    render() {
      const { title } = this.props;
      const icon = this.state.valid ? "ok" : "nok";
      const cls = this.state.valid ? "valid" : "invalid";

      const {
        code,
        valid,
        errorTitle,
        errorDescription,
      } = this.state;

      return (
        <div className="panel panel-default">

          <div className={`${cls} panel-heading btn-toolbar justify-content-between`} role="toolbar" aria-label="Toolbar with button groups">
            <div >
              <span className={`rounded-circle unicode_${icon}`} />
                {" " + title}
            </div>
          </div>

          <CodeMirror
            value={code}
            onChange={this.onCodeChange}
            autoCursor={false}
            options={Object.assign({}, cmOptions)}
          />
          <AlertMessage 
            show={!valid} 
            title={errorTitle} 
            description={errorDescription}
          />
        </div>
      );
    }
  }

  export default Editor;