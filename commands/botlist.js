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
    .setName("botlist")
    .setNameLocalizations({
      "tr": "botlist",
    })
    .setDescription("Botlist menu.")
    .setDescriptionLocalizations({
      "tr": "Botlist menüsü.",
    })
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName('settings')
        .setNameLocalizations({
          "tr": "ayarlar",
        })
        .setDescription('Botlist settings.')
        .setDescriptionLocalizations({
          "tr": "Botlist ayarları.",
        }))
    .addSubcommand((command) =>
      command
        .setName('reset')
        .setNameLocalizations({
          "tr": "sıfırla",
        })
        .setDescription('Reset a botlist settings.')
        .setDescriptionLocalizations({
          "tr": "Botlist ayarlarını sıfırlar.",
        }))
    .addSubcommand((command) =>
      command
        .setName('open')
        .setNameLocalizations({
          "tr": "aç",
        })
        .setDescription('Open a botlist system.')
        .setDescriptionLocalizations({
          "tr": "Botlist sistemini açar.",
        }))
    .addSubcommand((command) =>
      command
        .setName('close')
        .setNameLocalizations({
          "tr": "kapat",
        })
        .setDescription('Close a botlist system.')
        .setDescriptionLocalizations({
          "tr": "Botlist sistemini kapatır.",
        })),
        
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    const option = interaction.options.getSubcommand()

    const addChannel= db.fetch(`${interaction.guild.id}.addChannel`)
    const logChannel = db.fetch(`${interaction.guild.id}.logChannel`)
    const authorizedChannel = db.fetch(`${interaction.guild.id}.authorizedChannel`)
    const botRole = db.fetch(`${interaction.guild.id}.botRole`)
    const developerRole = db.fetch(`${interaction.guild.id}.developerRole`)
    const authorizedRole = db.fetch(`${interaction.guild.id}.authorizedRole`)
    const dmFollow = db.fetch(`${interaction.guild.id}.dmFollow`)
    const botlistSystem = db.fetch(`${interaction.guild.id}.botlistSystem`)
    const addMessage = db.fetch(`${interaction.guild.id}.addMessage`)
    
    switch(option) {
      case "settings": {
        
        let ac
        if(!addChannel) {
          ac = `${emojis["cross"]}`
        } else {
          ac = `${emojis["check"]} <#${addChannel}>`
        } 
    
        let lc
        if(!logChannel) {
          lc = `${emojis["cross"]}`
        } else {
          lc = `${emojis["check"]} <#${logChannel}>`
        } 
    
        let adc
        if(!authorizedChannel) {
          adc = `${emojis["cross"]}`
        } else {
          adc = `${emojis["check"]} <#${authorizedChannel}>`
        } 
    
        let br
        if(!botRole) {
          br = `${emojis["cross"]}`
        } else {
          br = `${emojis["check"]} <@&${botRole}>`
        } 
      
        let dr
        if(!developerRole) {
          dr = `${emojis["cross"]}`
        } else {
          dr = `${emojis["check"]} <@&${developerRole}>`
        } 
    
        let ar
        if(!authorizedRole) {
          ar = `${emojis["cross"]}`
        } else {
          ar = `${emojis["check"]} <@&${authorizedRole}>`
        } 
      
        let df
        if(!dmFollow) {
          df = `${emojis["cross"]}`
        } else {
          df = `${emojis["check"]}`
        } 
        
        let bs
        if(!botlistSystem) {
          bs = `${emojis["cross"]}`
        } else {
          bs = `${emojis["check"]}`
        } 
        
        const settings = new Discord.EmbedBuilder()
          .setColor("Blurple")
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .addFields(
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["add-channel"]}`,
              value: `${ac}`
            },
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["log-channel"]}`,
              value: `${lc}`
            },
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["authorized-channel"]}`,
              value: `${adc}`
            },
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-role"]}`,
              value: `${br}`
            },
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["developer-role"]}`,
              value: `${dr}`
            },
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["authorized-role"]}`,
              value: `${ar}`
            },
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["dm-follow"]}`,
              value: `${df}`
            },
            {
              name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["botlist-system"]}`,
              value: `${bs}`
            })
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        return await interaction.followUp({embeds: [settings]})
        
      } 
      break
      case "reset": {
     
        if(addChannel) {
          db.delete(`${interaction.guild.id}.addChannel`)
        } 
        if(logChannel) {
          db.delete(`${interaction.guild.id}.logChannel`)
        } 
        if(authorizedChannel) {
          db.delete(`${interaction.guild.id}.authorizedChannel`)
        } 
        if(botRole) {
          db.delete(`${interaction.guild.id}.botRole`)
        } 
        if(developerRole) {
          db.delete(`${interaction.guild.id}.developerRole`)
        } 
        if(authorizedRole) {
          db.delete(`${interaction.guild.id}.authorizedRole`)
        } 
        if(dmFollow) {
          db.delete(`${interaction.guild.id}.dmFollow`)
        } 
        if(botlistSystem) {
          db.delete(`${interaction.guild.id}.botlistSystem`)
          db.delete(`${interaction.guild.id}.addMessage`)
        } 
        
        const reset = new Discord.EmbedBuilder()
          .setColor("Green")
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${emojis["check"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["botlist-reset"]}`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        return await interaction.followUp({embeds: [reset]})
        
      }
      break
      case "open": {
        
        const botlistSystem = db.fetch(`${interaction.guild.id}.botlistSystem`)
        
        if(botlistSystem) {
        
          const alreadySystem = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["already-system"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [alreadySystem]})
       
        }
        
        let errorCodes = []
        
        if(!addChannel) {
          errorCodes.push(400)
        }
        if(!logChannel) {
          errorCodes.push(401)
        }
        if(!authorizedChannel) {
          errorCodes.push(402)
        }
        if(!botRole) {
          errorCodes.push(403)
        }
        if(!developerRole) {
          errorCodes.push(404)
        }
        if(!authorizedRole) {
          errorCodes.push(405)
        }
        
        if(!addChannel || !logChannel || !authorizedChannel || !botRole || !developerRole || !authorizedRole) {
           
          const buttons = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder()        
              .setURL(`https://discord.gg/a`)
              .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["support-server"])
              .setStyle("Link"))
          
          const noSettings = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-settings"].replace(/\{errorCode}/g, errorCodes.join(", "))}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noSettings], components: [buttons]})
        
        }
        
        db.set(`${interaction.guild.id}.botlistSystem`, true)
        
        const button = new Discord.ActionRowBuilder()
          .addComponents(new Discord.ButtonBuilder()
            .setCustomId("bot-add")
            .setEmoji(emojis["add"])
            .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["bot-add"])
            .setStyle(Discord.ButtonStyle.Secondary))
          
        const systemMessage = new Discord.EmbedBuilder()
          .setColor("Blurple")
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${(locales[interaction.locale] ?? locales[settings.defaultLang])["system-message"].replace(/\{emoji}/g, emojis["add"])}`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        client.channels.cache.get(addChannel).send({embeds: [systemMessage], components: [button]}).then((message) => {
          db.set(`${interaction.guild.id}.addMessage`, message.id)
        })
        
        const openSystem = new Discord.EmbedBuilder()
          .setColor("Green")
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${emojis["check"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["system-set"]}`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        return await interaction.followUp({embeds: [openSystem]})
        
      }
      break
      case "close": {
        
        if(!botlistSystem) {
        
          const noSystem = new Discord.EmbedBuilder()
            .setColor("Red")
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
            .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-system"]}`)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
            .setTimestamp()
          return await interaction.followUp({embeds: [noSystem]})
       
        }
        
        const guild = client.guilds.cache.get(interaction.guild.id)
        const channel = guild.channels.cache.get(addChannel)
        channel.messages.fetch(addMessage).then(message => {
          setTimeout(() => {
            message.delete()
          }, 1000)
        })
        
        db.delete(`${interaction.guild.id}.botlistSystem`)
        db.delete(`${interaction.guild.id}.addMessage`)
        
        const closeSystem = new Discord.EmbedBuilder()
          .setColor("Green")
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
          .setDescription(`${emojis["check"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["system-reset"]}`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        return await interaction.followUp({embeds: [closeSystem]})
        
      }
      break
    }
    
  }
}
