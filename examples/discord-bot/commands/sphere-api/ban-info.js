const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const moment = require('moment');
const rbx = require('roblox-js');

const ModSystem = require('../../structures/ModSys.js');

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban-info',
			aliases: ['fetch-ban', 'fb', 'fban', 'gban', 'get-ban'],
			group: 'sphere-api',
			memberName: 'ban-info',
			description: 'Fetches ban info.',
			details: `Fetches ban information from the API.`,
            guildOnly: true,
            
			args: [
				{
					key: 'username',
					prompt: 'who\'s ban record would you like to see?\n',
					type: 'string'
                }
			]
		});
	}

	hasPermission(msg) {
		return msg.member.roles.has(msg.guild.settings.get('BANNER_ROLE'));
	}

	async run(msg, args) {
        var msg = await msg.channel.send('Fetching record…');
        var id = await rbx.getIdFromUsername(args.username.toLowerCase());
        var ban = await ModSystem.fetchBan(id);
        
        if (!ban.id) return msg.edit('This human being has not been banned or someone already unbanned them.');

        const embed = new Discord.MessageEmbed()
            .setAuthor('Sphere', this.client.user.displayAvatarURL)
            .setColor('#42d7f4')
            .setDescription('Ban Information')
            .setFooter(`fetched mugshot from ${moment(ban.timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a")}`)
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
            .addField('Case ID', ban.id, true)
            .addField('User', ban.userId + ' - ' + ban.username, true)
            .addField('Admin', `<@${ban.admin}>`, true)
			.addField('Reason', ban.reason, true);
			
        msg.edit({embed});
    }
};