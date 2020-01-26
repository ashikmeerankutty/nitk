import React, { Component } from 'react'
import { Upload, Icon, message, Button } from 'antd';
import axios from 'axios'
import request from 'requests'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class Predict extends Component {
  state = {
    loading: false,
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

   uploadButton =  (upload) => {
     
  //   const headers = {
  //     'Content-Type': 'application/octet-stream'
  //   }

  //   const dataString = this.state.imageUrl;


  //   const options = {
  //     headers: headers,
  //     body: upload.file,
  //     auth: {
  //         'user': 'ashik9591@gmail.com',
  //         'pass': 'iamnotafraid'
  //     }
      
  // }
  // axios.post('https://api.deepgreen.ai/v1/models/plant_disease_detection_closeup/prediction',{
  //   dataBinary:upload.file,
  //   auth: {
  //     "user": "ashik9591@gmail.com",
  //     "pass": "iamnotafraid"
  //   }
  // }, headers={
  //   "Content-Type": "application/octet-stream",

  // }).then((res) => {
  //   console.log(res)
  // })
  // function callback(error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //       console.log(body);
  //   }
  // }
  // request(options, callback)
}

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <div>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={(hi) => this.uploadButton(hi)}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <Button type="button" onClick={ this.uploadButton }>Upload</Button>
      </div>
    );
  }
}

export default Predict