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

 export default class Disclaimer extends Component<Props, any> {
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
            <Modal.Title id="contained-modal-title-vcenter"><strong>Disclaimer</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul className="disclaimer-list">
              <li>The material and challenges included in the Drinkyland game are for ENTERTAINMENT PURPOSES ONLY. We do not recommend you doing anything that makes you feel uncomfortable, and do not support pressuring individuals into playing the game if they are uncomfortable doing so. The Drinkyland Creators disclaim all liability from actions you take while playing the Drinkyland game.</li>
              <li>Drinkyland is designed as an adult "drinking game" for ages 21+, but can be played without the consumption of alcohol. The Drinkyland Creators disclaim all liability for any cases of accidents, injuries, or loss as a result of using and/or playing the Drinkyland game.</li>
              <li>By PLAYING Drinkyland, you affirm that you are of legal drinking age for your specific region (21 years of age or older in the United States). The Drinkyland Creators do not assume liability for those who disobey their local laws in regards to any activity or idea drawn from the Drinkyland game.</li>
              <li>According to the Surgeon General of the United States (1) women should not drink alcoholic beverages during pregnancy because of the risk of birth defects and (2) consumption of alcoholic beverages impairs your ability to operate machinery and may cause health problems.</li>
              <li>Drinkyland (the game), is designed for ENTERTAINMENT PURPOSES ONLY. In no way do The Drinkyland Creators condone or support the abuse of alcohol beverages. We believe in moderation and caution when using our materials. We do not recommend misuse of alcohol including excessive consumption, binge-drinking, drinking and driving/boating, and/or underage drinking. It is the players’ responsibility to monitor and moderate their alcohol consumption. If played using alcohol, we insist that all players make adequate arrangements for their personal safety and transportation BEFORE playing.</li>
              <li>The Drinkyland Creators disclaim all liability for loss, injury, or damage based upon negligent design or defects in materials and workmanship for the within Drinkyland game. The Drinkyland Creators shall not be liable for any special, indirect, incidental, exemplary, punitive, or consequential damages.</li>
              <li>If you do not agree to these terms, please desist from using this website/game.</li>
            </ul>
          </Modal.Body>
        </Modal>
      </div>
      );
    }
  }
