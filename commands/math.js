const { SlashCommandBuilder } = require("discord.js");
const util = require("util");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('math')
		.setDescription('Roda o comando no octave.')
		.addStringOption(option =>
			option
				.setName('comando')
				.setDescription('Comando a ser executado.')
				.setRequired(true)),

	async execute(interaction)
	{
		let cmd = interaction.options.getString('comando').replaceAll("system", "fprintf");
		const execFile = util.promisify(require('child_process').execFile);
		const { stdout } = await execFile("timeout", ["2", "firejail", "--private", "--quiet", "octave-cli", "--eval", `${cmd}`]);
		await interaction.reply({ content: `${stdout}`, allowedMentions: { parse: [] } });
	},
};
