const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const rbx = require('roblox-js');

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fetch-rank',
            aliases: ['rank', 'frank'],
            group: 'roblox',
            memberName: 'fetch-rank',
            description: 'Gets rank of a user in group specified with the set-group-id command or the group provided in the 2nd argument.',
            examples: ['rank Qxest', 'rank GigsD4X 1337'],
            guildOnly: true,

            args: [
                {
                    key: 'username',
                    label: 'username',
                    prompt: 'who\'s rank are you looking for? \n',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        var status = await msg.channel.send('Fetching rank…');

        if (!msg.guild.settings.get("GROUP_ID")) return status.edit("Error! Ask the server owner to set the group id for this server using the set-group-id command.");

        var id = await rbx.getIdFromUsername(args.username);
        var username = await rbx.getUsernameFromId(id);
        var rankInGroup = await rbx.getRankNameInGroup(msg.guild.settings.get("GROUP_ID"), id);
    
        const embed = new Discord.RichEmbed()
            .setAuthor('Sphere', this.client.user.displayAvatarURL)
            .setColor('#42d7f4')
            .setFooter('fetch-rank')
            .setTimestamp()
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
            .addField('User', `${username} - ${id}`, true)
            .addField('Rank', rankInGroup, true);
        
        return status.edit({embed})
    }
};
