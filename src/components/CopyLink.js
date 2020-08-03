import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
class CopyLink extends Component {

    onCopyClick = () => {
      this.input.select();
      document.execCommand("copy");
      const { onShare } = this.props;
      onShare(true);
    };
  
    onShareClick = () => {
      const { onShare } = this.props;
      onShare(false);
    };

    render() {
      const { shareURL } = this.props;
      if (!shareURL) {
        return (
          <Button className="btn btn-sm btn-outline-light" type="button" onClick={this.onShareClick}>
            Share
          </Button>
        );
      }
      return (
        <div className="input-group" style={{width: "300px"}}>
          <input
            type="text"
            ref={input => (this.input = input)}
            className="form-control"
            defaultValue={shareURL}
          />
          <span className="input-group-btn">
            <Button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.onCopyClick}>
              Copy
            </Button>
          </span>
        </div>
      );
    }
  }
  
  export default CopyLink;