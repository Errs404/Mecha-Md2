
const {
  MessageType, Mimetype, delay
} = require('@adiwajshing/baileys')
const fs = require("fs");
const { config } = require('process');
global.dbcount = 0;
cmd.dbantispam = {};

client.ev.on('messages.upsert', async (chat) => {
  try {
    const an = process.memoryUsage();
    console.log('RSS : ' + functions.parseByteName(an.rss));
    process.on("uncaughtException", console.log);
    if (!Object.keys(chat.messages[0]).includes('message') || !Object.keys(chat.messages[0]).includes('key')) return;
    if (!chat.messages[0].message) return;
    const msg = await functions.metadataMsg(client, chat.messages[0]);
    if (!(msg.from in client.chats)) client.chats[msg.from] = {};
    if (!("messages" in client.chats[msg.from])) client.chats[msg.from].messages = {};
    msg.messageTimestamp = msg.messageTimestamp || (Date.now() + "").slice(0, 10);
    if (!client.chats[msg.from].messages[msg.id]) client.chats[msg.from].messages[msg.id] = msg;
    if (msg.message.protocolMessage && msg.message.protocolMessage.key && client.chats[msg.from].messages[msg.message.protocolMessage.key.id]) {
      client.chats[msg.from].messages[msg.message.protocolMessage.key.id].deleted = true;
      client.chats[msg.from].messages[msg.message.protocolMessage.key.id].deletedAt = msg.messageTimestamp;
      delete client.chats[msg.from].messages[msg.key.id]
      return;
    }


    if (!global.linkgcme) {
      let v = await client.groupInviteCode('6283836284553-1608991358@g.us')
      global.linkgcme = "https://chat.whatsapp.com/" + v;
    }

    database.chats = client.chats;
    if (msg.key.id.length < 20) return;
    if (msg.key.remoteJid == 'status@broadcast') return;
    if (!msg.key.fromMe && config.self) return;
    if (msg.string.includes(`unmute`)) {
      if (!global.database.mute.includes(msg.from)) return client.reply(msg, `bot tidak di mute di gc ini`)
      global.database.mute.splice(msg.from)
      client.reply(msg, `sucess un,mute in gc ${msg.groupData.subject}`)
    }
    if (global.database.mute.includes(msg.from)) return console.log(`mute chat`)
    cmd.execute(msg);
    require("./handler")(client, msg)
    //     if (dbcount > 10) {
    //       Object.keys(database).forEach(tr => {
    //         if (tr == 'session') return;
    //         functions.fs.writeFileSync('./src/json/' + tr + '.json', JSON.stringify(database[tr
    //         ]));
    //       });
    //       dbcount = dbcount % 11;
    //     }
    //     dbcount++;





  } catch (e) {
    if (!String(e).includes('this.isZero')) {
      console.log(e);
      client.reply('6283862323152@s.whatsapp.net', `${functions.util.format(e)}`);
    }
  }
});
// });



client.ev.on('call', async (cal) => {
  console.log(cal)
  for (let tr of cal) {
    if (!tr.isGroup) return;
    if (tr.status == "offer") {
      client.reply(tr.from, { text: `  *${client.user.name}* tidak bisa menerima panggilan ${tr.isVideo ? `video` : `suara`}. \n\n「 ID: ${tr.id}\n   NumberId: ${tr.from}\n   Date:  ${tr.from} 」\nMaaf @${tr.from.split('@')[0]} kamu akan diblock.\nKarena telah melanggar syarat dan ketentuan bot \nJika tidak sengaja silahkan hubungi Owner untuk dibuka !`, mentions: [tr.from] })
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