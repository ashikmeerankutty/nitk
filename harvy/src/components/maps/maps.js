import React, { Component } from "react"
import { connect } from 'react-redux'
import { GoogleMap, Marker, withGoogleMap, withScriptjs, TrafficLayer, Polygon } from "react-google-maps"
import { compose, withProps } from "recompose"
import { loginUser } from '../../actions/user'
import { Modal } from "antd";


const coordinates = [
  { lat: 13.0075927, lng: 74.7922198 },
  { lat: 13.0111782, lng: 74.7920696 },
  { lat: 13.0135459, lng: 74.7900097 },
  { lat: 13.0125346, lng: 74.7892962 },

]

const MapChildComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=",
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
    {props.polygons.map((data) => (
      <Polygon
        path={data.lands}
        key={data.crops}
        onClick={(polygon) => props.showDetails(data)}
        editable={true}
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35
        }}
      />))}

  </GoogleMap>
)

class MapComponent extends Component {
  _isMounted = false;

  constructor(props) {
    super(props)
    this.state = {
      latitude: null,
      longitude: null,
      currentData: null
    }
  }
  async componentDidMount() {
    this._isMounted = true;
    await navigator.geolocation.getCurrentPosition(
      position => this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }),
      err => console.log(err)
    );

    const { user } = this.props
    loginUser(user.user.email)

    this.delayedShowMarker()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.users) {
      this.setState({
        user: nextProps.user,
        currentData: null
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }
  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
  }

  showDetails = (data) => {
    this.setState({
      currentData: data
    })
    this.showModal()
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { currentData } = this.state
    const { user } = this.props
    user.user.landData.lands.map((e) => {
      e.lands.map((hashmap) => {
        Object.keys(hashmap).forEach(function (key) {
          let newKey = "lat";
          if (key === "latitude") {
            hashmap[newKey] = hashmap[key];
            delete hashmap[key]
          }
        });
      })
    })
    user.user.landData.lands.map((e) => {
      e.lands.map((hashmap) => {
        Object.keys(hashmap).forEach(function (key) {
          let newKey = "lng";
          if (key === "longitude") {
            hashmap[newKey] = hashmap[key];
            delete hashmap[key]
          }
        });
      })
    })
    const { latitude, longitude } = this.state
    return latitude !== null && user !== null && user.user !== null ? (
      <div>
        <MapChildComponent
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          latitude={latitude}
          longitude={longitude}
          polygons={user.user.landData.lands}
          showDetails={this.showDetails}
        />
        <div>
           { currentData !== null && <Modal
            title="Crop Details"
            visible={this.state.visible}
            onOk={this.handleCancel}
            onCancel={this.handleCancel}
          >
            <p>Current Crop : {currentData.crops}</p>
            <p>Surface Temperature of Land: {currentData.surfaceTemp} deg Celsius</p>
            <p>UVI Value: {currentData.uvivalue }</p>
            <p>UVI Expose Risk: {currentData.uviexposerisk }</p>
            <p>Temperature: {currentData.temperature } deg Celsius</p>
            <p>Humidity: {currentData.humidity }</p>
            <p>Suggested Crops: {currentData.suggested }</p>
           </Modal> }
        </div>
      </div>
    ) : <div></div>
  }

}
const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  loginUser: (email) => {
    dispatch(loginUser(email))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapComponent);