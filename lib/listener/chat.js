
const {
  MessageType, Mimetype, delay
} = require('@adiwajshing/baileys')
const fs = require("fs");
global.dbcount = 0;
cmd.dbantispam = {};


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
    if (!database[msg.from]["limit"]) database[msg.from].limit = 25;
    if (!database[msg.from]["score"]) database[msg.from].score = 0;
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
    }


    if (!global.linkgcme) {
      let v = await client.groupInviteCode('6283836284553-1608991358@g.us')
      global.linkgcme = "https://chat.whatsapp.com/" + v;
    }

    if (msg.key.id.length < 20) return chat;
    if (msg.key.remoteJid == 'status@broadcast') return chat;
    if (!msg.key.fromMe && config.self) return chat;


    // if (msg.string.includes(`unmute`)) {
    //   if (!global.database[msg.from].mute.includes(msg.from)) return client.reply(msg, `bot tidak di mute di gc ini`)
    //   global.database[msg.from].mute.splice(msg.from)
    //   client.reply(msg, `sucess un,mute in gc ${msg.groupData.subject}`)
    // }
    // if (global.database[msg.from].mute.includes(msg.from)) return console.log(`mute chat`)
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