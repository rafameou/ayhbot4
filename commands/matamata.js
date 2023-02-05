const { SlashCommandBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

let shuff = function (arr)
{ //https://stackoverflow.com/a/46545530
    return arr.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

let rand = function (min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const acontecimento = [
    "foi de americanas por",
    "caiu na pegadinha ccdc de",
    "levou um tiro de",
    "caiu na fogueira de",
    "teve os pronomes errados por",
    "trollado por",
    "aniquilado por",
    "derrotado por",
    "deletado por",
    "esqueceu qual botão ataca e morreu para",
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('matamata')
        .setDescription('ESSE COMANDO SPAMMA VARIAS MENSAGENS, NÃO USE EM CHAT GERAL.')
        .addStringOption(option =>
            option
                .setName('jogadores')
                .setDescription('Mencione todos os jogadores (você e o bot participam automáticamente).')
                .setRequired(true)),

    async execute(interaction)
    {
        await interaction.deferReply();
        let jogadores = [];
        await interaction.member.guild.members.cache.each(user => jogadores.push(user));
        jogadores = shuff(jogadores);
        const nomeGuild = interaction.member.guild.name;
        let msg = `:trophy::trophy: TORNEIO MATA-MATA DO GRUPO **${nomeGuild}** :trophy::trophy:\n--- **COMEÇANDO EM 5 SEGUNDOS** ---\n`;
        await interaction.editReply({
            content: msg,
            allowedMentions: { parse: [] }
        });
        await wait(5000);
        let fase = 1;
        while (jogadores.length != 1)
        {
            msg += `\n**FASE ${fase}!**\n`;
            let proxFase = [];
            let confronto = 0;
            if (jogadores.length == 2)
            {
                msg += `**RODADA FINAL**: ${jogadores[0]} ${acontecimento[rand(0, acontecimento.length - 1)]} ${jogadores[1]}\n`;
                msg += `\n--- **MEMBRO ${jogadores[1]} GANHOU O MATA-MATA!** ---`;
                proxFase.push(jogadores[1]);
            }
            else 
            {
                jogadores.forEach((element, i, array) =>
                {
                    if (!proxFase.includes(element))
                    {
                        confronto += 1;
                        if (array[i + 1] == undefined)
                        {
                            msg += `- **No ${confronto}° confronto** ${array[i]} não teve que lutar contra ninguém :neutral_face:!\n`;
                            proxFase.push(array[i]);
                        }
                        else
                        {
                            msg += `- **No ${confronto}° confronto** ${array[i]} ${acontecimento[rand(0, acontecimento.length - 1)]} ${array[i + 1]}\n`;
                            proxFase.push(array[i + 1]);
                        }
                    }
                });
                msg += "--- **Próxima rodada em 5 segundos!!!** ---\n"
            }
            jogadores = proxFase;
            await interaction.editReply({ content: msg, allowedMentions: { parse: [] } });
            if (msg > 1500) 
            {
                msg = "--- CONTINUAÇÃO ---\n";
                await interaction.followUp({ content: msg, allowedMentions: { parse: [] } });
            }
            fase += 1;
            if (fase > 15) break; //bot quebrou lol
            await wait(5000);
        }
    },
};