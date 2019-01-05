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
    mode: 'javascript',
    lineNumbers: true,
    readOnly: false,
    autoRefresh: true,
    autofocus: true,
    matchBrackets: true,
    styleActiveLine: true,
    tabSize: 2
  };

  const XcmOptions = {
    height: "auto",
    viewportMargin: Infinity,
    mode: {
      name: 'javascript',
      json: true,
      statementIndent: 2,
    },
    lineNumbers: true,
    lineWrapping: true,
    indentWithTabs: false,
    tabSize: 2,
  };

const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
const ajv = new Ajv({schemaId: 'auto'}); // options can be passed, e.g. {allErrors: true}

class Editor extends Component {
    constructor(props) {
      super(props);
      this.state = { valid: true, code: props.code, validationSchema: props.validationSchema };
    }
  
    componentWillReceiveProps(props) {
      //this.setState({ valid: true, code: props.code });
    }
  
    shouldComponentUpdate(nextProps, nextState) {
      return shouldRender(this, nextProps, nextState);
    }

    toValidJsonObject(code){
      return fromJson(code);
    }

    validateJsonObject(jsonObj){
      return ajv.validate(this.props.validationSchema, jsonObj);
    }

    onCodeChange = (editor, metadata, code) => {
      
      this.setState({ valid: true,
        errorTitle: undefined,
        errorDescription: undefined });
      
      setImmediate(() => {
        try {
            var jsonObj = this.toValidJsonObject(code);
            var valid = this.validateJsonObject(jsonObj);
            if (!valid) {
              
              this.setState({ 
                  valid: false, 
                  errorTitle: 'Invalid Json Schema',
                  errorDescription: ajv.errorsText()
                  });
                    
            } else {
               this.props.onChange(jsonObj);
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
                  errorTitle: 'Error'
                });
                    
            }
        }
      });
    };
  
    render() {
      const { title, children } = this.props;
      const icon = this.state.valid ? "ok" : "nok";
      const cls = this.state.valid ? "valid" : "invalid";

      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <span className={`${cls} rounded-circle unicode_${icon}`} />
            {" " + title}
          </div>

          {children ? (
            children
          ) : ''}

          <CodeMirror
            value={this.state.code}
            onChange={this.onCodeChange}
            autoCursor={false}
            options={Object.assign({}, cmOptions)}
          />
          <AlertMessage 
            show={!this.state.valid} 
            title={this.state.errorTitle} 
            description={this.state.errorDescription}
          />
        </div>
      );
    }
  }

  export default Editor;