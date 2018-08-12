'use strict';

const React = require('react');

const HeaderIcon = require('./innerHeader/headerIcon/HeaderIcon.jsx');
const HeaderStatus = require('./innerHeader/headerStatus/headerStatus.jsx');
const HeaderItems = require('./innerHeader/headerItems/headerItems.jsx');

module.exports = class Header extends React.Component {
	render() {
		return (
			<header className="header">
				<HeaderIcon />
				<HeaderStatus stateGame={this.props.stateGame} />
				<HeaderItems
					openPopUp={this.props.openPopUp}
					stateGame={this.props.stateGame}
				/>
			</header>
		);
	}
}