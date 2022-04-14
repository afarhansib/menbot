const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node jumper.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'jumper',
  password: process.argv[5]
})

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let acakON
async function acak() {
  acakON = setInterval(() => {
    bot.look(Math.floor(Math.random() * 45), Math.floor(Math.random() * 45))
  }, 100)
}

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  switch (message) {
    case '`maju':
      bot.setControlState('forward', true)
      break
    case `\`${bot.username} acak on`:
      acak()
      break
    case `\`${bot.username} acak off`:
      clearInterval(acakON)
      break
    case '`maju dikit':
      bot.setControlState('forward', true)
      await wait(2000)
      bot.setControlState('forward', false)
      break
    case '`mundur':
      bot.setControlState('back', true)
      break
    case '`kiri':
      bot.setControlState('left', true)
      break
    case '`kanan':
      bot.setControlState('right', true)
      break
    case '`lari':
      bot.setControlState('sprint', true)
      break
    case '`stop':
      bot.clearControlStates()
      break
    case '`loncat':
      bot.setControlState('jump', true)
      bot.setControlState('jump', false)
      break
    case '`loncat loncat':
      bot.setControlState('jump', true)
      break
    case '`stop loncat':
      bot.setControlState('jump', false)
      break
    case '`hit':
      entity = bot.nearestEntity()
      if (entity) {
        bot.attack(entity, true)
      } else {
        bot.chat('no nearby entities')
      }
      break
    case 'tp':
      bot.entity.position.y += 10
      break
    case 'pos':
      bot.chat(bot.entity.position.toString())
      break
    case 'yp':
      bot.chat(`Yaw ${bot.entity.yaw}, pitch: ${bot.entity.pitch}`)
      break
  }
})

bot.once('spawn', () => {
  // mineflayerViewer(bot, { port: 3007, firstPerson: true })
  mineflayerViewer(bot, { port: 3007 })
})