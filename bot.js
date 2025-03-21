const Discord = require('discord.js')
const fs = require("fs")
const fetch = require("node-fetch")
const axios = require("axios")
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: `./bot/database.json`})
const emojis = require("./bot/emojis.json")
const logs = require("./bot/logs.json")
const locales = {
  "tr": require("./locales/tr.json")
}
const settings = require("./settings.json")
const { showBotAddModal, botAddModal, showBotRejectModal, botRejectModal, botApproveButton, autoApprove, autoBan, antiCrash, addedLog, removedLog, autoRoleReset, autoChannelReset } = require("./functions")
const client = new Discord.Client({
  intents: [53608447]
})

client.login(settings.token)

fs.readdirSync("./events").forEach(async file => {
  const event = await require(`./events/${file}`)
  if(event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
  console.log(`[${file}] event loaded.`)
})

const commands = []
client.commands = new Discord.Collection()
fs.readdirSync("./commands").forEach(async file => {
  if(file.endsWith('.js')) {
    const command = await require(`./commands/${file}`)
    if(command.slash) {
      commands.push(command.data.toJSON())
      client.commands.set(command.data.name, command)
      console.log(`[${file}] slash command loaded.`)
    }
    if(!command.slash) {
      client.commands.set(command.name[0], command)
      console.log(`[${file}] prefix command loaded.`)
    }
  }
})

const rest = new Discord.REST({version: "10"}).setToken(settings.token)
setTimeout(async () => {
  rest.put(Discord.Routes.applicationCommands(settings.botId), {body: commands}).catch(console.error)
}, 500)

//--/ Show Bot Add Modal \--\\
client.on("interactionCreate", async interaction => {
  if(!interaction.isButton()) return
  if(interaction.customId === "bot-add") {
    await showBotAddModal(interaction, locales, settings)
  } 
})
//--/ Show Bot Add Modal \--\\

//--/ Show Reject Bot Modal \--\\
client.on("interactionCreate", async interaction => {
  if(!interaction.isButton()) return
  if(interaction.customId === "bot-reject") {
    await showBotRejectModal(interaction, locales, settings)
  } 
})
//--/ Show Reject Bot Modal \--\\

//--/ Bot Add Modal \--\\
client.on("interactionCreate", async interaction => {
  if(interaction.type !== Discord.InteractionType.ModalSubmit) return
  if(interaction.customId === "botaddform") {
    await botAddModal(client, interaction, locales, settings, emojis, db, fetch, axios)
  }
})
//--/ Bot Add Modal \--\\

//--/ Bot Reject Modal \--\\
client.on("interactionCreate", async interaction => {
  if(interaction.type !== Discord.InteractionType.ModalSubmit) return
  if(interaction.customId === "botrejectform") {
    await botRejectModal(client, interaction, locales, settings, emojis, db)
  }
})
//--/ Bot Reject Modal \--\\

//--/ Bot Approve Button \--\\
client.on("interactionCreate", async interaction => {
  if(!interaction.isButton()) return
  if(interaction.customId === "bot-approve") {
    await botApproveButton(client, interaction, locales, settings, emojis, db)
  } 
})
//--/ Bot Approve Button \--\\

//--/ Auto Approve \--\\
client.on("guildMemberAdd", async (member) => {
  await autoApprove(client, member, settings, locales, emojis, db)
})
//--/ Auto Approve \--\\

//--/ Auto Ban \--\\
client.on("guildMemberRemove", async (member) => {
  await autoBan(client, member, locales, settings, emojis, db)
})
//--/ Auto Ban \--\\

//--/ Anti Crash \--\\
antiCrash(client, logs)
//--/ Anti Crash \--\\

//--/ Added Log \--\\
client.on("guildCreate", async guild => {
  await addedLog(client, logs, guild)
})
//--/ Added Log \--\\

//--/ Removed Log \--\\
client.on("guildDelete", async guild => {
  await removedLog(client, logs, guild, db)
})
//--/ Removed Log \--\\

//--/ Auto Reset Role \--\\
client.on("roleDelete", async role => {
  await autoRoleReset(role, db)
})
//--/ Auto Reset Role \--\\

//--/ Auto Reset Channel \--\\
client.on("channelDelete", async channel => {
  await autoChannelReset(channel, db)
})
//--/ Auto Reset Channel \--\\
