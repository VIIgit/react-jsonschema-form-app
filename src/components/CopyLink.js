import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
class CopyLink extends Component {
    onCopyClick = event => {
      this.input.select();
      document.execCommand("copy");
    };
  
    render() {
      const { shareURL, onShare } = this.props;
      if (!shareURL) {
        return (
          <Button className="btn btn-dark" type="button" onClick={onShare}>
            Share
          </Button>
        );
      }
      return (
        <div className="input-group">
          <input
            type="text"
            ref={input => (this.input = input)}
            className="form-control"
            defaultValue={shareURL}
          />
          <span className="input-group-btn">
            <Button
              className="btn btn-default"
              type="button"
              onClick={this.onCopyClick}>
            </Button>
          </span>
        </div>
      );
    }
  }
  
  export default CopyLink;