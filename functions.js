const Discord = require("discord.js")

//--/ Show Bot Add Modal \--\\
async function showBotAddModal(interaction, locales, settings) {
  
  const botAddForm = new Discord.ModalBuilder()
    .setCustomId("botaddform")
    .setTitle((locales[interaction.locale] && locales[settings.defaultLang])["bot-add-form"])
  const botAdd = new Discord.TextInputBuilder()
    .setCustomId("botid")
    .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["bot-id"])
    .setStyle(Discord.TextInputStyle.Paragraph)
    .setMinLength(15)
    .setMaxLength(20)
    .setRequired(true)
  const add = new Discord.ActionRowBuilder().addComponents(botAdd)
  botAddForm.addComponents(add)
  
  await interaction.showModal(botAddForm)
 
}     
//--/ Show Bot Add Modal \--\\

//--/ Bot Add Modal \--\\
async function botAddModal(client, interaction, locales, settings, emojis, db, fetch, axios) {
  
  await interaction.deferUpdate()
  
  const addChannel= db.fetch(`${interaction.guild.id}.addChannel`)
  const logChannel = db.fetch(`${interaction.guild.id}.logChannel`)
  const authorizedChannel = db.fetch(`${interaction.guild.id}.authorizedChannel`)
  const botRole = db.fetch(`${interaction.guild.id}.botRole`)
  const developerRole = db.fetch(`${interaction.guild.id}.developerRole`)
  const authorizedRole = db.fetch(`${interaction.guild.id}.authorizedRole`)
  const dmFollow = db.fetch(`${interaction.guild.id}.dmFollow`)
  const botlistSystem = db.fetch(`${interaction.guild.id}.botlistSystem`)
  const addMessage= db.fetch(`${interaction.guild.id}.addMessage`)
  const serverLimit = db.fetch(`${interaction.guild.id}.serverLimit`) || 0
  const topggRequired = db.fetch(`${interaction.guild.id}.topggRequired`) || false
  const botId = interaction.fields.getTextInputValue("botid")
  const bot =  db.fetch(`${interaction.guild.id}.${botId}`)
      
  if(!botlistSystem) {
        
    const noSystem = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-system"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noSystem], ephemeral: true})
       
  }
    
  if(isNaN(botId)) {
      
    const noBot = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["dont-bot"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noBot], ephemeral: true})
       
  }
	  
  let discordBot = null
  try {
    
    discordBot = await client.users.fetch(botId)

  } catch {
     
    const noBot = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["dont-bot"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
	  return await interaction.followUp({embeds: [noBot], ephemeral: true})
   
  }
      
  if(!discordBot.bot) {
        
    const noBot = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["dont-bot"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noBot], ephemeral: true})
       
  }
  
  if(bot) {
    
    const botAlready = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-already"].replace(/\{owner}/g, bot.owner).replace(/\{status}/g, bot.status)}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [botAlready], ephemeral: true})
       
  }

  const response = await axios(`http://158.69.118.209:20122/api/${botId}`)
  const serverCount = response.data.serverCount
  const responseTopgg = response.data.topgg
	
  if(serverCount < serverLimit) {
    
    const notEnoughServer = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["not-enough"].replace(/\{server}/g, serverCount).replace(/\{limit}/g, serverLimit)}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [notEnoughServer], ephemeral: true})
       
  }

  if(topggRequired === true && responseTopgg === false) {
    
    const notTopgg = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["not-topgg"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [notTopgg], ephemeral: true})
       
  }
	
  db.add(`${interaction.guild.id}.queue`, 1)
  db.set(`${interaction.guild.id}.${botId}.owner`, interaction.user.id)
  db.set(`${interaction.guild.id}.${botId}.status`, "Waiting")
  
  const botAdded = new Discord.EmbedBuilder()
    .setColor("Green")
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .setDescription(`${emojis["check"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-added"].replace(/\{log}/g, logChannel)}`)
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await interaction.followUp({embeds: [botAdded], ephemeral: true})
       
  const botLogMessage = new Discord.EmbedBuilder()
    .setColor("Yellow")
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .addFields(
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-name"]}`,
        value: `- \`${discordBot.username}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-id"]}`,
        value: `- \`${botId}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-owner"]}`,
        value: `- <@${interaction.user.id}>`
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-count"]}`,
        value: `- \`${serverCount}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-topgg"]}`,
        value: `- \`${responseTopgg ? `${emojis["check"]}` : `${emojis["cross"]}`}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-queue"]}`,
        value: `- \`${db.fetch(`${interaction.guild.id}.queue`)}\``
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await client.channels.cache.get(logChannel).send({content: `${(locales[interaction.locale] ?? locales[settings.defaultLag])["bot-content"].replace(/\{user}/g, interaction.user.id)}`, embeds: [botLogMessage]})
  
  const buttons = new Discord.ActionRowBuilder()
    .addComponents(new Discord.ButtonBuilder()        
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=0`)
      .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["add-server"])
      .setStyle("Link"),
     new Discord.ButtonBuilder()
      .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["bot-reject"])
      .setStyle(Discord.ButtonStyle.Danger)
      .setCustomId("bot-reject"),
    new Discord.ButtonBuilder()
      .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["bot-approve"])
      .setStyle(Discord.ButtonStyle.Success)
      .setCustomId("bot-approve"))
  
  const authorizedLogMessage = new Discord.EmbedBuilder()
    .setColor("Yellow")
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .addFields(
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-name"]}`,
        value: `- \`${discordBot.username}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-id"]}`,
        value: `- \`${botId}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-owner"]}`,
        value: `- <@${interaction.user.id}>`
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-count"]}`,
        value: `- \`${serverCount}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-topgg"]}`,
        value: `- \`${responseTopgg.ok ? `${emojis["check"]}` : `${emojis["cross"]}`}\``
      },
      {
        name: `${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-queue"]}`,
        value: `- \`${db.fetch(`${interaction.guild.id}.queue`)}\``
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await client.channels.cache.get(authorizedChannel).send({embeds: [authorizedLogMessage], components: [buttons]}).then((message) => {
    db.set(`${interaction.guild.id}.${botId}.authorizedMessage`, message.id)
  })
  
  const owner = await client.users.fetch(db.fetch(`${interaction.guild.id}.${botId}.owner`))
 
  if(dmFollow) {
    
    const botAddedDm = new Discord.EmbedBuilder()
      .setColor("Green")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["check"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-added-dm"].replace(/\{guild}/g, interaction.guild.name)}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await owner.send({embeds: [botAddedDm]})
       
  }
  
}
//--/ Bot Add Modal \--\\

//--/ Show Bot Reject Modal \--\\
async function showBotRejectModal(interaction, locales, settings) {
  
  const botRejectForm = new Discord.ModalBuilder()
    .setCustomId("botrejectform")
    .setTitle((locales[interaction.locale] && locales[settings.defaultLang])["bot-reject-form"])
  const botReject = new Discord.TextInputBuilder()
    .setCustomId("reason")
    .setLabel((locales[interaction.locale] ?? locales[settings.defaultLang])["reject-reason"])
    .setStyle(Discord.TextInputStyle.Paragraph)
    .setMinLength(3)
    .setMaxLength(50)
    .setRequired(true)
  const reject = new Discord.ActionRowBuilder().addComponents(botReject)
  botRejectForm.addComponents(reject)
  
  await interaction.showModal(botRejectForm)
 
}     
//--/ Show Bot Reject Modal \--\\

//--/ Bot Reject Modal \--\\
async function botRejectModal(client, interaction, locales, settings, emojis, db) {

  await interaction.deferUpdate()
  const logChannel = db.fetch(`${interaction.guild.id}.logChannel`)
  const authorizedChannel = db.fetch(`${interaction.guild.id}.authorizedChannel`)
  const authorizedRole = db.fetch(`${interaction.guild.id}.authorizedRole`)
  const botlistSystem = db.fetch(`${interaction.guild.id}.botlistSystem`)
  const dmFollow = db.fetch(`${interaction.guild.id}.dmFollow`)
  const reason = interaction.fields.getTextInputValue("reason")
  const botId = interaction.message.embeds[0].fields[1].value.replace(/\\?`/g, "").replace("- ", "").trim()
  const bot =  db.fetch(`${interaction.guild.id}.${botId}`)
  
  if(!botlistSystem) {
        
    const noSystem = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-system"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noSystem], ephemeral: true})
       
  }
  
  if(!bot) {
    
    const noBot = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-bot"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noBot], ephemeral: true})
       
  }
  
  if(!interaction.member.roles.cache.has(authorizedRole) && !interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
    
    const noAuthorized = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-perm"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noAuthorized], ephemeral: true})
   
  }
  
  const authorizedMessage = db.fetch(`${interaction.guild.id}.${botId}.authorizedMessage`)
  const guild = await client.guilds.fetch(interaction.guild.id)
  const channel = await guild.channels.fetch(authorizedChannel)
  channel.messages.fetch(authorizedMessage).then(message => {
    setTimeout(() => {
      message.edit({components: []})
    }, 1000)
  })
  
  const owner = await client.users.fetch(bot.owner)
  db.substr(`${interaction.guild.id}.queue`, 1)
  db.delete(`${interaction.guild.id}.${botId}`)
	db.set(`${interaction.guild.id}.${botId}.status`, "Rejected")
  db.set(`${interaction.guild.id}.${botId}.redReason`, reason)
  db.set(`${interaction.guild.id}.${botId}.owner`, owner.id)
  
  const botRejectedMessage = new Discord.EmbedBuilder()
    .setColor("Red")
    .setAuthor({name: owner.username, iconURL: owner.avatarURL()}) 
    .addFields(
      {
        name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-name"]}`,
        value: `- <@${botId}>`
      },
      {
        name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-id"]}`,
        value: `- \`${botId}\``
      },
      {
        name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["rejected-staff"]}`,
        value: `- \`${interaction.user.username}\``
      },
      {
        name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["rejected-reason"]}`,
        value: `- \`${reason}\``
      },
      {
        name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-owner"]}`,
        value: `- <@${bot.owner}>`
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await client.channels.cache.get(logChannel).send({content: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-rejected"].replace(/\{user}/g, bot.owner)}`, embeds: [botRejectedMessage]})
  
  if(dmFollow) {
    
    const botRejectedDm = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-rejected-dm"].replace(/\{guild}/g, interaction.guild.name).replace(/\{reason}/g, reason)}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await owner.send({embeds: [botRejectedDm]})
       
  }
  
}
//--/ Bot Reject Modal \--\\

//--/ Bot Approve Button \--\\
async function botApproveButton(client, interaction, locales, settings, emojis, db) {

  await interaction.deferUpdate()
  const logChannel = db.fetch(`${interaction.guild.id}.logChannel`)
  const authorizedChannel = db.fetch(`${interaction.guild.id}.authorizedChannel`)
  const authorizedRole = db.fetch(`${interaction.guild.id}.authorizedRole`)
  const botlistSystem = db.fetch(`${interaction.guild.id}.botlistSystem`)
  const dmFollow = db.fetch(`${interaction.guild.id}.dmFollow`)
  const reason = interaction.fields.getTextInputValue("reason")
  const botId = interaction.message.embeds[0].fields[1].value.replace(/\\?`/g, "").replace("- ", "").trim()
  const bot =  db.fetch(`${interaction.guild.id}.${botId}`)
  const botRole = db.fetch(`${interaction.guild.id}.botRole`)
  const developerRole = db.fetch(`${interaction.guild.id}.developerRole`)
  
  if(!botlistSystem) {
        
    const noSystem = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-system"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noSystem], ephemeral: true})
       
  }
  
  if(!bot) {
    
    const noBot = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["no-bot"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noBot], ephemeral: true})
       
  }
  
  if(!interaction.member.roles.cache.has(authorizedRole) && !interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
    
    const noAuthorized = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
      .setDescription(`${emojis["cross"]} ${(locales[interaction.loacale] ?? locales[settings.defaultLang])["no-perm"]}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await interaction.followUp({embeds: [noAuthorized], ephemeral: true})
   
  }
  
  const authorizedMessage = db.fetch(`${interaction.guild.id}.${botId}.authorizedMessage`)
  const guild = await client.guilds.fetch(interaction.guild.id)
  const channel = await guild.channels.fetch(authorizedChannel)
  channel.messages.fetch(authorizedMessage).then(message => {
    setTimeout(() => {
      message.edit({components: []})
    }, 1000)
  })
  
  const owner = await client.users.fetch(bot.owner)
  const ownerMember = await interaction.guild.members.fetch(bot.owner).catch(() => null)
  const botInfo = await client.users.fetch(botId)
  const botMember = await interaction.guild.members.fetch(botId).catch(() => null)
  
  if(!ownerMember) {
    
    interaction.guild.members.ban(botMember, { reason: "Sahibi sunucudan ayr谋ld谋." })
    db.substr(`${interaction.guild.id}.queue`, 1)
	  db.delete(`${interaction.guild.id}.${botId}`)
	  db.set(`${interaction.guild.id}.${botId}.status`, "Rejected")
    db.set(`${interaction.guild.id}.${botId}.redReason`, "Sahibi sunucudan ayr谋ld谋.")
    db.set(`${interaction.guild.id}.${botId}.owner`, owner.id)
     
    if(dmFollow) {
    
      const botBannedDm3 = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: owner.username, iconURL: owner.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[owner.locale] ?? locales[settings.defaultLang])["bot-banned-dm3"].replace(/\{guild}/g, interaction.guild.name)}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      await owner.send({embeds: [botBannedDm3]})
       
    }
    
    const botBanned = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: owner.username, iconURL: owner.avatarURL()}) 
      .setDescription(`${(locales[owner.locale] ?? locales[settings.defaultLang])["bot-banned"].replace(/\{bot}/g, botId).replace(/\{owner}/g, owner.username)}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await client.channels.cache.get(logChannel).send({embeds: [botBanned]})
      
  } else {
  
    db.substr(`${interaction.guild.id}.queue`, 1)
    db.set(`${interaction.guild.id}.${botId}.status`, "Approved")
    if(botMember) {
      botMember.roles.add(botRole)
    }
    ownerMember.roles.add(developerRole)
  
    const botApprovedMessage = new Discord.EmbedBuilder()
      .setColor("Green")
      .setAuthor({name: owner.username, iconURL: owner.avatarURL()}) 
      .addFields(
        {
          name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-name"]}`,
          value: `- <@${botId}>`
        },
        {
          name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-id"]}`,
          value: `- \`${botId}\``
        },
        {
          name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-owner"]}`,
          value: `- <@${bot.owner}>`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await client.channels.cache.get(logChannel).send({content: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-rejected"].replace(/\{user}/g, bot.owner)}`, embeds: [botApprovedMessage]})
  
    if(dmFollow) {
    
      const botApprovedDm = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[interaction.locale] ?? locales[settings.defaultLang])["bot-approved-dm"].replace(/\{guild}/g, interaction.guild.name).replace(/\{reason}/g, reason)}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      await owner.send({embeds: [botApprovedDm]})
       
    }
  }
  
}
//--/ Bot Approve Button \--\\

//--/ Auto Approve \--\\
async function autoApprove(client, member, settings, locales, emojis, db) {
  
  if(!member.user.bot) return
  const bot =  db.fetch(`${member.guild.id}.${member.id}`)
  const botRole = db.fetch(`${member.guild.id}.botRole`)
  const developerRole = db.fetch(`${member.guild.id}.developerRole`)
  const logChannel = db.fetch(`${member.guild.id}.logChannel`)
  const dmFollow = db.fetch(`${member.guild.id}.dmFollow`)
  const authorizedChannel = db.fetch(`${member.guild.id}.authorizedChannel`)
  const botlistSystem = db.fetch(`${member.guild.id}.botlistSystem`)
  
  if(!botlistSystem) return 
  
  if(!bot) return
  if(bot.status !== "Waiting") return
  
  const authorizedMessage = db.fetch(`${member.guild.id}.${member.id}.authorizedMessage`)
  const guild = await client.guilds.fetch(member.guild.id)
  const channel = await guild.channels.fetch(authorizedChannel)
  channel.messages.fetch(authorizedMessage).then(message => {
    setTimeout(() => {
      message.edit({components: []})
    }, 1000)
  })
  
  const owner = await client.users.fetch(bot.owner)
  const ownerMember = await member.guild.members.fetch(bot.owner).catch(() => null)
  
  if(!ownerMember) {
    
    member.guild.members.ban(member, { reason: "Sahibi sunucudan ayr谋ld谋." })
    db.substr(`${member.guild.id}.queue`, 1)
	  db.delete(`${member.guild.id}.${member.id}`)
	  db.set(`${member.guild.id}.${member.id}.status`, "Rejected")
    db.set(`${member.guild.id}.${member.id}.redReason`, "Sahibi sunucudan ayr谋ld谋.")
    db.set(`${member.guild.id}.${member.id}.owner`, owner.id)
     
    if(dmFollow) {
    
      const botBannedDm1 = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: owner.username, iconURL: owner.avatarURL()}) 
        .setDescription(`${emojis["cross"]} ${(locales[owner.locale] ?? locales[settings.defaultLang])["bot-banned-dm1"].replace(/\{guild}/g, member.guild.name)}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      await owner.send({embeds: [botBannedDm1]})
       
    }
    
    const botBanned = new Discord.EmbedBuilder()
      .setColor("Red")
      .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()}) 
      .setDescription(`${(locales[member.locale] ?? locales[settings.defaultLang])["bot-banned"].replace(/\{bot}/g, member.id).replace(/\{owner}/g, owner.username)}`)
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    return await client.channels.cache.get(logChannel).send({embeds: [botBanned]})
      
  } else {
  
    db.substr(`${member.guild.id}.queue`, 1)
    db.set(`${member.guild.id}.${member.id}.status`, "Approved")
    member.roles.add(botRole)
    ownerMember.roles.add(developerRole)
  
    const botApproveMessage = new Discord.EmbedBuilder()
      .setColor("Green")
      .setAuthor({name: owner.username, iconURL: owner.avatarURL()}) 
      .addFields(
        {
          name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-name"]}`,
          value: `- <@${member.id}>`
        },
        {
          name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-id"]}`,
          value: `- \`${member.id}\``
        },
        {
          name: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-owner"]}`,
          value: `- <@${bot.owner}>`
        })
      .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
      .setTimestamp()
    await client.channels.cache.get(logChannel).send({content: `${(locales[owner.lang] ?? locales[settings.defaultLang])["bot-approved"].replace(/\{user}/g, bot.owner)}`, embeds: [botApproveMessage]})
  
    if(dmFollow) {
    
      const botApprovedDm = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({name: owner.username, iconURL: owner.avatarURL()}) 
        .setDescription(`${emojis["check"]} ${(locales[owner.locale] ?? locales[settings.defaultLang])["bot-approved-dm"].replace(/\{guild}/g, member.guild.name)}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      await owner.send({embeds: [botApprovedDm]})
       
    }
    
  }
}
//--/ Auto Approve \--\\

//--/ Auto Ban \--\\
async function autoBan(client, member, locales, settings, emojis, db) {
  
  const logChannel = db.fetch(`${member.guild.id}.logChannel`)
  const botlistSystem = db.fetch(`${member.guild.id}.botlistSystem`)
  const dmFollow = db.fetch(`${member.guild.id}.dmFollow`)

  if(!botlistSystem) return
  
  const members = await member.guild.members.fetch()
  members.filter(y => db.fetch(`${member.guild.id}.${y.id}`)).forEach(async x => {
    const bot = db.fetch(`${member.guild.id}.${x.id}`)
    if(!bot) return
    if(bot.status === "Rejected") return 
    const owner = await client.users.fetch(bot.owner)
  
    if(bot.owner === member.id) {
      
      member.guild.members.ban(x, { reason: "Sahibi sunucudan ayr谋ld谋." })
	    db.delete(`${member.guild.id}.${x.id}`)
	    db.set(`${member.guild.id}.${x.id}.status`, "Rejected")
      db.set(`${member.guild.id}.${x.id}.redReason`, "Sahibi sunucudan ayr谋ld谋.")
      db.set(`${member.guild.id}.${member.id}.owner`, owner.id)
     
      const botBanned = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()}) 
        .setDescription(`${(locales[member.locale] ?? locales[settings.defaultLang])["bot-banned"].replace(/\{bot}/g, x.id).replace(/\{owner}/g, member.user.username)}`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
        .setTimestamp()
      await client.channels.cache.get(logChannel).send({embeds: [botBanned]})
      
      if(dmFollow) {
     
        const botBannedDm2 = new Discord.EmbedBuilder()
          .setColor("Red")
          .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()}) 
          .setDescription(`${emojis["cross"]} ${(locales[member.locale] ?? locales[settings.defaultLang])["bot-banned-dm2"].replace(/\{guild}/g, member.guild.name)}`)
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
          .setTimestamp()
        await owner.send({embeds: [botBannedDm2]})
       
      }
      
    }
    
  })
    
}
//--/ Auto Ban \--\\

//--/ Anti Crash \--\\
async function antiCrash(client, logs) {
  
  process.on('unhandledRejection', async(reason, promise) => {
    const error = new Discord.EmbedBuilder()
      .setColor("Red")
      .setDescription(`\`\`\`js\n${reason}\n\`\`\``)
    await client.channels.cache.get(logs.errorLog).send({embeds: [error]})
  })
  
  process.on("uncaughtException", async(err, promise) => {
    if(err === "DiscordAPIError[10062]: Unknown interaction" || err === "DiscordAPIError[40060]: Interaction has already been acknowledged.") return
    const error = new Discord.EmbedBuilder()
      .setColor("Red")
      .setDescription(`\`\`\`js\n${err}\n\`\`\``)
    await client.channels.cache.get(logs.errorLog).send({embeds: [error]})
  })
  
  process.on("uncaughtExceptionMonitor", async(err, promise) => {
    if(err === "DiscordAPIError[10062]: Unknown interaction" || err === "DiscordAPIError[40060]: Interaction has already been acknowledged.") return
    const error = new Discord.EmbedBuilder()
      .setColor("Red")
      .setDescription(`\`\`\`js\n${err}\n\`\`\``)
    await client.channels.cache.get(logs.errorLog).send({embeds: [error]})
  })
}
//--/ Anti Crash \--\\

//--/ Added Log \--\\
async function addedLog(client, logs, guild) {
 
  const added = new Discord.EmbedBuilder()
    .setColor("Green")
    .setAuthor({name: guild.name, iconURL: guild.iconURL()}) 
    .setDescription(`> **Bir sunucuya eklendim.**`)
    .addFields(
      {
        name: `Sunucu bilgileri`,
        value: `- **${guild}** \`(${guild.id})\``
      },
      {
        name: `Sunucu sahibi bilgileri`,
        value: `- **${client.users.cache.get(guild.ownerId).username}** \`(${guild.ownerId})\``
      },
      {
        name: `Toplam sunucu sayısı`,
        value: `- **${client.guilds.cache.size}**`
      },
      {
        name: `Sunucudaki kullanıcı sayısı`,
        value: `- **${guild.memberCount}**`
      })
   .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
   .setTimestamp()
  await client.channels.cache.get(logs.addedLog).send({embeds: [added]})
  
}
//--/ Added Log \--\\

//--/ Removed Log \--\\
async function removedLog(client, logs, guild, db) {
  
  const removed = new Discord.EmbedBuilder()
    .setColor("Red")
    .setAuthor({name: guild.name, iconURL: guild.iconURL()}) 
    .setDescription(`> **Bir sunucudan atıldım.**`)
    .addFields(
      {
        name: `Sunucu bilgileri`,
        value: `- **${guild}** \`(${guild.id})\``
      },
      {
        name: `Sunucu sahibi bilgileri`,
        value: `- **${client.users.cache.get(guild.ownerId).username}** \`(${guild.ownerId})\``
      },
      {
        name: `Toplam sunucu sayısı`,
        value: `- **${client.guilds.cache.size}**`
      },
      {
        name: `Sunucudaki kullanıcı sayısı`,
        value: `- **${guild.memberCount}**`
      })
   .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
   .setTimestamp()
  await client.channels.cache.get(logs.removedLog).send({embeds: [removed]})
  
  db.delete(`${guild.id}`)
  
}
//--/ Removed Log \--\\

//--/ Command Log \--\\
async function commandLog(client, interaction, logs, command) {
  
  const commandLog = new Discord.EmbedBuilder()
    .setColor("Blurple")
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()}) 
    .addFields(
      {
        name: `Komutu kullanan`,
        value: `- **${interaction.user.username}** \`(${interaction.user.id})\``
      },
      {
        name: `Kullanılan sunucu`,
        value: `- **${interaction.guild.name}** \`(${interaction.guild.id})\``
      },
      {
        name: `Kullanılan komut`,
        value: `- **${command.data.name}**`
      })
    .setFooter({text: client.user.username, iconURL: client.user.avatarURL()}) 
    .setTimestamp()
  await client.channels.cache.get(logs.commandLog).send({embeds: [commandLog]})

}
//--/ Command Log \--\\

//--/ Auto Reset Role \--\\
async function autoRoleReset(role, db) {
  
  const botRole = db.fetch(`${role.guild.id}.botRole`)
  const developerRole = db.fetch(`${role.guild.id}.developerRole`)
  const authorizedRole = db.fetch(`${role.guild.id}.authorizedRole`)
  const botlistSystem = db.fetch(`${role.guild.id}.botlistSystem`)
  
  if(role.id === botRole) {
    
    db.delete(`${role.guild.id}.botRole`)
    db.delete(`${role.guild.id}.botlistSystem`)
    
  } else if(role.id === developerRole) {
    
    db.delete(`${role.guild.id}.developerRole`)
    db.delete(`${role.guild.id}.botlistSystem`)
    
  } else if(role.id === authorizedRole) {
    
    db.delete(`${role.guild.id}.authorizedRole`)
    db.delete(`${role.guild.id}.botlistSystem`)
    
  } else return
  
}
//--/ Auto Reset Role \--\\

//--/ Auto Reset Channel \--\\
async function autoChannelReset(channel, db) {
  
  const addChannel= db.fetch(`${channel.guild.id}.addChannel`)
  const logChannel = db.fetch(`${channel.guild.id}.logChannel`)
  const authorizedChannel = db.fetch(`${channel.guild.id}.authorizedChannel`)
  const botlistSystem = db.fetch(`${channel.guild.id}.botlistSystem`)
  
  if(channel.id === addChannel) {
    
    db.delete(`${channel.guild.id}.addChannel`)
    db.delete(`${channel.guild.id}.botlistSystem`)
    
  } else if(channel.id === logChannel) {
    
    db.delete(`${channel.guild.id}.logChannel`)
    db.delete(`${channel.guild.id}.botlistSystem`)
    
  } else if(channel.id === authorizedChannel) {
    
    db.delete(`${channel.guild.id}.authorizedChannel`)
    db.delete(`${channel.guild.id}.botlistSystem`)
    
  } else return
  
}
//--/ Auto Reset Channel \--\\

module.exports = { 
  showBotAddModal,
  botAddModal,
  showBotRejectModal,
  botRejectModal,
  botApproveButton,
  autoApprove,
  autoBan,
  antiCrash,
  addedLog,
  removedLog,
  commandLog,
  autoRoleReset,
  autoChannelReset
}
