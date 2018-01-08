const { CommandoClient, FriendlyError, SQLiteProvider } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const path = require('path');
const winston = require('winston');
const sqlite   = require('sqlite');

const { OWNER, COMMAND_PREFIX, TOKEN } = require('./settings');

const client = new CommandoClient({
	owner: OWNER,
	commandPrefix: COMMAND_PREFIX,
	unknownCommandResponse: false,
	disableEveryone: true
});

const r = require('rethinkdbdash')({
    db: 'F3X'
});


client
    .on('error', winston.error)
    .on('warn', winston.warn)
    .on('ready', () => {
        winston.info(oneLine`
			[DISCORD]: Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})
		`)
	})
	.on('disconnect', () => { winston.warn('Disconnected!') })
	.on('reconnect', () => { winston.warn('Reconnecting...') })
    .on('commandRun', (cmd, promise, msg, args) => {
		winston.info(oneLine`${msg.author.username}#${msg.author.discriminator}
			> ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'DM'}
			>> ${cmd.groupID}:${cmd.memberName}
			${Object.values(args)[0] !== '' || [] ? `>>> ${Object.values(args)}` : ''}
		`);
	})
    .on('message', async message => {
		if (message.author.bot) return;
		if (message.channel.type === 'dm') return;
		
	})	
	.on('commandError', (cmd, err) => {
		if (err instanceof FriendlyError) return;
		winston.error(`[DISCORD]: Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		winston.info(oneLine`
			[DISCORD]: Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; User ${msg.author.tag} (${msg.author.id}): ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		winston.info(oneLine`
			[DISCORD]: Prefix changed to ${prefix || 'the default'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		winston.info(oneLine`
			[DISCORD]: Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		winston.info(oneLine`
			[DISCORD]: Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});
	
client.setProvider(
	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

client.registry
	.registerGroups([
		['info', 'Info'],
		['roblox', 'ROBLOX commands'],
		['sphere-api', 'Sphere API commands'],
		['settings', 'Setting commands']
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'))
	.registerEvalObject('r', r);


client.login(TOKEN);

process.on('unhandledRejection', err => console.error(`Uncaught Promise Error: \n${err.stack}`));
