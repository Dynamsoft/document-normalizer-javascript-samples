import React from 'react';
import './HelloWorld.css';
import reactLogo from '../../logo.svg';
import "../../dcp"; // import side effects. engineResourcePath, so on.
import "../../ddn"; // import side effects. The license, engineResourcePath, so on.
import { DocumentNormalizer } from "shen-dynamsoft-document-normalizer";
import VideoNormalizer from '../VideoNormalizer/VideoNormalizer';
import ImgNormalizer from '../ImgNormalizer/ImgNormalizer';

class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bShowVideoNormalizer: true,
            bShowImageNormalizer: false
        };
    }
    async componentDidMount() {
        try {
            await DocumentNormalizer.loadWasm();
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
            bShowVideoNormalizer: true,
            bShowImageNormalizer: false
        });
    }

    showImageNormalizer = () => {
        this.setState({
            bShowVideoNormalizer: false,
            bShowImageNormalizer: true
        });
    }
    
    render() {
        return (
            <div className="helloWorld">
                <h1>Hello World for React<img src={reactLogo} className="App-logo" alt="logo" /></h1>
                <div className="btn-group">
                    <button style={{marginRight: '5px', backgroundColor: this.state.bShowVideoNormalizer ? 'rgb(255,174,55)' : 'white'}} onClick={this.showVideoNormalizer}>Video Normalizer</button>
                    <button style={{marginRight: '5px', backgroundColor: this.state.bShowImageNormalizer ? 'rgb(255,174,55)' : 'white'}} onClick={this.showImageNormalizer}>Image Normalizer</button>
                </div>
                <div className="container">
                    {this.state.bShowVideoNormalizer ? (<VideoNormalizer></VideoNormalizer>) : ""}
                    {this.state.bShowImageNormalizer ? (<ImgNormalizer></ImgNormalizer>) : ""}
                </div>
            </div>
        );
    }
}
export default HelloWorld;