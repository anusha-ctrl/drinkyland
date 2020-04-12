import React, {Component} from "react";
import {Form, FormControl } from 'react-bootstrap';

class NameForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.name = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.name.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter email" />
        </Form.Group>

        <Button variant="primary" type="submit" onclick="handleSubmit">
          Submit
        </Button>
      </Form>
    );
  }
}
