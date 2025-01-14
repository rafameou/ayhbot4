const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

let rand = function (min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName("repost")
	.setDescription("Manda áudio de repost."),
	async execute(interaction) {
		await interaction.deferReply();
		await fs.readdir("etc/repeat/", async function (err, files)
			{
				return await interaction.editReply({
					files: [
						`etc/repeat/${files[rand(0, files.length - 1)]}`
					]
				});
			});
	},
};
