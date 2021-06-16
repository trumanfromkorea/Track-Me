/* eslint-disable */
import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Patient, Quarantine, Notice, Collection } from '/';
import imgfile from './title.png'

class mainManagePage extends Component {

  state = { activeItem: '확진자 정보 관리' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (

      <Router>

        <Link to="/">
          <div className='title-Pos'>
            <img className="title-img" src={imgfile} />
          </div>
        </Link>
        <Menu pointing vertical className="menu-Bar">
          <Link to="/"><Menu.Item
            name='확진자 정보 관리'
            active={activeItem === '확진자 정보 관리'}
            onClick={this.handleItemClick}
          /></Link>
          <Link to="/quarantine"><Menu.Item
            name='자가격리자 현황 관리'
            active={activeItem === '자가격리자 현황 관리'}
            onClick={this.handleItemClick}
          /></Link>
          <Link to="/notice"><Menu.Item
            name='공지사항 정보 관리'
            active={activeItem === '공지사항 정보 관리'}
            onClick={this.handleItemClick}
          /></Link>
          <Link to="/collection"><Menu.Item
            name='데이터 관리'
            active={activeItem === '데이터 관리'}
            onClick={this.handleItemClick}
          /></Link>

        </Menu>

        <Switch>
          <Route path="/patient">
            <Patient />
          </Route>
          <Route path="/quarantine">
            <Quarantine />
          </Route>
          <Route path="/notice">
            <Notice />
          </Route>
          <Route path="/collection">
            <Collection />
          </Route>
          <Route exact path="/">
            <Patient />
          </Route>
        </Switch>

      </Router>
    )
  }
}

export default mainManagePage;