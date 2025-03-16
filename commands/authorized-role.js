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
    .setName("authorized-role")
    .setNameLocalizations({
      "tr": "yetkili-rol",
    })
    .setDescription("Set/reset the a authorized role.")
    .setDescriptionLocalizations({
      "tr": "Yetkili rolünü ayarlar/sıfırlar.",
    })
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName('set')
        .setNameLocalizations({
          "tr": "ayarla",
        })
        .setDescription('Set a authorized role.')
        .setDescriptionLocalizations({
           "tr": "Yetkili rolünü ayarlar.",
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
       .setDescription('Reset a authorized role.')
       .setDescriptionLocalizations({
         "tr": "Yetkili rolünü sıfırlar.",
       })),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    
    const role = interaction.options.getRole("role")
    const authorizedRole = db.fetch(`${interaction.guild.id}.authorizedRole`)
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
        
        if(authorizedRole) {
      
         const alreadyRole = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["already-role"].replace(/\{role}/g, authorizedRole)}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [alreadyRole]})
      
        } else {
      
          db.set(`${interaction.guild.id}.authorizedRole`, role.id) 
      
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
      
        if(!authorizedRole) {
      
         const noRole = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-role"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noRole]})
      
        } else {
      
          db.delete(`${interaction.guild.id}.authorizedRole`) 
      
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
