import React, { Component } from 'react';
import Ajv from 'ajv';
import YAML from 'yaml';

import {Controlled as CodeMirror} from 'react-codemirror2';
import { shouldRender, deepEquals } from "react-jsonschema-form/lib/utils";

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
  
  validate = undefined;
  validationSchema = undefined;

  constructor(props) {
    super(props);
    ajv.addFormat("markdown", function(data, cb) {
      return true;
    });
    ajv.addFormat("decimal", function(data, cb) {
      return !isNaN(data);
    });
    ajv.addFormat("percentage", function(data, cb) {
      return !isNaN(data);
    });
    
    this.updateValidationSchema(props.validationSchema);
    
    this.state = { 
      valid: undefined, 
      code: props.code
    };
  }
  
  updateValidationSchema(validationSchema){
    if (!deepEquals(this.validationSchema, validationSchema)){
      this.validationSchema= validationSchema;
      try{
        this.validate = validationSchema ? ajv.compile(validationSchema) : undefined;
      } catch(ex){
        this.validate = undefined;
        this.setState({ 
          valid: false, 
          errorTitle: 'Invalid Schema',
          errorDescription: ex.message
        });
      }
    }
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
      const validate  = this.validate;
      if (validate) {
        if( !validate(jsonObj)){
          var messages = validate.errors.map(function(item) {
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

    convertYamlToJson = (potentialYaml) => {
      var result = {json: undefined, errorMsg: undefined};
      if (potentialYaml.indexOf('{') < 0 && potentialYaml.indexOf('[') < 0 ){
        try{
          var yamlText = YAML.parse(potentialYaml);
          result.json = JSON.stringify(yamlText);
        } catch (ex){
          result.errorMsg = ex.message;
        }
      }
      return result;
    }

    onCodeChange = (editor, metadata, code) => {
     
      const { onChange } = this.props;
      
      
        try {
            var jsonObj = this.toValidJsonObject(code);
            var valid = this.validateJsonObject(jsonObj);
            if (valid ) {
              this.setState({ valid: true,
                errorTitle: undefined,
                errorDescription: undefined,
                code: code
               });

              if (onChange){
                onChange(jsonObj);
              }
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
    };
  
    render() {
      const { title, validationSchema} = this.props;
      const icon = this.state.valid ? "ok" : "nok";
      const cls = this.state.valid ? "valid" : "invalid";

      const {
        code,
        valid,
        errorTitle,
        errorDescription,
      } = this.state;

      this.updateValidationSchema(validationSchema);

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
            editorDidMount={(editor) => {
              editor.refresh();
            }}
            onBeforeChange={(editor, data, value) => {

                if (data.origin == 'paste') {

                  if (data.text.length > 1 ){
                    const result = this.convertYamlToJson(data.text.join('\n'));

                    if (result.json){

                      if (!(data.from.line == 0 && data.from.ch == 0)){
                        result.json = result.json.substring(1, result.json.length-1)+ ',';
                      }

                      alert("Converted to:\n" + result.json);


                      editor.refresh();
                      // my first idea was
                      // note: for multiline strings may need more complex calculations
                      editor.replaceRange(result.json, data.from, data.to);
                      // first solution did'nt work (before i guess to call refresh) so i tried that way, works too
                      /* cm.execCommand('undo');
                      cm.setCursor(event.from);
                      cm.replaceSelection(new_text); */

                    } else {
                      this.setState({code: value});
                    }
                  }
  
                } else {
                  this.setState({code: value});
                }

              
            }}
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