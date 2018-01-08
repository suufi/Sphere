const path = require('path');
const { URL } = require('url');
const winston = require('winston');
const request = require('request');
const rp = require('request-promise');

const roblox = require('roblox-js');
roblox.login(require('./../settings').USERNAME, require('./../settings').PASSWORD).then(() => console.log('logged in')).catch(console.error);

module.exports = class RankSystem {
	static async PromoteUser(userId, groupId) {
		var promotion = await roblox.promote(groupId, userId);
		return promotion;
	}
	
	static async DemoteUser(userId, groupId) {
		var demotion = await roblox.demote(groupId, userId);
		return demotion;
	}
	
	/* TODO: SuspendUser(userId) */
}
