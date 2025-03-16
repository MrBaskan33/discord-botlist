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
    .setName("developer-role")
    .setNameLocalizations({
      "tr": "developer-rol",
    })
    .setDescription("Set/reset the a developer role")
    .setDescriptionLocalizations({
      "tr": "Developer rolünü ayarlar/sıfırlar.",
    })
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName('set')
        .setNameLocalizations({
          "tr": "ayarla",
        })
        .setDescription('Set a developer role.')
        .setDescriptionLocalizations({
           "tr": "Developer rolünü ayarlar.",
         }) 
        .addRoleOption(option =>
          option
           .setName('role')
           .setNameLocalizations({
             "tr": "rol",
           })
           .setDescription('Role to be set.')
           .setDescriptionLocalizations({
             "tr": "Ayarlanacak rol.",
           })
           .setRequired(true)))
   .addSubcommand((command) =>
     command
       .setName('reset')
       .setNameLocalizations({
         "tr": "sıfırla",
       })
       .setDescription('Reset a developer role.')
       .setDescriptionLocalizations({
         "tr": "Developer rolünü sıfırlar.",
       })),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    
    const role = interaction.options.getRole("role")
    const developerRole = db.fetch(`${interaction.guild.id}.developerRole`)
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
      case "set": {
          
        if(role.id === interaction.guild.id || role.managed) {

          const notRole = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["not-role"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [notRole]})
      
        }
        
        if(developerRole) {
      
         const alreadyRole = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["already-role"].replace(/\{role}/g, developerRole)}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [alreadyRole]})
      
        } else {
      
          db.set(`${interaction.guild.id}.developerRole`, role.id) 
      
          const roleSet = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["role-set"].replace(/\{role}/g, role.id)}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [roleSet]})
      
        }

      }
      break
    
      case "reset": {
      
        if(!developerRole) {
      
         const noRole = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-role"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noRole]})
      
        } else {
      
          db.delete(`${interaction.guild.id}.developerRole`) 
      
          const roleReset = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["role-reset"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [roleReset]})
      
        }
        
      }
    }
    
  }
}
