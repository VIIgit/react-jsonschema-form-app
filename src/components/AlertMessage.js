import React from 'react';
import { Alert } from 'react-bootstrap';

class AlertMessage extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
  
      this.state = {
        show: props.show,
        title: props.title,
        description: props.description
      };
    }

    shouldComponentUpdate(nextProps) {
      console.log('YESSS' + JSON.stringify(nextProps)   );
      const differentShow = this.props.show !== nextProps.show;
      const differentTitle = this.props.title !== nextProps.title;
      const differentDescription = this.props.description !== nextProps.description;
      
      const update = differentShow || differentTitle || differentDescription;
      
      console.log( update + '\nP--' + JSON.stringify(this.props) + '\nState---' + JSON.stringify(this.state) );
      return update;
    }

    handleShow() {
      this.setState({ show: true });
    }
  
    render() {
      console.log('render called');
      if (this.props.show) {
        return (
          <Alert bsStyle="danger" >
            <h4>{this.props.title}</h4>
            {this.props.description}
            
          </Alert>
        );
      } else {
        return (
          <span/>
        );
      }
  
    }
  }

  export default AlertMessage;