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
    .setName("topgg-condition")
    .setNameLocalizations({
      "tr": "topgg-şartı",
    })
    .setDescription("Open/close topgg condition.")
    .setDescriptionLocalizations({
      "tr": "Topgg şartını açar/kapatır.",
    })
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName('open')
        .setNameLocalizations({
          "tr": "aç",
        })
        .setDescription('Open a topgg condition.')
        .setDescriptionLocalizations({
           "tr": "Topgg şartını açar.",
         }))
   .addSubcommand((command) =>
     command
       .setName('close')
       .setNameLocalizations({
         "tr": "kapat",
       })
       .setDescription('Close a topgg condition.')
       .setDescriptionLocalizations({
         "tr": "Topgg şartını kapatır.",
       })),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    
    const topggRequired = db.fetch(`${interaction.guild.id}.topggRequired`)
    const option = interaction.options.getSubcommand()

    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)) {
      
      const noAuthorized = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-authorized"]}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      return await interaction.followUp({embeds: [noAuthorized]})
      
    }

    switch(option) {
      case "open": {
    
        if(topggRequired) {
      
         const alreadySystem = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["already-condition"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [alreadySystem]})
      
        } else {
      
          db.set(`${interaction.guild.id}.topggRequired`, true) 
      
          const systemSet = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["condition-set"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [systemSet]})
      
        }

      }
      break
    
      case "close": {
      
        if(!topggRequired) {
      
         const noSystem = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-condition"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noSystem]})
      
        } else {
      
          db.delete(`${interaction.guild.id}.topggRequired`) 
      
          const systemReset = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["condition-reset"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [systemReset]})
      
        }
        
      }
    }
    
  }
}
