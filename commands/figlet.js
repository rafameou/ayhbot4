const { SlashCommandBuilder } = require("discord.js");
const util = require("util");

module.exports = {
	data: new SlashCommandBuilder()
	.setName('figlet')
	.setDescription('Bota numa fonte feia ascii.')
	.addStringOption(option =>
		option
		.setName('frase')
		.setDescription('Frase a ser asciizado.')
		.setRequired(true)),

	async execute(interaction)
	{
		await interaction.deferReply();
		let msg = interaction.options.getString('frase');
		const execFile = util.promisify(require('child_process').execFile);
		const {stdout} = await execFile("firejail", ["--private", "--quiet", "figlet", `${msg}`]);
		await interaction.editReply({ content: `\`\`\`${stdout}\`\`\``, allowedMentions: { parse: [] } });
	},
};
