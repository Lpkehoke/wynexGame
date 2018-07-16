'use strict';

const GLOBAL_SETTING = new (require('../setting/globalSetting.js'))();

const Coor = require('../structOfDate/coordinate.js');
const ExCoor = require('../structOfDate/ExCoordinate.js');

const ControllerBlock = require('../globalClass/state/inerState/place/blocks/controllerBlock.js');

const World = require('../globalClass/world.js');

module.exports = class InnerObject {
	constructor (id, state, coor) {
		this.nesting = true;
		this.patency = false;
		this.state = state;
		this.coor = coor;
		this.id = id;

		this.visable = {};
		this.visable.was = false;
		this.visable.now = false;
		this.visable = this._identifyVisable({newX: coor.x, newY: coor.y}, state);

		this.classNameCSS = '';
		this.classNameBackBlock = 'dirt';
		this.idBackBlock = 1;
		this.DOMObject = null;
	}

	movePerformance(direction) {
		return this._move(direction);
	}

	_identifyVisable(coor, state) {
		const visable = {};
		if (this.watcher === true) {
			visable.now = true;
			visable.was = true;
		} else {
			const startPointWatch = this.state.getStartPiointWatch();
			const size = World.getSize(state);
			visable.was = this.visable.now;
			if (coor.newX - startPointWatch.x < size.heightBlocks
			&&
				coor.newY - startPointWatch.y < size.widthBlocks
			&&
				coor.newX - startPointWatch.x >= 0
			&&
				coor.newY - startPointWatch.y >= 0
			) {
				visable.now = true;
			} else {
				visable.now = false;
			}
		}

		if (this.type === 'weapon' && this.born) {
			this.born = false;
			visable.was = false;
		}

		return visable;
	}

	_move(direction) {
		const id = this.id;
		const ownObject = this;
		const state = this.state;


		let x = this.coor.x;
		let y = this.coor.y;

		let curCoor = new ExCoor(x, y, x, y);

		let newPosition = null;

		switch(direction) {
			case 'right':
				if (GLOBAL_SETTING.numBlocks.width <= curCoor.y+1) {
					return false;
				} else {
					curCoor.newY++;
					newPosition = state.getCellPlace({x:curCoor.x, y:(curCoor.y+1)});
				}
				break;
			case 'left':
				if (0 > curCoor.y - 1) {
					return false;
				} else {
					curCoor.newY--;
					newPosition = state.getCellPlace({x:curCoor.x, y:(curCoor.y-1)});
				}
				break;
			case 'up':
				if (0 > curCoor.x-1) {
					return false;
				} else {
					curCoor.newX--;
					newPosition = state.getCellPlace({x:(curCoor.x-1), y:curCoor.y});
				}
				break;
			case 'down':
				if (GLOBAL_SETTING.numBlocks.height <= curCoor.x+1) {
					return false;
				} else {
					curCoor.newX++;
					newPosition = state.getCellPlace({x:(curCoor.x+1), y:curCoor.y});
				}
				break;
			default:
				throw 'empty direction on move creature: ' + this.id;
		}

		if (newPosition.patency || this.born) {
			return moving(curCoor, this);
		} else {
			return newPosition;
		}

		function moving(coor, creature) {
			if (creature.watcher === true) {
				movingPointAndBais(coor, creature, direction);
			}

			const state = creature.state;

			creature.visable = creature._identifyVisable(coor, state);
			creature._movingVisableSwapingIcon(coor, state);
			changeCoordinate(creature, coor);
			return true;

			function changeCoordinate(player, coor) {
				player.state.setCellPlace({
					x: player.coor.x,
					y: player.coor.y
				}, ControllerBlock.getBlockObject(player.idBackBlock));

				if (player.isCreature) {
					player.state.changeCoorPlayer({
						x: coor.newX,
						y: coor.newY
					}, id);
				} else {
					player.state.changeCoorWeapon({
						x: coor.newX,
						y: coor.newY
					}, id);
				}

				player.state.setCellPlace({
					x: coor.newX,
					y: coor.newY
				}, player);

				player.coor.x = coor.newX;
				player.coor.y = coor.newY;
			}

			function movingPointAndBais(coor, creature, direction) {
				creature.state.setBias(direction);
				creature.state.setPointWatch({x:coor.newX, y:coor.newY}, creature);
			}
		}
	}

	_movingVisableSwapingIcon(coor, state) {
		const startPointWatch = this.state.getStartPiointWatch();
		const world = this.state.getWorldDiv();
		const size = World.getSize(state);

		let div = getBlockWithCreature(this);

		if (this.visable.was === true) {
			this.DOMObject.children[0].remove();
			this.DOMObject = null;
		}

		if (this.visable.now === true) {
			world.children[coor.newX - startPointWatch.x].children[coor.newY - startPointWatch.y].appendChild(div);
			this.DOMObject = div.parentNode;
		}

		return true;

		function getBlockWithCreature(creature) {
			let div = document.createElement('div');
			div.className = creature.classNameCSS;
			return div;
		}
	}

	die() {
		if (this.watcher) {
			this.state.endGame();
		}

		if (this.DOMObject.children[0]) {
			this.DOMObject.children[0].remove();
		}

		this.state.deleteCreature(this.id);
	}
}