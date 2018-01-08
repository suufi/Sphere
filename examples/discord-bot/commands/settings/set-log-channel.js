const Discord = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class SetLogChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'set-log-channel',
			aliases: ['log-channel'],
			group: 'settings',
			memberName: 'set-log-channel',
			description: 'Sets the logging channel for this server.',
            guildOnly: true,
            
			args: [
				{
					key: 'channel',
					prompt: 'what channel do you want to set as the log channel?\n',
					type: 'channel'
                }
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
        var status = await msg.channel.send('Attempting to set the logging channel…')

        msg.guild.settings.set("LOG_CHANNEL", args.channel.id);

        return status.edit("Logging channel has been set.");                    
    }
};