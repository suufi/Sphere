const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const rbx = require('roblox-js');

const RankSystem = require('../../structures/RankSys.js');

module.exports = class DemoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'demote',
			aliases: ['demote-user'],
			group: 'roblox',
			memberName: 'demote',
			description: 'Demotes a user in the group.',
			details: `Demotes a user in the group`,
            guildOnly: true,
            
			args: [
				{
					key: 'username',
					prompt: 'who would you like to demote?\n',
					type: 'string'
       			}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.roles.has(msg.guild.settings.get('RANKER_ROLE'));
	}

	async run(msg, args) {
		var status = await msg.channel.send('Attempting to demote…')
		
		if (!msg.guild.settings.get("GROUP_ID")) return status.edit("Error! Ask the server owner to set the group id for this server using the set-group-id command.");


        var id = await rbx.getIdFromUsername(args.username.toLowerCase());
        var demotion = await RankSystem.DemoteUser(id, msg.guild.settings.get("GROUP_ID"));
        
        const embed = new Discord.RichEmbed()
            .setAuthor('Sphere', this.client.user.displayAvatarURL)
            .setColor('#f44250')
            .setDescription('Demoted')
            .setFooter('demote')
            .setTimestamp()
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
        	.addField('User', args.username.toLowerCase())    
			.addField('Previous Rank', demotion.oldRole.Name, true)
			.addField('New Rank', demotion.newRole.Name, true)
		    .addField('Admin', msg.author.toString(), false);

		this.client.channels.get(msg.guild.settings.get("LOG_CHANNEL")).send({embed});
        
        return status.edit(`\`${args.username}\` has been demoted.`);                    
    }
};
