/* global google */
import React, { Component } from "react"
import { GoogleMap, Marker, withGoogleMap, withScriptjs, TrafficLayer, Polygon } from "react-google-maps"
import { compose, withProps } from "recompose"
import { Button, Modal, Input } from 'antd';

import axios from 'axios'

import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";


const coordinates = [
  { lat: 13.0075927, lng: 74.7922198 },
  { lat: 13.0111782, lng: 74.7920696 },
  { lat: 13.0135459, lng: 74.7900097 },
  { lat: 13.0125346, lng: 74.7892962 },
]

const MapChildComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=&libraries=drawing",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}
  >
    {/* <Polygon
      path={props.lands}
      key={1}
      clickable={true}
      onClick={(polygon) => setNewLats(polygon)}
      editable={true}
      draggable={true}
      options={{
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
      }}
    /> */}
    <DrawingManager
      defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
      onPolygonComplete={props.onPolygonComplete}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: { editable: true, clickable: true },
      }}
    />
  </GoogleMap>
)


class ProfileMapComponent extends Component {

  _isMounted = false;

  constructor(props) {
    super(props)
    this.state = {
      latitude: null,
      longitude: null,
      lands: null,
      loading: false,
      visible: false,
      crop: null,
      coords: null,
      path: [],
      landVal: [],
    }
    this.onAddCropChange = this.onAddCropChange.bind(this)
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = async () => {
    const { crop, path, landVal } = this.state
    this.setState({ loading: true });
    // setTimeout(() => {
    //   this.setState({ loading: false, visible: false });
    // }, 3000);
    const data = {
      "crops": crop,
      "lands": path
    }
    landVal.push(data);
    this.setState({ landVal })
    console.log(landVal)
    this.setState({ loading: false, visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  async componentDidMount() {
    this._isMounted = true;
    await navigator.geolocation.getCurrentPosition(
      position => this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, newState => this.updateLands()),
      err => console.log(err)
    );
    this.delayedShowMarker()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateLands = () => {
    const { latitude, longitude } = this.state
    const lands = [
      { lat: latitude + 0.0000007, lng: longitude + 0.0002198 },
      { lat: latitude + 0.0035855, lng: longitude + 0.0020696 },
      { lat: latitude + 0.0023677, lng: longitude + 0.0020000 },
      { lat: latitude + 0.0010113, lng: longitude + 0.0192962 },
    ]
    this.setState({ lands })
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }
  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
  }

  onAddCropChange = (e) => {
    this.setState({ crop: e.target.value })
  }

  onPolygonComplete = (poly) => {
    const polyArray = poly.getPath().getArray();
    let paths = [];
    polyArray.forEach(function (path) {
      paths.push({ latitude: path.lat(), longitude: path.lng() });
    });
    this.setState({ path: paths })

  }

  submitButton = async () => {
    const { landVal } = this.state
    const data = {
      "email": "ashik9591@gmail.com",
      "lands": landVal
    }
    const res = await axios.post('api/v1/updatePath', { email: "ashik9591@gmail.com", data })
    console.log(res)
  }

  render() {
    const { latitude, longitude, lands } = this.state
    const { visible, loading } = this.state;
    return (latitude !== null && lands !== null) ? (
      <div>
        <MapChildComponent
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          latitude={latitude}
          longitude={longitude}
          lands={lands}
          onClick={() => console.log("hey")}
          onPolygonComplete={this.onPolygonComplete}
        />
        <div style={{ display: "flex" }}>

          <Button type="primary" style={{ marginTop: 50 }} onClick={this.showModal}>Add Current Crops</Button>
          <Button type="primary" style={{ marginTop: 50, marginLeft: 30 }} onClick={this.submitButton}>Submit</Button>
          <Modal
            visible={visible}
            title="Title"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancel
            </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                Add
            </Button>,
            ]}
          >
            <h3>Crops</h3>
            <Input type="input" placeholder="Add crops" onChange={this.onAddCropChange}></Input>
          </Modal>

        </div>
      </div>
    ) : <div></div>
  }

}


export default ProfileMapComponent