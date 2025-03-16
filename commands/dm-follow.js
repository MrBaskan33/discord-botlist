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
    .setName("dm-follow")
    .setNameLocalizations({
      "tr": "dm-takip",
    })
    .setDescription("Open/close dm follow system.")
    .setDescriptionLocalizations({
      "tr": "Dm takip sistemini açar/kapatır.",
    })
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName('open')
        .setNameLocalizations({
          "tr": "aç",
        })
        .setDescription('Open a dm follow system.')
        .setDescriptionLocalizations({
           "tr": "Dm takip sistemini açar.",
         }))
   .addSubcommand((command) =>
     command
       .setName('close')
       .setNameLocalizations({
         "tr": "kapat",
       })
       .setDescription('Close a dm follow system.')
       .setDescriptionLocalizations({
         "tr": "Dm takip sistemini kapatır.",
       })),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    
    const dmFollow = db.fetch(`${interaction.guild.id}.dmFollow`)
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
    
        if(dmFollow) {
      
         const alreadySystem = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["already-system"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [alreadySystem]})
      
        } else {
      
          db.set(`${interaction.guild.id}.dmFollow`, true) 
      
          const systemSet = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["system-set"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [systemSet]})
      
        }

      }
      break
    
      case "close": {
      
        if(!dmFollow) {
      
         const noSystem = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-system"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noSystem]})
      
        } else {
      
          db.delete(`${interaction.guild.id}.dmFollow`) 
      
          const systemReset = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["system-reset"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [systemReset]})
      
        }
        
      }
    }
    
  }
}
