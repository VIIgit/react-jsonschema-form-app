import React, { Component } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Form from "react-jsonschema-form";
require('bootstrap') ;
require('util');


const schema = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: {type: "string", title: "Title", default: "A new task"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};

const log = (type) => console.log.bind(console, type);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className= "col-4">

          <nav>
            <div class="nav nav-tabs" id="nav-tab1" role="tablist">
              <a class="nav-item nav-link active" id="nav-home-tab1" data-toggle="tab" href="#nav-home1" role="tab" aria-controls="nav-home" aria-selected="true">Form</a>
              <a class="nav-item nav-link" id="nav-contact-tab1" data-toggle="tab" href="#nav-contact1" role="tab" aria-controls="nav-contact" aria-selected="false">Schema</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent1">
            <div class="tab-pane fade show active" id="nav-home1" role="tabpanel" aria-labelledby="nav-home-tab">

              <Form schema={schema}
                            onChange={log("changed")}
                            onSubmit={log("submitted")}
                            onError={log("errors")} />

            </div>
            <div class="tab-pane fade" id="nav-contact1" role="tabpanel" aria-labelledby="nav-contact-tab">..C.</div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
