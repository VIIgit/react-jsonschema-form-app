import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'codemirror/lib/codemirror.css';

import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/keymap/sublime.js';
import {Controlled as CodeMirror} from 'react-codemirror2';
import { shouldRender } from 'react-jsonschema-form/lib/utils';

const cmOptions = {
  mode: {
    name: 'javascript',
    json: true,
    statementIndent: 2,
  },
  keyMap: 'sublime',
  extraKeys: {
    'Tab': 'indentMore'
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
  indentUnit: 2,
  tabSize: 2
};

class Editor extends Component {
  
  constructor(props) {
    super(props);    
    this.state = { 
      yaml: props.yaml ? true : false,
      code: props.codeAsString
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ 
      yaml: props.yaml ? true : false,
      code: props.codeAsString
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  render() {
    const {
      code
    } = this.state;
    const {
      onSchemaChange,
      yaml
    } = this.props;
    const editorOptions = yaml ? yamlCmOptions : cmOptions;
    return (
      <div className="">
        <CodeMirror
          value={code}
          onChange={onSchemaChange}
          editorDidMount={(editor) => {
            editor.refresh();
            setTimeout(function () {
              editor.refresh();
            }, 3);
          }}
          onBeforeChange={(editor, data, value) => {             
            this.setState({code: value});
          }}
          options={editorOptions}
        />
      </div>
    );
  }
}

export default Editor;