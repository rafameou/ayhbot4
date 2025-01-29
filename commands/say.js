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
					//model: 'hf.co/mradermacher/Llama-3.2-1B-Instruct-Uncensored-GGUF:Q8_0',
					model: 'deepseek-r1:1.5b',
					messages: [{ role: 'user', content: msg }],
				});
				reply = response.message.content;
				await interaction.editReply({content: `Prompt Original: ${msg}` });
				for (let i = 0; i < reply.length; i += 2000) {
					await interaction.followUp({content: reply.slice(i, i + 2000)});
				}

			}
			catch (error) {
				console.log(error);
				await interaction.editReply({ content: "Bot deu timeout, provavelmente ficou escrevendo pra sempre."});
			}
			limited = false;
		}
	}
};
