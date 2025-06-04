const { SlashCommandBuilder } = require("discord.js");
const util = require("util");
const utiljs = require("../util");

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
		await interaction.deferReply();
		let cmd = interaction.options.getString('comando').replaceAll("system", "fprintf");
		await interaction.editReply({ content: `${await utiljs.octave(cmd)}`, allowedMentions: { parse: [] } });
	},
};
