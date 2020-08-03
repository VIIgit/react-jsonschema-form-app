import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

class SchemaValidationException extends Component {

    render() {
      const { formDataError } = this.props;
      
      if (!formDataError || !formDataError.validationErrors) {
        return <div/>;
      }

      return (

        <div className="text-small">
          <div className="padding10"><textarea className="form-control textarea-scroll" rows="10" readonly value={formDataError.plainText}></textarea>
          </div>
          <h4> Details</h4><p>
          <div className="input-group">

            <ul className="list-group list-group-flush">
            {
              formDataError.validationErrors.map((validationError, id) => (
                <li className="list-group-item">
                  <dl className="row">
                    <dt className="col-sm-3 text-danger">{validationError.dataPath}</dt>
                    <dd className="col-sm-9">{validationError.message}</dd>
                    <dt className="col-sm-3">Keyword</dt>
                    <dd className="col-sm-9">{validationError.keyword}</dd>
                    <dt className="col-sm-3">SchemaPath</dt>
                    <dd className="col-sm-9">{validationError.schemaPath}</dd>
                    <dt className="col-sm-3">Details</dt>
                    <dd className="col-sm-9 font-italic">{JSON.stringify(validationError.params)}</dd>
                  </dl>
                </li>
              ))
            }
            </ul>
          </div>
          </p>
             
        </div>
      );
    }
  }
  
  export default SchemaValidationException;