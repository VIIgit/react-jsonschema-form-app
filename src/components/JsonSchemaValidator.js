import { Component } from 'react';
import Ajv from 'ajv';

import { deepEquals } from "react-jsonschema-form/lib/utils";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

class JsonSchemaValidator extends Component {
  
  constructor(props) {
    super(props);
    this.validationSchema = undefined;
    this.compiledSchema = undefined;
    this.error= undefined;

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
    
    if(props && props.validationSchema){
      this.compiledSchema = ajv.compile(props.validationSchema);
    }

    this.updateValidationSchema = this.updateValidationSchema.bind(this);
    this.getValidationError =  this.getValidationError.bind(this);
  }

  updateValidationSchema(validationSchema){
    if (!deepEquals(this.validationSchema, validationSchema)){
      try{
        this.compiledSchema = validationSchema ? ajv.compile(validationSchema) : undefined;
        this.error= undefined;
      } catch(ex){
        this.compiledSchema = undefined;
        this.error= {
            title: 'Invalid Schema',
            description:  ex.message
          };
      }
    }
  }

  getValidationError(jsonObj){
    if (!jsonObj){
      return {
          title: 'Empty schema',
          description:  ''
        };
    }
    if (this.error){
      return this.error;
    }
    
    const compiledSchema  = this.compiledSchema;
    if (compiledSchema) {
      if( !compiledSchema(jsonObj)){
        var messages = compiledSchema.errors.map(function(item) {
          return item['dataPath'] + ' ' + item['message'];
        });
        return {
          title: 'Invalid Data',
          description:  messages.toString()
        };
      };
    }
    return undefined;
  }
  
}

export default JsonSchemaValidator;