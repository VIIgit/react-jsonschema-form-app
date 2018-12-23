import React, { Component } from "react";
import { render } from "react-dom";

import Form from "react-jsonschema-form";

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

render((
  <Form schema={schema}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")} />
), document.getElementById("app"));




import React from 'react';
class ViewPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.views[0].name};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onChange(event.target.value);
  }

  createSelectItems() {
    let items = [];         
    this.props.views.forEach(element => {         
         items.push(<option key={element.name} value={element.name}>{element.name}</option>);
    })  
    return items;
  } 

  render() {

    return (
      <select value={this.state.value} onChange={this.handleChange} className="selectpicker">
        {this.createSelectItems()}
      </select>
    );
  }
}

export default ViewPicker;
