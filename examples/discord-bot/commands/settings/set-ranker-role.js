const Discord = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class SetRankerRole extends Command {
	constructor(client) {
		super(client, {
			name: 'set-ranker-role',
			aliases: ['ranker-role'],
			group: 'settings',
			memberName: 'ranker-role',
			description: 'Sets the ranker role for this server.',
            guildOnly: true,
            
			args: [
				{
					key: 'role',
					prompt: 'what role do you want to set as the ranker role?\n',
					type: 'role'
                }
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
        var status = await msg.channel.send('Attempting to set the ranker role…')

        msg.guild.settings.set("RANKER_ROLE", args.role.id);

        return status.edit("Ranker role has been set.");                    
    }
};