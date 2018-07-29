'use strict';

const React = require('react');

const Header = require('./header/header.jsx');

const PopUp = require('./popUp/popUp.jsx');

module.exports = class GameIntarfface extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			popUp: false
		};

		this._openPopUp = this._openPopUp.bind(this);
		this._closePopUp = this._closePopUp.bind(this);
	}

	render() {
		let popUp = null;

		if (this.state.popUp) {
			popUp = (
				<PopUp
					closePopUp={this._closePopUp}
					stateGame={this.props.stateGame}
				/>
			);
		}

		return (
			<div className="inerInterface">
				{popUp}
				<Header
					openPopUp={this._openPopUp}
					stateGame={this.props.stateGame}
				/>
			</div>
		);
	}

	_openPopUp(type) {
		let state = Object.assign({}, this.state, {
			popUp: true,
			type: type
		});

		this.setState(state);
	}

	_closePopUp() {
		let state = Object.assign({}, this.state, {
			popUp: false,
			type: null
		});

		this.setState(state);
	}
}