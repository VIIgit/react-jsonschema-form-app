import React, { Component } from 'react';
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
    tabSize: 2,
    indentWithTabs: true
  };

  const yamlCmOptions = {
    mode: 'text/yaml',
    height: 'auto',
    lineNumbers: true,
    lineWrapping: true,
    readOnly: false,
    autoRefresh: true,
    autofocus: true,
    matchBrackets: true,
    viewportMargin: Infinity,
    styleActiveLine: true,
    indentWithTabs: false,
    indentUnit: 5,
    tabSize: 5,
    extraKeys: {
      Tab: function(cm){
        var spaces = '::';
        cm.replaceSelection(spaces);
    }
  }
  };
class Editor extends Component {
  
  constructor(props) {
    super(props);

    this.jsonSchemaValidator = props.jsonSchemaValidator;
    
    this.state = { 
      valid: undefined
    };

    this.onCodeChange = this.onCodeChange.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ 
      valid: true, 
      yaml: props.yaml ? true : false,
      converter: props.converter,
      codeObject: props.codeObject,
      code: props.converter.toString(props.codeObject)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

    onCodeChange = (editor, metadata, code) => {
     
      const { onChange } = this.props;
      
        try {
          var jsonObj = this.state.converter.toObject(code);
          var valid = this.jsonSchemaValidator.setJsonObject(jsonObj).validate();
          if (valid ) {
            this.setState({ valid: true,
              errorTitle: undefined,
              errorDescription: undefined,
              codeObject: jsonObj
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
      const {
        code,
        valid,
        errorTitle,
        errorDescription
      } = this.state;

      return (
        <div className="">
          <CodeMirror
            value={code}
            onChange={this.onCodeChange}
            editorDidMount={(editor) => {
              editor.refresh();
            }}
            onBeforeChange={(editor, data, value) => {
                if (data.origin == 'pasteXXXXXXXXXX') {

                  if (data.text.length > 1 ){
                    const result = this.state.converter.convertToString(data.text.join('\n'));

                    if (result.stringified && !result.errorMsg){

                      if (!(data.from.line == 0 && data.from.ch == 0)){
                        // remove object's brackets
                        result.stringified = result.stringified.substring(1, result.stringified.length-1)+ ',';
                      }

                      alert("Converted to:\n" + result.stringified);

                      editor.refresh();
                      // my first idea was
                      // note: for multiline strings may need more complex calculations
                      editor.replaceRange(result.stringified, data.from, data.to);
                      // first solution did'nt work (before i guess to call refresh) so i tried that way, works too
                      /* cm.execCommand('undo');
                      cm.setCursor(event.from);
                      cm.replaceSelection(new_text); */

                    } else {
                      this.setState({code: value});
                    }
                    editor.setCursor(data.to);
                  } else {
                    editor.replaceRange(data.text, data.from, data.to);
                    editor.setCursor(data.to);
                  }
  
                } else {

                  //editor.replaceRange(data.text, data.from, data.to);
                  //editor.setCursor(data.to);                  
                  this.setState({code: value});
                }

            }}
            options={Object.assign({}, this.yaml ? yamlCmOptions : cmOptions)}

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