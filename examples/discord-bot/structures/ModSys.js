const path = require('path');
const { URL } = require('url');
const winston = require('winston');
const request = require('request');
const rp = require('request-promise');

const token = require('./../settings').API_TOKEN;
const baseURL = require('./../settings').BASEURL;

module.exports = class BanSystem {
	static async banUser(userId, admin, reason) {
        let options = {
            method: 'POST',
            uri: baseURL + '/bans/ban',
            body: {
                userId: userId,
                admin: admin,
                reason: reason,
                token: token
            },
            json: true // Automatically stringifies the body to JSON
        };

        var ban = await rp(options);
        return ban;
    }

    static async unbanUser(userId) {
        let options = {
            method: 'DELETE',
            uri: baseURL + '/bans/ban',
            body: {
                userId: userId,
                token: token
            },
            json: true // Automatically stringifies the body to JSON
        };

        var ban = await rp(options);
        return ban;    
    }

    static async fetchBan(userId) {
        let options = {
            method: 'GET',
            uri: baseURL + '/bans/check/' + userId,
            body: {
                token: token
            },
            json: true
        };

        var ban = await rp(options);
        if (ban == false) {
            return false;
        } else {
            return ban[0];      
        }
    }
}
