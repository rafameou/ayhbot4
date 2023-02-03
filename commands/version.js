const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require("os");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Mostra versão do bot e outras coisas.'),
    async execute(interaction)
    {
        await interaction.deferReply();
        let Ram = process.memoryUsage().rss / 1000000;
        let CPU = "?";
        let CPUAmm = os.cpus().length;
        if (CPUAmm)
            CPU = os.cpus()[0].model;

        const Embed = new EmbedBuilder()
            .setImage("https://rafameou.github.io/img/4x.gif")
            .addFields({name: "Versão", value:`**Base**: v4\n**Node**: ${process.version}`, inline:true})
            .addFields({name:"Host", value:`**Platform**: ${process.platform}\n**Arch**: ${os.arch()}\n**CPU**: ${CPU} (${CPUAmm})\n**Uptime**: ${moment.duration((os.uptime() * 1000)).format("D[d] H[h] m[m] s[s]")}`, inline:true})
            .addFields({name:"Status", value:`**RAM**: ${Ram} MB.\n**Uptime**: ${moment.duration((process.uptime() * 1000)).format("D[d] H[h] m[m] s[s]")}\n`, inline:false});

        await interaction.editReply({ embeds: [Embed], allowedMentions: { parse: [] } });
    },
};
