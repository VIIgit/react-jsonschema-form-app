import { Component } from 'react';
import Ajv from 'ajv';

import { deepEquals } from "react-jsonschema-form/lib/utils";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

class JsonSchemaValidator extends Component {
  
  constructor(props) {
    super(props);
    this.validationSchema = undefined;
    this.compiledSchema = undefined;
    this.jsonObj =  undefined;

    ajv.addFormat("markdown", function(data, cb) {
      return true;
    });
    ajv.addFormat("decimal", function(data, cb) {
      return !isNaN(data);
    });
    ajv.addFormat("percentage", function(data, cb) {
      return !isNaN(data);
    });
    ajv.addFormat("text/plain", function(data, cb) {
      return true;
    });
    ajv.addFormat("color", function(data, cb) {
      return true;
    });
    ajv.addFormat("data-url", function(data, cb) {
      return true;
    });
    ajv.addFormat("int64", function(data, cb) {
      return !isNaN(data);
    });
    ajv.addFormat("int32", function(data, cb) {
      return !isNaN(data);
    });
    
    this.compiledSchema = ajv.compile(props.validationSchema);

    this.state = { 
        error: undefined
    };
  }

  updateValidationSchema(validationSchema){
    if (!deepEquals(this.validationSchema, validationSchema)){
      try{
        this.compiledSchema = validationSchema ? ajv.compile(validationSchema) : undefined;
        this.setState({
          error: undefined
        });
      } catch(ex){
        this.compiledSchema = undefined;
        this.setState({
          error: {
              title: 'Invalid Schema',
              description:  ex.message
          }
        });
      }
    }
  }

  setJsonObject(jsonObj){
    this.jsonObj = jsonObj;
    return this;
  }
  
  validate(){
    const compiledSchema  = this.compiledSchema;
    if (!this.jsonObj){
      this.setState({ 
        error: {
          title: 'Empty',
          description:  ''
        }
      });
      return false;
    }

    if (compiledSchema) {
      if( !compiledSchema(this.jsonObj)){
        var messages = compiledSchema.errors.map(function(item) {
          return   item['dataPath'] + ' ' + item['message'];
        });
        this.setState({ 
          error: {
            title: 'Invalid Data',
            description:  messages.toString()
          }
        });
        return false;
      };
    }
    this.setState({ 
      error: undefined
    });
    return true;
  }

  shouldComponentUpdate(nextProps, nextState){
    const stateChange =  this.state.error === nextState.error;
    if (stateChange && this.onChange){
      this.onChange();
    }
    return stateChange;
  }
  isValid(){
    return this.state.error === undefined;
  }
}

export default JsonSchemaValidator;