const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const rbx = require('roblox-js');

const ModSystem = require('../../structures/ModSys.js');

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unban',
			aliases: ['unban-user'],
			group: 'sphere-api',
			memberName: 'unban-user',
			description: 'Unbans a user from the game.',
			details: `Unans a user from the game and submits to API where it is then logged and executed.`,
            guildOnly: true,
            
			args: [
				{
					key: 'username',
					prompt: 'who would you like to unban?\n',
					type: 'string'
                },
                {
                    key: 'reason',
                    prompt: 'why?\n',
                    type: 'string'
                }
			]
		});
	}

	hasPermission(msg) {
		return msg.member.roles.has(msg.guild.settings.get('BANNER_ROLE'));
	}

	async run(msg, args) {
            var status = await msg.channel.send('Attempting to unban…')
            
            if (!msg.guild.settings.get("LOG_CHANNEL")) return status.edit("Error! Ask the server owner to set the group id for this server using the set-log-channel command.");

            var userId = await rbx.getIdFromUsername(args.username.toLowerCase());
            var ban = await ModSystem.fetchBan(userId);

            if (ban === false) return status.edit(`${args.username} is not currently banned.`);
            
            const unbanning = new Discord.RichEmbed()
                .setAuthor('Sphere', this.client.user.displayAvatarURL)
                .setColor('#f4b841')
                .setDescription('Unbanning')
                .setFooter('unbanning')
                .setTimestamp()
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`)
                .addField('Case ID', ban.id, true)
                .addField('User', ban.userId + ' - ' + ban.username, true)
                .addField('Admin', `<@${ban.admin}>`, true)
                .addField('Reason', ban.reason, true);

            const unbanned = new Discord.RichEmbed()
                .setAuthor('Sphere', this.client.user.displayAvatarURL)
                .setColor('#ffa900')
                .setDescription('Unbanned')
                .setFooter('unbanned')
                .setTimestamp()
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`)
                .addField('Case ID', ban.id, true)
                .addField('User', ban.userId + ' - ' + ban.username, true)
                .addField('Admin', msg.author.toString(), true)
                .addField('Reason', args.reason, true);
                
            this.client.channels.get(msg.guild.settings.get("LOG_CHANNEL")).send({embed: unbanning});
            this.client.channels.get(msg.guild.settings.get("LOG_CHANNEL")).send({embed: unbanned});

            ModSystem.unbanUser(userId);

            return status.edit(`User \`${args.username}\` has been unbanned.`);            
    }
};