const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pronome')
		.setDescription('Transforma sua mensagem em pronome neutre.')
        .addStringOption(option =>
			option
				.setName('mensagem')
				.setDescription('A mensagem a ser traduzida.')
				.setRequired(true)),
	async execute(interaction) {
        let msg = interaction.options.getString('mensagem');
        msg = msg.toLowerCase().split(" ");
		msg.forEach(function (e, i, a)
		{
			function Replace(str, bool)
			{
				a[i] = a[i].slice(0, bool ? -2 : -1);
				a[i] += str;
			}

			if (e.length <= 1) return;

			if (e === "ele" || e === "ela")
			{
				a[i] = "elu";
				return;
			}

			if (e === "eles" || e === "elas")
			{
				a[i] = "elus";
				return;
			}

			if (e === "que")
			{
				return;
			}

			if (e === "minha" || e === "meu")
			{
				a[i] = "mi";
				return;
			}

			switch (e[e.length - 1]) { case "a": case "o": Replace("e"); break; case "e": Replace("u"); }
			switch (e[e.length - 2]) { case "a": case "o": Replace("e", true); break; case "e": Replace("u", true); }
		});
		await interaction.reply({ content: msg.join(" "), allowedMentions: { parse: [] }});
	},
};