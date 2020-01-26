import React, { Component } from "react";
import { connect } from 'react-redux'
import { Input, Button, Row, Col } from 'antd';
import { loginUser } from '../../actions/user'



class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email:"ashik9591@gmail.com",
      password: "password"
    }
    this.onEmailChange = this.onEmailChange.bind(this)
  }

  onLoginClick = () => {
    const { loginUser } = this.props;
    const { email }= this.state;
    loginUser(email)
    this.props.history.push('/maps');
  }
  
  onEmailChange = (e) => {
    this.setState({email: e.target.value})
  }


  render() {
    return (<div>
      <Row>
      <Col style={{paddingTop: 250}} span={8} offset={8}>
        <h1>Login</h1>
        <Input style={{marginBottom: 20}} placeholder="email" value={this.state.email} onChange={this.onEmailChange} />
        <Input type="password" value={this.state.password} placeholder="password" />
        <Button style={{marginTop: 20}} type="primary" onClick={this.onLoginClick}>Login</Button>
      </Col>
    </Row>
    </div>)
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  loginUser: (email) => {
    dispatch(loginUser(email))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)


