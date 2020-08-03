import { Component } from 'react';
import Ajv from 'ajv';
import betterAjvErrors from 'better-ajv-errors';

import { deepEquals } from "react-jsonschema-form/lib/utils";

// You need to pass `jsonPointers: true` see https://www.npmjs.com/package/better-ajv-errors
const ajv = new Ajv({ jsonPointers: true, allErrors: true, unknownFormats: false });

class JsonSchemaValidator extends Component {
  
  constructor(props) {
    super(props);
    this.validationSchema = undefined;
    this.compiledSchema = undefined;
    this.error= undefined;

    ajv.addFormat("text/markdown", function(data, cb) {
      return true;
    });
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

        const output = betterAjvErrors(compiledSchema, jsonObj, compiledSchema.errors, {format: 'cli', indent: 2});
        return {
          title: 'Invalid Form Data',
          validationErrors: compiledSchema.errors,
          plainText: output
        };
      }
    }
    return undefined;
  }
  
}

export default JsonSchemaValidator;