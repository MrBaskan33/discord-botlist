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
    .setName("authorized-channel")
    .setNameLocalizations({
      "tr": "yetkili-kanalı",
    })
    .setDescription("Set/reset the channel to authorized.")
    .setDescriptionLocalizations({
      "tr": "Yetkili kanalını ayarlar/sıfırlar.",
    })
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName('set')
        .setNameLocalizations({
          "tr": "ayarla",
        })
        .setDescription('Set an authorized channel.')
        .setDescriptionLocalizations({
           "tr": "Yetkili kanalını ayarlar.",
         }) 
        .addChannelOption(option =>
          option
           .setName('channel')
           .setNameLocalizations({
             "tr": "kanal",
           })
           .setDescription('Channel to be set.')
           .setDescriptionLocalizations({
             "tr": "Ayarlanacak kanal.",
           })
           .setRequired(false)))
   .addSubcommand((command) =>
     command
       .setName('reset')
       .setNameLocalizations({
         "tr": "sıfırla",
       })
       .setDescription('Reset an authorized channel.')
       .setDescriptionLocalizations({
         "tr": "Yetkili kanalını sıfırlar.",
       })),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    
    const channel = interaction.options.getChannel("channel") || interaction.channel
    const authorizedChannel = db.fetch(`${interaction.guild.id}.authorizedChannel`)
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
          
        if(channel.type !== Discord.ChannelType.GuildText) {
  
          const noTextChannel = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-text-channel"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noTextChannel]})
      
        }
    
        if(authorizedChannel) {
      
         const alreadyChannel = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["already-channel"].replace(/\{channel}/g, addChannel)}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [alreadyChannel]})
      
        } else {
      
          db.set(`${interaction.guild.id}.authorizedChannel`, channel.id) 
      
          const channelSet = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["channel-set"].replace(/\{channel}/g, channel.id)}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [channelSet]})
      
        }

      }
      break
    
      case "reset": {
      
        if(!authorizedChannel) {
      
         const noChannel = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-channel"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noChannel]})
      
        } else {
      
          db.delete(`${interaction.guild.id}.authorizedChannel`) 
      
          const channelReset = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["check"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["channel-reset"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [channelReset]})
      
        }
        
      }
    }
    
  }
}
