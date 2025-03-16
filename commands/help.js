const Discord = require("discord.js")
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: `./bot/database.json`})
const settings = require("../settings.json")
const emojis = require("../bot/emojis.json")
const locales = {
  "tr": require("../locales/tr.json")
}
 
module.exports = {
  slash: true,
  data: new Discord.SlashCommandBuilder()    
    .setName("help")
    .setNameLocalizations({
      "tr": "yardım",
    })
    .setDescription("Help menu.")
    .setDescriptionLocalizations({
      "tr": "Yardım menüsü.",
    })
    .setDMPermission(false),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
  
    const help = new Discord.EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .addFields(
        {
          name: `${emojis["bot"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-commands"]}`,
          value: (locales[interaction.locale] ?? locales[settings.defaultLang])["commands"]
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [help]})
 
  }
}
