const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const rbx = require('roblox-js');

const ModSystem = require('../../structures/ModSys.js');

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: ['ban-user'],
			group: 'sphere-api',
			memberName: 'ban-user',
			description: 'Bans a user from the game.',
			details: `Bans a user from the game and submits to API where it is then logged and executed.`,
            guildOnly: true,
            
			args: [
				{
					key: 'username',
					prompt: 'who would you like to ban?\n',
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
        var status = await msg.channel.send('Attempting to ban…');

        if (!msg.guild.settings.get("LOG_CHANNEL")) return status.edit("Error! Ask the server owner to set the group id for this server using the set-log-channel command.");

        var id = await rbx.getIdFromUsername(args.username.toLowerCase());
        var bannedStatus = await ModSystem.banUser(id, msg.author.id, args.reason);
        
        if (bannedStatus === "User is already banned.") return status.edit("This user is already banned.");

        var ban = await ModSystem.fetchBan(id);
        const embed = new Discord.RichEmbed()
            .setAuthor('Sphere', this.client.user.displayAvatarURL)
            .setColor('#42d7f4')
            .setDescription('Banned')
            .setFooter('ban')
            .setTimestamp()
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
            .addField('Case ID', ban.id, true)
            .addField('User', ban.userId + ' - ' + ban.username, true)
            .addField('Admin', `<@${ban.admin}>`, true)
            .addField('Reason', ban.reason, true);
        this.client.channels.get(msg.guild.settings.get("LOG_CHANNEL")).send({embed});
        
        return status.edit(`Poor \`${args.username}\` has been banned.`);                    
    }
};