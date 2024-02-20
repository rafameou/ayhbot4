const { SlashCommandBuilder } = require("discord.js");
const util = require("util");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cowsay')
		.setDescription('Uma vaca fala o que você digitou.')
		.addStringOption(option =>
			option
				.setName('frase')
				.setDescription('Frase a ser falada pela vaca.')
				.setRequired(true)),

	async execute(interaction)
	{
		await interaction.deferReply();
		let msg = interaction.options.getString('frase');
		const execFile = util.promisify(require('child_process').execFile);
		const {stdout} = await execFile("firejail", ["--private", "--quiet", "cowsay", `${msg}`]);
		await interaction.editReply({ content: `\`\`\`${stdout}\`\`\``, allowedMentions: { parse: [] } });
	},
};
