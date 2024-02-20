const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const urlMetadata = require('url-metadata')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("garfield")
		.setDescription('Posta um quadrinho aleatório de Garfield.'),
	async execute(interaction) {
		await interaction.deferReply();

		function GetComic()
		{
			let GarfieldRelease = 269665200000; //1978, 6, 19
			let max = new Date().getTime(), min = GarfieldRelease;
			let RandomDay = new Date(Math.floor(Math.random() * (max - min + 1)) + min);
			function Fix(A) { return (A < 10) ? (A === 0 ? "01" : ("0" + A)) : (A); }
			let Day = [RandomDay.getFullYear(), Fix(RandomDay.getMonth()), Fix(RandomDay.getDay()), RandomDay.getFullYear().toString().substr(-2)];
			return `${Day[0]}/${Day[1]}/${Day[2]}`;
		}

		var URL = `https://www.gocomics.com/garfield/${GetComic()}`;
		const metadata = await urlMetadata(URL);

		const Embed = new EmbedBuilder()
			.setAuthor({name:metadata["og:title"], 
			iconURL:"https://avatar.amuniversal.com/feature_avatars/ubadge_images/features/ga/mid_u-201701251612.png", 
			url:URL}) 
			.setImage(metadata["og:image"])
			//.setDescription(metadata["og:description"])
			//.setColor(interaction.user.hexAccentColor)
            	.setTimestamp();

		await interaction.editReply({ embeds: [ Embed ]});
	},
};
