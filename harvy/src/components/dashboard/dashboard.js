import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Avatar } from "antd";
import { Link } from "react-router-dom";
import { bold } from "ansi-colors";

import { loginUser } from '../../actions/user'


const { Header, Sider, Content } = Layout;


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      user: null,
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  async componentDidMount() {
    const { loginUser } = this.props
    const email = localStorage.getItem('email');
    if(email !== undefined) {
      loginUser(email)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.users) {
        this.setState({
            user: nextProps.user,
        });
    }
}

  render() {
    const { user } = this.state
    const { collapsed } = this.state;
    return (user !== null)  ? (
      <Layout>
        <div className="logo" />
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          {!collapsed && <Avatar style={{ marginLeft: 70, marginTop: 20 }} size={64} icon="user" />}
          <div className="logo">
            <h1
              style={{
                paddingTop: 10,
                margin: 0,
                textAlign: "center",
                fontWeight: "bolder",
                fontSize: 24,
                color: "white"
              }}
            >
              {this.state.collapsed ? "A" : "Welcome"}
            </h1>
            <h1
              style={{
                margin: 0,
                paddingBottom: 20,
                textAlign: "center",
                fontWeight: "bolder",
                fontSize: 24,
                color: "white"
              }}
            >
              {!this.state.collapsed && user.user.username}
            </h1>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Icon type="home" />
              <span>Home</span>
              <Link to="/maps"></Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="area-chart" />
              <span>Predict Disease</span>
              <Link to="/predict"></Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="user" />
              <span>Profile</span>
              <Link to="/profile"></Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", fontWeight: bold, paddingLeft: 20 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: "100vh"
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
        }
      </Layout>) : <div></div>
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
)(Dashboard)
