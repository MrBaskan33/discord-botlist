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
    .setName("bot-delete")
    .setNameLocalizations({
      "tr": "bot-sil",
    })
    .setDescription("Delete a bot data.")
    .setDescriptionLocalizations({
      "tr": "Bot verilerini siler.",
    })
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('id')
        .setNameLocalizations({
             "tr": "id",
           })
           .setDescription('Bot whose data will be deleted.')
           .setDescriptionLocalizations({
             "tr": "Verileri silinecek bot.",
           })
           .setRequired(true)),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
  
    const botId = interaction.options.getString("id")
    const botData = db.fetch(`${interaction.guild.id}.${botId}`)
    const authorizedRole = db.fetch(`${interaction.guild.id}.authorizedRole`)
 
    if(!interaction.member.roles.cache.has(authorizedRole) && !interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
    
      const noAuthorized = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-perm"]}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      return await interaction.followUp({embeds: [noAuthorized]})
   
    }
    
    if(!botData) { 
      
      const noBot = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-bot"]}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
	    return await interaction.followUp({embeds: [noBot]})
  
    }
    
    db.delete(`${interaction.guild.id}.${botId}`)
    
    const botDelete = new Discord.EmbedBuilder()
      .setColor("Green")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["check"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-delete"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
	  return await interaction.followUp({embeds: [botDelete]})
  
  }
}
