import React from 'react';
import './HelloWorld.css';
import reactLogo from '../../logo.svg';
import "../../dce"; // import side effects. engineResourcePath, so on.
import "../../ddn"; // import side effects. The license, engineResourcePath, so on.
import { DocumentNormalizer } from "@scannerproxy/ddnjs";
import VideoNormalizer from '../VideoNormalizer/VideoNormalizer';
import ImgNormalizer from '../ImgNormalizer/ImgNormalizer';

class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bShowVideoNormalizer: true
        };
    }
    async componentDidMount() {
        try {
            DocumentNormalizer.loadWasm();
        } catch (ex) {
            let errMsg;
            if (ex.message.includes("network connection error")) {
                errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
            } else {
                errMsg = ex.message||ex;
            }
            console.error(errMsg);
            alert(errMsg);
        }
    }

    showVideoNormalizer = () => {
        this.setState({
            bShowVideoNormalizer: !this.state.bShowVideoNormalizer,
        });
    }
    
    render() {
        return (
            <div className="helloWorld">
                <h1>Hello World for React<img src={reactLogo} className="App-logo" alt="logo" /></h1>
                <div className="btn-group">
                    <button style={{marginRight: '5px', backgroundColor: this.state.bShowVideoNormalizer ? 'rgb(255,174,55)' : 'white'}} onClick={this.showVideoNormalizer}>Video Normalizer</button>
                    <button style={{marginRight: '5px', backgroundColor: !this.state.bShowVideoNormalizer ? 'rgb(255,174,55)' : 'white'}} onClick={this.showVideoNormalizer}>Image Normalizer</button>
                </div>
                <div className="container">
                    {this.state.bShowVideoNormalizer ? (<VideoNormalizer></VideoNormalizer>) : ""}
                    {!this.state.bShowVideoNormalizer ? (<ImgNormalizer></ImgNormalizer>) : ""}
                </div>
            </div>
        );
    }
}
export default HelloWorld;