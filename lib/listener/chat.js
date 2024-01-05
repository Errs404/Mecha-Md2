
const {
  MessageType, Mimetype, delay
} = require('@adiwajshing/baileys')
const fs = require("fs");
global.dbcount = 0;
cmd.dbantispam = {};


// const moment = require('moment')
// settings = JSON.parse(fs.readFileSync('./src/settings.json'))
// const time = moment().format('DD/MM HH:mm:ss')
// function INFOLOG(info) {
//   console.log('\x1b[1;34m~\x1b[1;37m>>', '<\x1b[1;33mINF\x1b[1;37m>', time, color(info))
// }
// async function resetAllLimit(amount) {
//   amount = Number(amount)
//   let obj = database[msg.sender.jid]
//   if (obj.limit < amount) {
//     obj.limit = amount
//   }
//   pushing(obj)
//   return { status: true, limit: Number(amount) }
// }
// // Set the date we're counting down to
// var countDownDate = settings.Reset_Time

// // console.log(new Date("2 19, 2021 13:46:00").getTime())

// // Update the count down every 1 second
// var x = setInterval(function () {

//   // Get today's date and time
//   var now = new Date().getTime();

//   // Find the distance between now and the count down date
//   var distance = countDownDate - now;

//   // Time calculations for days, hours, minutes and seconds
//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   // Display the result in the element with id="demo"
//   const countReset = days + "d " + hours + "h "
//     + minutes + "m " + seconds + "s ";

//   // If the count down is finished, write some text
//   if (distance < 0) {
//     clearInterval(x);
//     INFOLOG('Waktunya Reset!');
//     resetAllLimit(settings.Limit)
//       .then(() => {
//         const newCountReset = moment(settings.Reset_Time).add('24', 'hours').valueOf()
//         settings.Reset_Time = newCountReset
//       })
//   }
// }, 1000);

process.on("uncaughtException", console.log);
client.ev.on('messages.upsert', async (chat) => {
  try {
    const an = process.memoryUsage();
    console.log('RSS : ' + functions.parseByteName(an.rss));
    if (!Object.keys(chat.messages[0]).includes('message') || !Object.keys(chat.messages[0]).includes('key')) return chat;
    if (!chat.messages[0].message) return chat;
    const msg = await functions.metadataMsg(client, chat.messages[0])
    if (!(client.chats[msg.from])) client.chats[msg.from] = {};
    // console.log(client.chats[msg.from])
    if (!(client.chats[msg.from].messages)) client.chats[msg.from].messages = {};
    if (!(client.chats[msg.from].messages[msg.id])) client.chats[msg.from].messages[msg.id] = msg;
    if (!(database[msg.from])) database[msg.from] = {};
    if (!!(database[msg.from]["messages"])) database[msg.from].messages = undefined;
    if (!database[msg.from]) database[msg.from] = msg;
    if (msg.isGroup) {
      if (!database[msg.from]["antilink"]) database[msg.from].antilink = false;
      if (!database[msg.from]["antivo"]) database[msg.from].antivo = false;
      if (!database[msg.from]["nobot"]) database[msg.from].nobot = false;
      if (!database[msg.from]["autosticker"]) database[msg.from].autosticker = false;
      if (!database[msg.from]["mute"]) database[msg.from].mute = false;
      if (!database[msg.from]["welcome"]) database[msg.from].welcome = true;
      if (!database[msg.from]["leave"]) database[msg.from].leave = true;
      if (!database[msg.from]["setwelcome"]) database[msg.from]["setwelcome"] = {};
      if (!database[msg.from]["setleave"]) database[msg.from]["setleave"] = {};
      if (!database[msg.from].participants && client.chats[msg.from].participants) {
        let metadata = msg.groupData
        metadata.desc = metadata.desc || "-"
        for (let a in metadata) {
          database[msg.from][a] = metadata[a]
        }
      }
    } else {
      if (!database[msg.from]["uid"]) database[msg.from].uid = msg.sender.jid
      if (!database[msg.from]["number"]) database[msg.from].number = msg.sender.jid.split("@")[0]
      if (!database[msg.from]["name"]) database[msg.from].name = msg.sender.name
      if (!database[msg.from]["limit"]) database[msg.from].limit = 25;
      if (!database[msg.from]["score"]) database[msg.from].score = 0;
    }


    if (!global.linkgcme) {
      let v = await client.groupInviteCode('6283836284553-1608991358@g.us')
      // let v = 'huhu'
      global.linkgcme = "https://chat.whatsapp.com/" + v;
    }

    if (msg.key.id.length < 20) return chat;
    if (msg.key.remoteJid == 'status@broadcast') return chat;
    if (!msg.key.fromMe && config.self) return chat;


    if (msg.string.includes(`unmute`)) {
      if (!database[msg.from].mute) return client.reply(msg, `bot tidak di mute di gc ini`)
      database[msg.from].mute = false
      client.reply(msg, `sucess un,mute in gc ${msg.groupData.subject}`)
    }
    if (global.database[msg.from].mute) return console.log(`mute chat`)
    // cmd.execute(msg);
    // require("./handler")(client, msg)


    await cmd.execute(msg).catch(e => {
      console.log(e)
    })
    require("./handler")(client, msg)
    if (msg.realType == 'templateButtonReplyMessage' || (msg.quotedMsg && (msg.quotedMsg.body.message && msg.quotedMsg.body.message.templateMessage || msg.quotedMsg.message.templateMessage)) || (msg.key.fromMe && msg.body.message && msg.body.message.templateMessage)) {
      await client.chatModify({
        clear: {
          messages: [{
            fromMe: msg.key.fromMe, id: msg.id, timestamp: msg.messageTimestamp
          }]
        }
      }, msg.from).catch(e => e)
    }
    return chat
  } catch (e) {
    if (!String(e).includes('this.isZero')) {
      console.log(e);
    }
  }
});


client.ev.on('call', async (cal) => {
  console.log(cal)
  for (let tr of cal) {
    if (!tr.isGroup) return;
    if (tr.status == "offer" || tr.status == "ringing" || tr.status == "timeout") {
      await client.reply(tr.from, {
        text:
          `  *${client.user.name}* tidak bisa menerima panggilan ${tr.isVideo ? `video` : `suara`}. 

*「 ID: ${tr.id}
  NumberId: ${tr.from}
  Date:  ${tr.date} 」*

 Maaf @${tr.from.split('@')[0]} kamu akan diblock.
Karena telah melanggar syarat dan ketentuan bot 
Jika tidak sengaja silahkan hubungi Owner untuk dibuka !`, mentions: [tr.from]
      })

      const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
        + 'VERSION:3.0\n'
        + 'FN:Jeruk Perassz\n' // full name
        + 'ORG:Owner MechaBot;\n' // the organization of the contact
        + 'TEL;type=CELL;type=VOICE;waid=6283862323152:+62 838-6232-3152\n' // WhatsApp ID + phone number
        + 'END:VCARD'
      await client.sendMessage(tr.from, { contacts: { displayName: 'Prassz', contacts: [{ vcard }] } })
      await functions.delay(5000)
      await client.updateBlockStatus(tr.from, "block")
    }
  }
})