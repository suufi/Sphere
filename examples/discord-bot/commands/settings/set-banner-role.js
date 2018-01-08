const Discord = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class SetBannerRole extends Command {
	constructor(client) {
		super(client, {
			name: 'set-banner-role',
			aliases: ['banner-role'],
			group: 'settings',
			memberName: 'banner-role',
			description: 'Sets the banner role for this server.',
            guildOnly: true,
            
			args: [
				{
					key: 'role',
					prompt: 'what role do you want to set as the banner role?\n',
					type: 'role'
                }
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
        var status = await msg.channel.send('Attempting to set the banner role…')

		msg.guild.settings.set("BANNER_ROLE", args.role.id);
		msg.reply(args.role.id);

        return status.edit("Banner role has been set.");                    
    }
};