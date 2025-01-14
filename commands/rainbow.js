const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('rainbow')
	.setDescription('Gera uma mensagem colorida para o MoreColors do sourcemod.')
	.addStringOption(option =>
		option
		.setName('mensagem')
		.setDescription('A mensagem a ser colorida.')
		.setRequired(true)),
	async execute(interaction)
	{
		let msgs = interaction.options.getString('mensagem').split("");
		await interaction.deferReply();
		let Colors = ["aliceblue", "allies", "ancient", "antiquewhite", "aqua", "aquamarine",
			"arcana", "axis", "azure", "beige", "bisque", "black", "blanchedalmond", "blue",
			"blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate",
			"collectors", "common", "community", "coral", "cornflowerblue", "cornsilk",
			"corrupted", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray",
			"darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange",
			"darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray",
			"darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray",
			"dimgrey", "dodgerblue", "exalted", "firebrick", "floralwhite", "forestgreen", "frozen",
			"fuchsia", "fullblue", "fullred", "gainsboro", "genuine", "ghostwhite", "gold",
			"goldenrod", "gray", "grey", "green", "greenyellow", "haunted", "honeydew", "hotpink",
			"immortal", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush",
			"lawngreen", "legendary", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
			"lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen", "lightpink",
			"lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey",
			"lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon",
			"mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
			"mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred",
			"midnightblue", "mintcream", "mistyrose", "moccasin", "mythical", "navajowhite",
			"navy", "normal", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid",
			"palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip",
			"peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rare", "red",
			"rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen",
			"seashell", "selfmade", "sienna", "silver", "skyblue", "slateblue", "slategray",
			"slategrey", "snow", "springgreen", "steelblue", "strange", "tan", "teal", "thistle",
			"tomato", "turquoise", "uncommon", "unique", "unusual", "valve", "vintage", "violet",
			"wheat", "white", "whitesmoke", "yellow", "yellowgreen"];

		let NewMSG = [];
		for (let msg of msgs)
		{
			NewMSG.push(msg === " " ? msg : `{${Colors[Math.floor(Math.random() * (Colors.length))]}}${msg}`);
		}

		let Final = NewMSG.join("");

		if (Final.length <= 0) Final = "ue";
		if (Final.length > 184) Final = Final.slice(0, 184);

		await interaction.editReply({ content: Final, allowedMentions: { parse: [] } });
	},
};
