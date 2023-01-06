process.on("uncaughtException", console.log);
const { configureSuccessfulPairing, jidEncode } = require("@adiwajshing/baileys")
const fs = require("fs")

cmd.on(["kick", "add", "promote", "demote"], ["group"], async (msg, {
  client, mentionedJid, quotedMsg, query, command
}) => {
  let action = command.toLowerCase() == "kick" ? "remove" : command
  let participant = []
  let inactive = []
  if (!query && !quotedMsg && !mentionedJid) return client.reply(msg, `Kirim Pesan Nomor Telepon Contoh ${config.prefix[0]}${command} nomor|nomor Atau Tag Nomor/Pesan Terakhir Sambil Kirim Pesan ${config.prefix[0]}${command}`)
  if (mentionedJid && mentionedJid.length != 0) {
    participant = mentionedJid
  } else if (query) {
    if (query.includes('|')) {
      participant = query.split('|').map(tr => {
        let parsed = tr.split(' ').join('').replace(/(\-)/gi, '').replace(/(\+)/gi, '')
        parsed = parsed.startsWith('0') ? parsed.replace('0', '62') : parsed
        return parsed + "@s.whatsapp.net"
      })
    } else {
      let parsed = query.split(' ').join('').replace(/(\-)/gi, '').replace(/(\+)/gi, '')
      parsed = parsed.startsWith('0') ? parsed.replace('0', '62') : parsed
      participant = [parsed + "@s.whatsapp.net"]
    }
  } else if (quotedMsg) {
    participant = [quotedMsg.sender.jid]
  }
  if (participant.length == 0) return client.reply(msg, `Kirim Pesan Nomor Telepon Contoh ${config.prefix[0]}${command} nomor|nomor Atau Tag Nomor/Pesan Terakhir Sambil Kirim Pesan ${config.prefix[0]}${command}`)
  participant.forEach(async (tr) => {
    let onwa = await client.onWhatsApp(tr)
    if (!onwa[0]) {
      inactive.push(tr)
    } else {
      let req = await client.groupParticipantsUpdate(msg.from, [tr], action)
      if (req && req[0].status != 200) inactive.push(tr);
      await functions.delay(1000)
    }
  })
  if (inactive.length != 0) {
    client.reply(msg, {
      text: `Nomor-Nomor Yang Gagal Di Masukan/Tidak Aktif:\n${inactive.map(tr => "@" + tr.split('@')[0]).join("\n-")}`
    })
  }
  await client.reply(msg, `Sukses Men${action} Peserta`)
}, {
  group: "Harus Group",
  admin: true,
  clientAdmin: "botnya diadminin dulu kk",
  param: "<nomor|tag>"
})

// cmd.on(['add', 'kick', 'promote', 'demote'], ['group'], async (msg, { client, groupData, query, command }) => {
//   if (query.startsWith("08")) return client.reply(msg, "Masukan Nomor Dengan Awalan Kodenegara Contoh: add 6283862323152")
//   jid = query.split(' ').join('').replace("08", "628").replace(/-/gi, '').replace('+', '') + "@s.whatsapp.net"
//   let quotedd = msg.quotedMsg ? msg.quotedMsg.sender.jid : false
//   let ment = query.includes("@") ? msg.string.split("@") + "@s.whatsapp.net" : false
//   let ber = query.replace("+", "")
//   let num = ber.replace(" ", "")
//   let number = query.includes(" ") ? num.replace(/-/g, "") + "@s.whatsapp.net" : false
//   if (command == "add") {
//     await client.groupParticipantsUpdate(msg.from, [quotedd || jid || ment], "add")
//   }
//   if (command == "kick") {
//     await client.groupParticipantsUpdate(msg.from, [ment || jid || quotedd], "remove")
//   }
//   if (command == "promote") {
//     await client.groupParticipantsUpdate(msg.from, [quotedd || jid || ment], "promote")
//   }
//   if (command == "demote") {
//     await client.groupParticipantsUpdate(msg.from, [quotedd || jid || ment], "demote")
//   }
// }, {
//   group: true,
//   admin: true,
//   param: functions.needed('number/mentioned/tag')
// })

// TAGADMIN

cmd.on(['tagadmin', 'admintag'], ['group'], async (msg, {
  client, groupData, query
}) => {
  let groupAdmins = msg.groupData.participants.filter(tr => tr.admin).map(tr => tr.id)
  let teks = `Pesan : ${query == "undefined" ? " " : "Pesan : " + query}\n\n`
  let mentionText = groupAdmins.map((tr, num) => `${num} : @${tr.split('@')[0]}`).join('\n')
  teks = teks + mentionText
  client.sendMessage(msg.from, { text: teks, mentions: groupAdmins })
}, {
  group: true,
  admin: true,
  param: functions.needed('query')
})
// HIDETAG
cmd.on(['hidetag',
  'tagall'],
  ['group'],
  async (msg, {
    client,
    query, command
  }) => {
    if (!query && !msg.isMedia && !msg.quotedMsg) return client.reply(msg, "Tag Pesan, Kirim Pesan Media, Atau Masukan Teks Yang Akan Di Hidetag/Tagall");
    let tagresp = command.toLowerCase() == "hidetag" ? '' : '\n' + (msg.groupData.participants.map(tr => '- @' + tr.id.split('@')[0] + '\n').join('').trim())
    let participants = msg.groupData.participants.map(tr => tr && tr.id);
    if (msg.isMedia) {
      let body = msg.message
      body[msg.type].caption = body[msg.type].caption + tagresp
      body[msg.type].contextInfo = {}
      body[msg.type].contextInfo.mentionedJid = participants;
      return await client.sendMessageFromContent(msg, body)
    } else if (query) {
      return await client.reply(msg, {
        text: query + tagresp, mentions: participants
      })
    } else if (msg.quotedMsg) {
      let body = msg.quotedMsg
      body = typeof body.message[msg.quotedMsg.type] == 'string' ? {
        extendedTextMessage: {
          text: body.string + tagresp
        }
      } : body
      body.message[msg.quotedMsg.type].contextInfo = {}
      body.message[msg.quotedMsg.type].contextInfo.mentionedJid = participants;
      return await client.sendMessageFromContent(msg, body.message)
    }
  },
  {
    group: true,
    admin: true,
    param: "<tagpesan|pesan>"
  })
// LINKGC 
cmd.on(['linkgc', 'linkgroup', 'linkgrup'], ['group'], async (msg, {
  client, groupData, query
}) => {
  if (!msg.from.includes("@g.us")) return client.reply(msg, `${linkgcme}`)
  let link = await client.groupInviteCode(msg.from)
  let link2 = "https://chat.whatsapp.com/" + link
  client.sendButton(msg, { text: `Link Group ${msg.groupData.subject}`, footer: config.botname }, [{ url: "Click To Copy", value: "https://www.whatsapp.com/otp/copy/" + link2, index: 1 }])
}, {
})
cmd.on(['mute', 'unmute'], ['group'], async (msg, {
  client, command, groupData, query
}) => {
  if (command == "mute") {
    database.mute.push(msg.from)
    client.reply(msg, `sucess mute in gc ${msg.groupData.subject}`)
  }
  if (command == "unmute") {
    database.unmute.splice(msg.from)
    client.reply(msg, `sucess .unmute in gc ${msg.groupData.subject}`)
  }
}, {
  group: true,
  admin: true,
})

cmd.on(['autostick', 'autosticker'], ['group'], async (msg, {
  client, command, groupData, query
}) => {
  if (!query) {
    await client.sendButton(msg, { text: "Select On or Off? | Pilih Hidup atau Mati?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "On", value: ".autostick on" }, { reply: "Off", value: ".autostick off" }])
  }
  if (query.endsWith('hidup') || query.endsWith('on')) {
    if (database.autosticker.includes(msg.groupData.id)) return client.reply(msg, { text: `sepertinya auto sticker sudah aktif sebelumnya` })
    database.autosticker.push(msg.groupData.id)
    // fs.writeFileSync('./src/json/antilink.json', JSON.stringify(database.autosticker))
    return client.reply(msg, `Auto Sticker Di Group *${msg.groupData.subject}* Telah di Hidupkan Oleh Admin Group`)
  }
  if (query.endsWith('mati') || query.endsWith('off')) {
    database.autosticker.splice(msg.groupData.id)
    // fs.writeFileSync('./src/json/antilink.json', JSON.stringify(database.autosticker))
    return client.reply(msg, `Auto Sticker Di Group *${msg.groupData.subject}* Telah di Matikan Oleh Admin Group`)
  }
}, {
  group: true,
  admin: true,
})
// TAGALL
cmd.on(['tagall', 'tag', 'alltag'], ['group'], async (msg, {
  client, groupData, query
}) => {
  let tag = msg.groupData.participants
  let teks = `\n*All Member : ${tag.length}*\n` + `${query == "undefined" ? " " : "Pesan : " + query}` + '\n\n'
  for (let a of tag) {
    teks += `➛ @${a.id.split('@')[0]}\n`
  }
  client.reply(msg, { text: teks, mentions: tag.map(i => i.id) })
}, {
  group: true,
  admin: true,
  param: functions.needed('query')
})
cmd.on(['welcome', 'leave', 'setwelcome', 'setleave'], ['group'], async (msg, {
  client, groupData, query, command
}) => {
  if (command == "welcome") {
    if (!query) {
      await client.sendButton(msg, { text: "Select On or Off? | Pilih Hidup atau Mati?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "On", value: ".welcome on" }, { reply: "Off", value: ".welcome off" }])
    }
    if (query.endsWith('mati') || query.endsWith('off')) {
      if (database.welcome.includes(msg.groupData.id)) return client.reply(msg, { text: `sepertinya welcome sudah dimatikan sebelumnya` })
      database.welcome.push(msg.groupData.id)
      fs.writeFileSync('./src/json/welcome.json', JSON.stringify(database.welcome))
      return client.reply(msg, `Welcome Di Group *${msg.groupData.subject}* Telah di Matikan Oleh Admin Group`)
    }
    if (query.endsWith('hidup') || query.endsWith('on')) {
      database.welcome.splice(msg.groupData.id)
      fs.writeFileSync('./src/json/welcome.json', JSON.stringify(database.welcome))
      return client.reply(msg, `Welcome Di Group *${msg.groupData.subject}* Telah di Hidupkan Oleh Admin Group`)
    }
  }
  if (command == "leave") {
    if (!query) {
      await client.sendButton(msg, { text: "Select On or Off? | Pilih Hidup atau Mati?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "On", value: ".leave on" }, { reply: "Off", value: ".leave off" }])
    }
    if (query.endsWith('mati') || query.endsWith('off')) {
      if (database.leave.includes(msg.groupData.id)) return client.reply(msg, { text: `sepertinya leave sudah dimatikan sebelumnya` })
      database.leave.push(msg.groupData.id)
      fs.writeFileSync('./src/json/leave.json', JSON.stringify(database.leave))
      return client.reply(msg, `Leave Di Group *${msg.groupData.subject}* Telah di Matikan Oleh Admin Group`)
    }
    if (query.endsWith('hidup') || query.endsWith('on')) {
      database.leave.splice(msg.groupData.id)
      fs.writeFileSync('./src/json/leave.json', JSON.stringify(database.leave))
      return client.reply(msg, `Leave Di Group *${msg.groupData.subject}* Telah di Hidupkan Oleh Admin Group`)
    }
  }
  if (command == "setwelcome") {
    if (!query) {
      await client.reply(msg, `Untuk menggunakan masukan query teks yang mau di ganti\n\n*NOTE*: kata %tag (untuk tag member), kata %group (untuk nama group)`)
    } else {
      const reader = fs.readdirSync(`./lib/database/setwelcome/`);
      if (reader.includes(msg.from + ".json")) {
        let db_welcome = JSON.parse(fs.readFileSync(`./lib/database/setwelcome/${msg.from}.json`));
        client.reply(msg.from, { text: `Warn!! Welcome sudah di edit sebelumnya oleh @${db_welcome.number.split("@")[0]}\nTeks: ${db_welcome.data.text}\nDan akan di set ulang menjadi\n${query}`, mentions: [db_welcome.number] })
        const objekwelcome = {
          status: true,
          group: msg.from,
          number: msg.sender.jid,
          data: {
            title: "Hai New Members 👋",
            body: `Saya MechaBot Selamat Datang Di %group`,
            text: query
          }
        };
        fs.writeFileSync(`./lib/database/setwelcome/${msg.from}.json`, JSON.stringify(objekwelcome, null, 2));
      } else {
        const objekwelcome = {
          status: true,
          group: msg.from,
          number: msg.sender.jid,
          data: {
            title: "Hai New Members 👋",
            body: `Saya MechaBot Selamat Datang Di %group`,
            text: query
          }
        };
        fs.writeFileSync(`./lib/database/setwelcome/${msg.from}.json`, JSON.stringify(objekwelcome, null, 2));
      }
    }
    if (query == "%default") {
      fs.unlinkSync(`./lib/database/setwelcome/${msg.from}.json`);
      client.reply(msg, `Sukses disetel default`)
    }
  }
  if (command == "setleave") {
    if (!query) {
      await client.reply(msg, `Untuk menggunakan masukan query teks yang mau di ganti\n NOTE: kata %tag (untuk tag member), kata %group (untuk nama group)`)
    }

    if (query == "%default") {
      fs.unlinkSync(`./lib/database/setwelcome/${msg.from}.json`);
      client.reply(msg, `Sukses disetel default`)
    }
  }
}, {
  group: true,
  admin: true,
  param: functions.needed('query'),
  sensitive: true
})

// CLOSE / OPEN
cmd.on(['grup', 'group'], ['group'], async (msg, {
  client, groupData, query
}) => {
  if (!query) {
    await client.sendButton(msg, { text: "Select Open or Close? | Pilih Buka atau Tutup?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "Open", value: ".group buka" }, { reply: "Closed", value: ".group tutup" }])
  }

  if (query.endsWith('buka') || query.endsWith('open')) {
    client.groupSettingUpdate(msg.from, 'not_announcement')
    client.reply(msg, `${msg.groupData.subject} Telah di Buka Oleh Admin Group`)
  }
  if (query.endsWith('tutup') || query.endsWith('close')) {
    client.groupSettingUpdate(msg.from, 'announcement')
    client.reply(msg, `${msg.groupData.subject} Telah di Tutup Oleh Admin Group`)
  }
}, {
  group: true,
  admin: true,
  // query: "Select Open or Close? | Pilih Buka atau Tutup?",
  param: functions.needed('query'),
  sensitive: true
})

cmd.on(['antilink', 'antilinkgc', 'antilinkgroup', 'antibot', 'nobot', 'antivo', 'antiviewonce'], ['group'], async (msg, {
  client, groupData, query, command
}) => {
  if (command == "antilink" || command == "antilinkgc" || command == "antilinkgroup") {
    let antilink = require("../../src/json/antilink.json")
    if (!query) {
      await client.sendButton(msg, { text: "Select On or Off? | Pilih Hidup atau Mati?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "On", value: ".Antilink on" }, { reply: "Off", value: ".Antilink off" }])
    }
    if (query.endsWith('hidup') || query.endsWith('on')) {
      if (antilink.includes(msg.groupData.id)) return client.reply(msg, { text: `sepertinya antilink sudah aktif sebelumnya` })
      antilink.push(msg.groupData.id)
      fs.writeFileSync('./src/json/antilink.json', JSON.stringify(antilink))
      return client.reply(msg, `Anti Link Di Group *${msg.groupData.subject}* Telah di Hidupkan Oleh Admin Group`)
    }
    if (query.endsWith('mati') || query.endsWith('off')) {
      antilink.splice(msg.groupData.id)
      fs.writeFileSync('./src/json/antilink.json', JSON.stringify(antilink))
      return client.reply(msg, `Anti Link Di Group *${msg.groupData.subject}* Telah di Matikan Oleh Admin Group`)
    }
  }

  if (command == "antibot" || command == "nobot") {
    let antibot = require("../../src/json/nobot.json")
    if (!query) {
      await client.sendButton(msg, { text: "Select On or Off? | Pilih Hidup atau Mati?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "On", value: ".Antibot on" }, { reply: "Off", value: ".Antibot off" }])
    }
    if (query.endsWith('hidup') || query.endsWith('on')) {
      if (antibot.includes(msg.groupData.id)) return client.reply(msg, { text: `sepertinya antibot sudah aktif sebelumnya` })
      antibot.push(msg.groupData.id)
      fs.writeFileSync('./src/json/nobot.json', JSON.stringify(antibot))
      return client.reply(msg, `Anti Bot Di Group *${msg.groupData.subject}* Telah di Hidupkan Oleh Admin Group`)
    }
    if (query.endsWith('mati') || query.endsWith('off')) {
      antibot.splice(msg.groupData.id)
      fs.writeFileSync('./src/json/nobot.json', JSON.stringify(antibot))
      return client.reply(msg, `Anti Bot Di Group *${msg.groupData.subject}* Telah di Matikan Oleh Admin Group`)
    }
  }
  if (command == "antivo" || command == "antiviewonce") {
    let antivon = require("../../src/json/antivo.json")
    if (!query) {
      await client.sendButton(msg, { text: "Select On or Off? | Pilih Hidup atau Mati?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "On", value: ".antivo on" }, { reply: "Off", value: ".antivo off" }])
    }
    if (query.endsWith('hidup') || query.endsWith('on')) {
      if (antivon.includes(msg.groupData.id)) return client.reply(msg, { text: `sepertinya antivo sudah aktif sebelumnya` })
      antivon.push(msg.groupData.id)
      fs.writeFileSync('./src/json/antivo.json', JSON.stringify(antivon))
      return client.reply(msg, `Anti ViewOnce Di Group *${msg.groupData.subject}* Telah di Hidupkan Oleh Admin Group`)
    }
    if (query.endsWith('mati') || query.endsWith('off')) {
      antivon.splice(msg.groupData.id)
      fs.writeFileSync('./src/json/antivo.json', JSON.stringify(antivon))
      return client.reply(msg, `Anti ViewOnce Di Group *${msg.groupData.subject}* Telah di Matikan Oleh Admin Group`)
    }
  }
}, {
  group: true,
  admin: true,
  param: functions.needed('query'),
  sensitive: true
})

cmd.on(["autoresetlink"],
  ['group'],
  async (msg, {
    query, command
  }) => {
    let type = query.toLowerCase().includes("on") ? 1 : query.toLowerCase().includes("off") ? 2 : 0
    database[msg.from].activated = database[msg.from].activated || {}
    let data = command.toLowerCase()
    switch (type + "") {
      case "1":
        if (database[msg.from].activated[data]) return await client.reply(msg, `Telah Aktif Sebelumnya`)
        database[msg.from].activated[data] = true
        await client.reply(msg, `Sukses Mengaktifkan`)
        break;
      case "2":
        if (!database[msg.from].activated[data]) return await client.reply(msg, `Telah Nonaktif Sebelumnya`)
        database[msg.from].activated[data] = false
        await client.reply(msg, `Sukses Mengnonaktifkan`)
        break;
      default:
        await client.reply(msg, `Example: ${prefix}autoresetlink on`)
    }
  },
  {
    group: "Hanya Di Grub",
    admin: true,
    clientAdmin: "Bot Harus Admin",
    query: `Example: ${prefix}autoresetlink on`,
    param: `<on|off>`
  })

setInterval(async function () {
  if (functions.parseDate('HH') == "23" || functions.parseDate('HH') == "11") {
    let loop = functions.fs.readdirSync("./database/").forEach(async tr => {
      tr = tr.replace(".json", "").trim()
      if (database[tr].activated && database[tr].activated.autoresetlink) {
        let checkclient = database[msg.from].participants.find(tr => client.user.id.split(':')[0] + '@s.whatsapp.net' == tr.id)
        if (!checkclient.admin) return await client.reply(tr, `Gagal Mereset Link Group Karena Bukan Admin`);
        await client.groupRevokeInvite(tr);
        await client.reply(tr, `Sukses Mengubah Link Group`)
      }
    })
  }

  let loop = functions.fs.readdirSync("./database/").forEach(async (tr) => {
    tr = tr.replace(".json", "").trim()
    if (database[tr].expiredSewa <= Date.now()) {
      await client.reply(tr, `Sewa Telah Habis, Keluar Group..`)
      await client.groupLeave(tr)
      database[tr].expiredSewa = undefined
    } else if (database[tr] && database[tr].expiredSewa && functions.parseMs(database[tr].expiredSewa - Date.now()).days == 1 && !database[tr].hasReport) {
      database[tr].hasReport = true;
      let groupAdmin = database[tr].participants.filter(tr => tr.admin)
      let teks = `Lapor grub ${database[tr].subject}\nDengan Admin:\n${groupAdmin.map(tr => "@" + tr.id.split('@')[0]).join('\n')}\n\nMasa sewa tinggal 1 hari`
      for (let a of groupAdmin) {
        await client.reply(s.id, {
          text: teks, mentions: groupAdmin.map(tr => tr.id)
        })
      }
    }
  })

}, 60 * 1000)

// cmd.on(['antilink', 'antilinkgc', 'antilinkgroup'], ['group'], async (msg, {
//   client, groupData, query, command
// }) => {
//   let antilink = require("../../src/json/antilink.json")
//   if (!query) {
//     await client.sendButton(msg, { text: "Select On or Off? | Pilih Hidup atau Mati?", footer: config.botname + "\n" + msg.groupData.subject }, [{ reply: "On", value: ".Antibot on" }, { reply: "Off", value: ".Antibot off" }])
//   }
//   if (query.endsWith('hidup') || query.endsWith('on')) {
//     if (antilink.includes(msg.groupData.id)) return client.reply(msg, { text: `sepertinya antilink sudah aktif sebelumnya` })
//     antilink.push(msg.groupData.id)
//     fs.writeFileSync('./src/json/antilink.json', JSON.stringify(antilink))
//     return client.reply(msg, `Anti Link Di Group *${msg.groupData.subject}* Telah di Hidupkan Oleh Admin Group`)
//   }
//   if (query.endsWith('mati') || query.endsWith('off')) {
//     antilink.splice(msg.groupData.id)
//     fs.writeFileSync('./src/json/antilink.json', JSON.stringify(antilink))
//     return client.reply(msg, `Anti Link Di Group *${msg.groupData.subject}* Telah di Matikan Oleh Admin Group`)
//   }
// }, {
//   group: true,
//   admin: true,
//   param: functions.needed('query'),
//   sensitive: true
// })