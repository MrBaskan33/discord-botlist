const Discord = require("discord.js")

module.exports = {
  name: "ready",
  async execute(client) {
    
    setInterval(function () {
      client.user.setPresence({
        activities: [
          {
            name: "Botlist hazırlıyor.", 
            type: Discord.ActivityType.Custom
          }
        ],
        "status": "idle"
      })
    }, 10000)
    
    console.log(`[${client.user.tag}] active.`)
    
  }
}
