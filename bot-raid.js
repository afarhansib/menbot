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

async function seq() {
  //right 1 block
  bot.setControlState('right', true)
  await wait(200)
  bot.setControlState('right', false)
  //back 4 blocks
  bot.setControlState('back', true)
  await wait(200)
  bot.setControlState('back', false)
}

async function attack(dur = 1200) {
  let att = setInterval(() => {
    // console.log(bot.nearestEntity())
    if(bot.nearestEntity()?.type === "mob") {
      bot.attack(bot.nearestEntity())
    }
  }, 1200);
  await wait(dur)
  clearInterval(att)
}

// basic mov
async function go(where = "forward", dur = 200) {
  if (where === "wait") {
    return wait(dur)
  }
  if (where === "hit") {
    return attack(dur)
  }
  // return new Promise(async (resolve) => {
    bot.setControlState(where, true)
    await wait(dur)
    bot.setControlState(where, false)
    await wait(1000)
    // resolve()
  // })
}

function sumDur(str) {
  let tot = 0

  let allCom = str.split("-")
  allCom.forEach(e => {
    tot += Number(e.split(" ")[1])
  })
  
  return tot
}

let loopSeqs

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  // console.log(message)
  messagePre = message.split(" ")[0]
  // console.log(messagePre)
  switch (messagePre) {
    case '`startseq':
      let seqs = "left 300-back 1200-wait 3000-right 600-wait 7000-forward 1500-left 270-hit 50000"
      allMoves = seqs.split("-")
    
      loopSeqs = setInterval(async () => {
        for (const e of allMoves) {
          let where = e.split(" ")[0]
          let dur = e.split(" ")[1]
    
          await go(where, dur)
        }
      }, sumDur(seqs) + 1200)
      break
    case '`seq':
      // bot.chat("hi")
      allMoves = message.split("`seq ")[1].split("-")
      for (const e of allMoves) {
        let where = e.split(" ")[0]
        let dur = e.split(" ")[1]
  
        await go(where, dur)
      }
      // allMoves.forEach(async (e, i) => {
        // bot.chat(where + dur + "ms")
      // })
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

bot.on("kicked", rea => {
  console.log(rea)
})

bot.on("end", rea => {
  console.log(rea)
})
