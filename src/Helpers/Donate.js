//@flow
import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";


// Styling
import '../css/Disclaimer.scss';
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
  show: boolean,
  onHide: void => void
};

 export default class Donate extends Component<Props, any> {
  render () {
    return (
      <div>
        <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.show}
        onHide={this.props.onHide}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter"><strong>Donation Resources</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul className="donation-list">
              <li><a href="https://secure.actblue.com/donate/ms_blm_homepage_2019">Black Lives Matter</a></li>
              <li><a href="https://www.naacp.org/">NAACP</a></li>
              <li><a href="NAACP Legal Defense Fund">NAACP Legal Defense Fund</a></li>
              <li><a href="https://www.playbill.com/article/bit.ly/localbailfunds">National Bail Fund Network</a></li>              
              <li><a href="https://www.lgbtqfund.org/">LGBTQ Freedom Fund</a></li>              
              <li><a href="https://www.feedingamerica.org/take-action/coronavirus">Feeding America (COVID-19)</a></li>              
            </ul>
          </Modal.Body>
        </Modal>
      </div>
      );
    }
  }
