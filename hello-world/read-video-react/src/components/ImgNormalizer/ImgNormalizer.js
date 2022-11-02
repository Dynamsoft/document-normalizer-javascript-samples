import React, { Component } from 'react';
import { DocumentNormalizer } from "@scannerproxy/ddnjs";
import './ImgNormalizer.css'

export default class ImgNormalizer extends Component {
  constructor(props) {
    super(props);
    this.pNormaelizer = null;
    this.elInr = React.createRef();
  }

  normalizeImg = async (e) => {
    try {
      const normalizer = await (this.pNormaelizer = this.pNormaelizer || DocumentNormalizer.createInstance());
      let results = await normalizer.detectQuad(e.target.files[0]);
      this.elInr.current.innerHTML = "";
      for(let item of results) {
        const norRes = await normalizer.normalize(e.target.files[0], {quad: item.location});
        const cvs = norRes.image.toCanvas();
        if(document.body.clientWidth < 600) {
          cvs.style.width = "100%";
        }
        this.elInr.current.appendChild(cvs);
      }
      console.log(results);
    } catch(ex) {
      let errMsg;
      if (ex.message.includes("network connection error")) {
        errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
      } else {
        errMsg = ex.message||ex;
      }
      console.error(errMsg);
      alert(errMsg);
    }
    e.target.value = '';
  }

  async componentWillUnmount() {
    if (this.pNormalizer) {
      (await this.pNormalizer).dispose();
      this.pNormalizer = null;
      console.log('ImgNormalizer Component Unmount');
    }
  }

  render() {
    return (
      <div>
        <div className="ImgNormalizer"><input type="file" onChange={this.normalizeImg}/></div>
        <div className="img-normalized-result" ref={this.elInr}></div>
      </div>
    )
  }
}