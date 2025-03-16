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
    .setName("links")
    .setNameLocalizations({
      "tr": "linkler",
    })
    .setDescription("Bot links.")
    .setDescriptionLocalizations({
      "tr": "Bot linkleri.",
    })
    .setDMPermission(false),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
  
    const buttons = new Discord.ActionRowBuilder()
      .addComponents(new Discord.ButtonBuilder()        
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${settings.botId}&permissions=8&scope=bot%20applications.commands`)
        .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["add-server"])
        .setStyle("Link"))
      .addComponents(new Discord.ButtonBuilder()        
        .setURL(`https://discord.gg/a`)
        .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["support-server"])
        .setStyle("Link"))
      .addComponents(new Discord.ButtonBuilder()        
        .setURL(`https://top.gg/bot/${settings.botId}/vote`)
        .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["vote"])
        .setDisabled(true)
        .setStyle("Link"))
        
    const links = new Discord.EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription((locales[interaction.locale] ?? locales[settings.defaultLang])["links"])
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [links], components: [buttons]})
 
  }
}
