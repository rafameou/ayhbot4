const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("garfield")
		.setDescription('Posta um quadrinho aleatório de Garfield.'),
	async execute(interaction) {
		//#TODO, desgambiarrar esse codigo

		function GetComic()
		{
			let GarfieldRelease = 269665200000; //1978, 6, 19
			let max = new Date().getTime(), min = GarfieldRelease;
			let RandomDay = new Date(Math.floor(Math.random() * (max - min + 1)) + min);//Util.RNG(new Date().getTime(), GarfieldRelease));
			function Fix(A) { return (A < 10) ? (A === 0 ? "01" : ("0" + A)) : (A); }
			let Day = [RandomDay.getFullYear(), Fix(RandomDay.getMonth()), Fix(RandomDay.getDay()), RandomDay.getFullYear().toString().substr(-2)];
			return [`http://images.ucomics.com/comics/ga/${Day[0]}/ga${Day[3]}${Day[1]}${Day[2]}.gif`, //Get from ucomics.
			`https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/${Day[0]}/${Day[0]}-${Day[1]}-${Day[2]}.gif`, //Get from the official but old database.
			`${Day[0]}-${Day[1]}-${Day[2]}`]; //Get the date.
		}

		async function IsValid(URL)
		{
			let Res;
			try { Res = await axios(URL).catch(e => { return false }); } //lets get sued
			catch (e) { return false; }
			return (Res.status === 200);
		}

		let URL = undefined;
		let Valid = [false, false];
		let Tries = 0;

		while (!Valid[0] && !Valid[1])
		{
			URL = GetComic();
			Valid[1] = await IsValid(URL[1]);
			if (Valid[1]) break; //Prefer results from the old database since they are in high quality.
			Valid[0] = await IsValid(URL[0]); //However the new database has newer comics.
			Tries > 10 ? Valid = 2 : Tries++;
		}

		if (Valid == 2)
			return;

		const Embed = new EmbedBuilder()
			.setAuthor({name:`Garfield ${URL[2]}`, 
			iconURL:"https://avatar.amuniversal.com/feature_avatars/ubadge_images/features/ga/mid_u-201701251612.png", 
			url:`https://www.gocomics.com/garfield/${URL[2].replace("-", "/").replace("-", "/")}`}) //Also from GoComics.
			.setImage(Valid[1] ? URL[1] : URL[0])
			//.setColor(interaction.user.hexAccentColor)
            .setTimestamp();
			//.setFooter({text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true })});

		await interaction.reply({ embeds: [ Embed ]});
	},
};

		/*
			Essa função arruma todos os problemas com o garfield original,
			porém eu não curti o modo que precisei literalmente dar scrape 
			no site do GoComics para fazer isso.
	
			Não existe um bom metodo de entrar em contato e simplesmente 
			perguntar se eu posso fazer isso ou não, obviamente a resposta
			vai ser não.
	
			Porém caso algum dia o code original pare de funcionar talvez
			essa seja a unica alternativa para fazer o comando.
	
			Meio triste o modo que a GoComics não tem uma API e nenhum 
			metodo de pegar qualquer resultado, mas não é certamente
			culpa deles pois duvido que alguem necessite disso para algo
			alem de pegar comics do garfield aleatoriamente.
		*/
		/*let AuthorOBJ = message.author;
		function GetComic()
		{
			let GarfieldRelease = 269665200000; //1978, 6, 19
			let RandomDay = new Date(Util.RNG(new Date().getTime(), GarfieldRelease));
			function Fix(A) { return (A < 10) ? (A === 0 ? "01" : ("0" + A)) : (A); }
			let Day = [RandomDay.getFullYear(), Fix(RandomDay.getMonth()), Fix(RandomDay.getDay()), RandomDay.getFullYear().toString().substr(-2)];
			return `${Day[0]}/${Day[1]}/${Day[2]}`;
		}

		let Day = GetComic();
		let URL = `https://www.gocomics.com/garfield/${Day}`;
		const response = await Util.m.axios(URL).catch(e => { });

		if (response.status === 200)
		{
			let Meta = Util.m.GetMeta(response.data);
				let embed = Util.Embed(message, AuthorOBJ)
					.setAuthor(Meta["og:title"], "https://avatar.amuniversal.com/feature_avatars/ubadge_images/features/ga/mid_u-201701251612.png", URL) //Also from GoComics.
					.setImage(Meta["og:image"])
					.setDescription(Meta["og:description"]);
				return message.edit({ embed }).catch(console.error);
			}

		*/