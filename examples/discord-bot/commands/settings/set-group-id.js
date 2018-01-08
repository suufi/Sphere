const Discord = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class SetRankerRole extends Command {
	constructor(client) {
		super(client, {
			name: 'set-group-id',
			aliases: ['group-id'],
			group: 'settings',
			memberName: 'set-group-id',
			description: 'Sets the Group ID for this server.',
            guildOnly: true,
            
			args: [
				{
					key: 'groupid',
					prompt: 'what group ID would you like to use for this server?\n',
					type: 'integer'
                }
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
        var status = await msg.channel.send('Attempting to set the group…')

        msg.guild.settings.set("GROUP_ID", parseInt(args.groupid));

        return status.edit("Group ID has been set.");                    
    }
};