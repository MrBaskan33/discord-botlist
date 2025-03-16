const Discord = require("discord.js")
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: `./bot/database.json`})
const settings = require("../settings.json")
const emojis = require("../bot/emojis.json")
const logs = require("../bot/logs.json")
const { commandLog } = require("../functions")
const locales = {
  "tr": require("../locales/tr.json")
}

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
              
    let client = interaction.client
    const command = client.commands.get(interaction.commandName)
    if(!command) return
    
    await commandLog(client, interaction, logs, command)
    
    try {
      command.execute(client, interaction)
    } catch (error) {
      console.error(error)
    }
    
  }
}
