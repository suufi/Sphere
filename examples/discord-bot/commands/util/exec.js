const {
	Command
} = require('discord.js-commando');
const exec = require("child_process").exec;

const clean = (text) => {
	if (typeof text === "string") {
		return text.replace("``", `\`${String.fromCharCode(8203)}\``);
	} else {
		return text;
	}
};

const outputErr = (msg, stdData) => {
	let {
		stdout,
		stderr
	} = stdData;
	stderr = stderr ? ["`STDERR`", "```sh", clean(stderr.substring(0, 800)) || " ", "```"] : [];
	stdout = stdout ? ["`STDOUT`", "```sh", clean(stdout.substring(0, stderr ? stderr.length : 2046 - 40)) || " ", "```"] : [];
	let message = stdout.concat(stderr).join("\n").substring(0, 2000);
	msg.edit(message);
};

const doExec = (cmd, opts = {}) => {
	return new Promise((resolve, reject) => {
		exec(cmd, opts, (err, stdout, stderr) => {
			if (err) return reject({
				stdout,
				stderr
			});
			resolve(stdout);
		});
	});
};

module.exports = class ExecCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'exec',
			aliases: ['e', 'execute', 'ex'],
			group: 'util',
			memberName: 'exec',
			description: 'Executes.',
			details: `Executes`,
			guildOnly: false,
			args: [{
				key: 'code',
				prompt: 'what?\n',
				type: 'string'
			}]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) { // eslint-disable-line consistent-return
		let command = args.code;
		console.log(`Running ${command}`);

		let runningMessage = [
			"`RUNNING`",
			"```xl",
			clean(command),
			"```",
		];

		const outMessage = await msg.channel.send(runningMessage);
		let stdOut = await doExec(command).catch(data => outputErr(outMessage, data));
		stdOut = stdOut.substring(0, 1750);
		outMessage.edit(`\`OUTPUT\`
	\`\`\`sh
	${clean(stdOut)}
	\`\`\``);
	}
};