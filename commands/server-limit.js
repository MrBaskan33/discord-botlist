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
    .setName("server-limit")
    .setNameLocalizations({
      "tr": "sunucu-şartı",
    })
    .setDescription("Set the server limit.")
    .setDescriptionLocalizations({
      "tr": "Sunucu şartını ayarlar.",
    })
    .setDMPermission(false)
    .addNumberOption(option =>
      option
       .setName('number')
       .setNameLocalizations({
         "tr": "miktar",
       })
       .setDescription('Number of limit to be set.')
       .setDescriptionLocalizations({
         "tr": "Ayarlanacak sınır sayısı.",
       })
       .setRequired(true)),
   
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    
    const number = interaction.options.getNumber("number")
    
    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)) {
      
      const noAuthorized = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-authorized"]}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      return await interaction.followUp({embeds: [noAuthorized]})
      
    }
      
    if(number < 0) {
      
      const noNumber = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-number"]}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      return await interaction.followUp({embeds: [noNumber]})
      
    }
    
    db.set(`${interaction.guild.id}.serverLimit`, number)
      
    const limitSet = new Discord.EmbedBuilder()
      .setColor("Green")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["limit-set"].replace(/\{limit}/g, number)}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [limitSet]})
        
  }
}
