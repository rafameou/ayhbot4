const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { default: ollama } = require('ollama');
let limited = false;

module.exports = {
	data: new SlashCommandBuilder()
	.setName("say")
	.setDescription('Usa IA pra (tentar) responder algo, não utilize NADA que esse bot responde com seriedade..')
	.addStringOption(option =>
		option
		.setName('prompt')
		.setDescription('Prompt.')
		.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		reply = "Erro! Bot já está fazendo algo, volte mais tarde!";
		let msg = interaction.options.getString('prompt');
		if (!limited)
		{
			limited = true;
			try {
				const response = await ollama.chat({
					model: 'llama3.2:1b',
					messages: [{ role: 'user', content: msg }],
				});
				reply = response.message.content.substring(0, 3999);
				if (!reply)
					reply = "Erro! A IA retornou nada."
			}
			catch (error) {console.log(error);}
			limited = false;
		}

		const Embed = new EmbedBuilder()
			.setDescription(reply)
			.setFooter({text: msg})
			.setTimestamp();

		await interaction.editReply({ embeds: [ Embed ]});
	},
};
