process.on("uncaughtException", console.log);
cmd.on(['>'], [], async (msg, {
  client, command, text
}) => {
  // let parse = command.includes('=>') ? text.replace('=>', 'return '): text.replace('>', '')
  let parse = text.replace('>', '');
  if (text.includes("return") || text.includes("await") || text.includes("let") || text.includes("var") || text.includes("const")) {
    try {
      let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => {
        return e
      });
      return client.reply(msg, functions.util.format(evaluate));
    } catch (e) {
      return client.reply(msg, functions.util.format(e));
    }
  }
  try {
    let evaluate = await eval(`;(async () => { return ${parse} })()`).catch(e => {
      return e
    });
    return client.reply(msg, functions.util.format(evaluate));
  } catch (e) {
    return client.reply(msg, functions.util.format(e));
  }
}, {
  owner: '--noresp', prefix: false
})

cmd.on(['!>'], [], async (msg, {
  client, command, text
}) => {
  let parse = command.includes('=>') ? text.replace('=>', 'return ') : text.replace('!>', '')
  try {
    let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => {
      return e
    });
    return client.reply(msg, functions.util.format(evaluate));
  } catch (e) {
    return client.reply(msg, functions.util.format(e));
  }
}, {
  owner: '--noresp', prefix: false
})


cmd.on(['$'], [], async (msg, {
  query, client
}) => {
  try {
    functions.exec(`${query}`, (err, out) => {
      if (err) return client.reply(msg, functions.util.format(err));
      client.reply(msg, functions.util.format(out));
    });
  } catch (e) {
    return client.reply(msg,
      functions.util.format(e));
  }
}, {
  owner: '--noresp', prefix: false
})
cmd.on(["shutdown", 'reset'], [], async (msg, {
  client,
  command
}) => {
  let resp = command[0].toUpperCase() + command.slice(1).toLowerCase() + " Bot..."
  await client.reply(msg,
    resp)
  let update = Object.keys(database).forEach(tr => {
    if (tr == 'session') return;
    functions.fs.writeFileSync('./src/json/' + tr + '.json', JSON.stringify(database[tr]));
  });
  if (command.toLowerCase() == 'shutdown') {
    global.shutoff = true
  }
  await session.saveCreds(...lastargs);
  await client.end(resp)
}, {
  owner: "--noresp"
})

cmd.on(['block', 'unblock'], [], async (msg, {
  client,
  command
}) => {
  let users = msg.groupData ? msg.quotedMsg ? msg.quotedMsg.sender.jid : query + '@s.whatsapp.net' : msg.sender.jid
  if (command == "block") {
    await client.updateBlockStatus(users, 'block').then((res) => client.reply(msg, `Sukses Block Chats`)).catch((err) => client.reply(msg, `Terjadi Kesalahan\n\n${err}`))
  }
  if (command == "unblock") {
    await client.updateBlockStatus(users, 'unblock').then((res) => client.reply(msg, `Sukses UnBlock Chats`)).catch((err) => client.reply(msg, `Terjadi Kesalahan\n\n${err}`))
  }
}, {
  owner: "--noresp"
})

cmd.on(['addlimit', 'dellimit', 'addprem', 'delprem'], [], async (msg, { client, query, command, mentionedJid }) => {
  let type = command.toLowerCase().startsWith('add') ? "add" : "del"
  let mode = command.toLowerCase().replace(type, '').trim()
  if ((!query.includes('|') && mode != "prem" && type != "del") || mentionedJid.length == 0) return await client.replt(msg, `Format Salah, Contoh !addlimit @Prassz|10`)

  let jumlah = query.includes('|') ? Number(query.split('|')[1].trim()) : Infinity
  if (!client.chats[msg.mentionedJid[0]]) client.chats[msg.mentionedJid[0]] = {};
  switch (type) {
    case "add":
      client.chats[msg.mentionedJid[0]].limit += jumlah
      break;
    case "del":
      if (mode == "prem") {
        client.chats[msg.mentionedJid[0]].limit = 25
      } else {
        client.chats[msg.mentionedJid[0]].limit -= jumlah
      }
      break;
  }
  return await client.reply(msg, `Sukses Meng${type} Limit`)
}, {
  query: "masukan berapa limit yang ingin di tambahkan, dan tag orang yang ingin di add limit"
})

cmd.on(['debugg'], [], async (msg, { client, query, text }) => {
  let target = query.split("|")[0]
  let pesan = query.split("|")[1]
  let repeat = query.split("|")[2]
  // target = target.split('').filter(tr => Number(tr)).join('').trim() + "@s.whatsapp.net"
  await client.sendMessage(`${target}@g.us`, { text: pesan })

  for (let i = 0; i < repeat; i++) {
    await client.sendButton(`${target}@g.us`, {
      document: Buffer.alloc(0),
      mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      fileName: 'SqueezedOrange',
      url: "wa.me/6283862323152",
      caption: "Cih Elit",
      footer: "Mendokusai"
    },
      [{ url: "Gaterima? chat Gw Sini", value: "https://www.whatsapp.com/otp/copy/wa.me/6283862323152" }, { url: "ni no wa nya", value: "wa.me/6283862323152" }, { call: "Nomer Gueh", value: "+6283862323152" }])
  }
  client.reply(msg, "sukses")
}, {
  owner: '--noresp',
  query: "Hahaha",
  param: functions.needed('query')
})

cmd.on(['debug'], [], async (msg, { client, query, text }) => {
  try {
    let num = query.split("|")[0]
    let pesan = query.split("|")[1]
    let repeat = query.split("|")[2]
    target = num + "@s.whatsapp.net"
    await client.sendMessage(target, { text: pesan })

    for (let i = 0; i < repeat; i++) {
      await client.sendButton(target, {
        document: Buffer.alloc(0),
        mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        fileName: 'SqueezedOrange',
        url: "wa.me/6283862323152",
        caption: "Cih Elit",
        footer: "Mendokusai"
      },
        [{ url: "Gaterima? chat Gw Sini", value: "https://www.whatsapp.com/otp/copy/wa.me/6283862323152" }, { url: "ni no wa nya", value: "wa.me/6283862323152" }, { call: "Nomer Gueh", value: "+6283862323152" }])
    }
    client.reply(msg, "sukses")
  } catch (e) {
    return client.reply(msg, functions.util.format(e));
  }
}, {
  owner: '--noresp',
  query: "Hahaha",
  param: functions.needed('query')
})

cmd.on(["addowner", "delowner"], ['owner'], async (msg, {
  mentionedJid,
  prefix,
  quotedMsg,
  command
}) => {
  if (mentionedJid.length == 0 && !quotedMsg) return client.reply(msg, {
    text: `Tag Orang Yang Ingin Di Jadikan Owner, Contoh ${prefix}addowner @tagorang`
  })
  mentionedJid = mentionedJid.length == 0 ? [quotedMsg.sender.jid] : mentionedJid
  let loop = mentionedJid.forEach(async (tr) => {
    let num = tr.split('@')[0]

    if (command.includes('del')) {
      if (!config.ownerNumber.includes(num)) return await client.reply(msg, {
        text: `Gagal Memasukan @${num} Sebagai Owner Karena Tidak ada Owner Dengan Nomor Itu`, mentions: [tr]
      })
      config.ownerNumber = config.ownerNumber.filter(a => a !== num)
      return await await client.reply(msg, {
        text: `Berhasil Menghapus @${num} Sebagai Owner`, mentions: [tr]
      })
    } else {
      if (config.ownerNumber.includes(num)) return await client.reply(msg, {
        text: `Gagal Memasukan @${num} Sebagai Owner Karena Telah Owner Sebelumnya`, mentions: [tr]
      })
      config.ownerNumber.push(num)
      return await client.reply(msg, {
        text: `Berhasil Memasukan @${num} Sebagai Owner`, mentions: [tr]
      })
    }
  })
  functions.fs.writeFileSync('./config.json',
    JSON.stringify(config, null, 2))
}, {
  owner: "Perintah Khusus Owner", group: "Hanya Bisa Di Lakukan Di Grup"
})

database.note = {}
cmd.on(['addnote', 'delnote', 'updatenote', 'note'], ['owner', 'info'], async (msg, {
  command,
  client,
  query,
  prefix
}) => {
  let type = command.toLowerCase().replace('note',
    '').trim()
  let split = query.split(',')
  let value = database.note[split[0].trim()]
  if (!type) {
    if (!value) {
      if (query) await client.reply(msg, `Note Berjudul ${split[0].trim()} Tidak Ada Dalam Database`)
      let list = Object.keys(database.note).map(tr => {
        return {
          title: `Judul: ${tr}`, value: `${prefix}note ${tr}`
        }
      })
      if (list.length == 0) return client.reply(msg, `Tidak ada Note Di Dalam Database`)
      list[0].head = `List Note`
      return await client.sendButton(msg.from, {
        text: `Menampilkan List Note"`, footer: `Jumlah: ${list.length}`
      }, list)
    } else {
      return await client.reply(msg, {
        text: value
      })
    }
  } else {
    let judul = split[0].trim()
    if (type != 'del' && !split[1]) return await client.reply(msg, {
      text: `Masukan Isi, Contoh ${prefix}note ini judul, ini isi`
    })
    let isi = split.slice(1).join(',').trim()
    switch (type) {
      case "add":
        if (value) return await client.reply(msg, {
          text: `Note Telah Ada Sebelumnya`
        })
        database.note[judul] = isi.trim()
        break;
      case "update":
        if (!value) return await client.reply(msg, {
          text: `Note Tidak Dapat Diubah Karena Tidak Ada Sebelumnya`
        })
        database.note[judul] = isi.trim()
        break;
      case "del":
        if (!value) return await client.reply(msg, {
          text: `Note Tidak Dapat Dihapus Karena Tidak Ada Sebelumnya`
        })
        delete database.note[judul];
        break;
    }
    let update = Object.keys(database).forEach(tr => {
      if (tr == 'session') return;
      functions.fs.writeFileSync('./src/json/' + tr + '.json', JSON.stringify(database[tr]));
    });
    return await client.reply(msg,
      `Sukses Meng${type == 'del' ? 'hapus' : type} Note`)
  }
}, {
  param: "<judul,isi>",
  owner: "Cuma Khusus Owner"
})

// const {
//   Configuration, OpenAIApi
// } = require("openai");
// const configuration = new Configuration({
//   apiKey: "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",
// });
// global.openai = new OpenAIApi(configuration);
// global.chatbot = {}

cmd.on(['mechabot', 'chatbot'], ['general'], async (msg, {
  client
}) => {
  if (chatbot[msg.from]) {
    delete chatbot[msg.from];
    return await client.reply(msg, {
      text: `Menghapus Sesi Ai Chat Bot...`
    })
  }
  chatbot[msg.from] = [`Ai: Hari Ini : ${functions.parseDate("LLLL")}`, "Ai: Aku Adalah bot Whatsapp yang bernama MechaBot Yang Di Ciptakan Jeruk Peras, Gyn dan Team!", "Ai: Cara Menggunakan MechaBot Adalah Ketik Menggunakan awalan prefix dan dilanjutkan command tanpa sepasi contoh !menu", "Ai: Anggota tim pembuat mechabot adalah Pras, Galang dan Najmy dan suport yang terdiri dari Lucia, Niel, Dixxy dan desta", "Ai: Cara menambahkan MechaBot ke group adalah dengan cara sewa, info lanjut hubungi Owner no: 083862323152 / wa.me/6283862323152", `group whatsapp MechaBot: ${linkgcme}`]
  await client.reply(msg, {
    text: `Halo! Sesi Chat Kamu Dimulai, Coba Perkenalkan Dirimu! ${msg.isGroup ? "Jika Kamu Ingin MechaBot Merespon, Tag Pesan Bot!" : ""}`
  })
})

// cmd.on([""], [], async (msg, {
//   query, quotedMsg
// }) => {
//   if (msg.isGroup && (!quotedMsg || quotedMsg.sender.jid)) return;
//   if (!chatbot[msg.sender.jid]) return;
//   chatbot[msg.sender.jid].push(`Human: ${query}`)
//   chatbot[msg.sender.jid].push(`Ai:`)
//   let resp = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: chatbot[msg.sender.jid].join('\n'),
//     temperature: 0.9,
//     max_tokens: 2400,
//     top_p: 1,
//     stop: ["Ai:", "Human:"],
//     frequency_penalty: 0,
//     presence_penalty: 0,
//   })
//   let text = resp.data.choices[0].text.trim()
//   if (!text) text = functions.randomize(["Aku Tidak Tau", "Kurang Tau", "Nanti Saya Belajar Lagi!", "Maaf Saya Tida Tau"])
//   await client.reply(msg, {
//     text
//   })
//   chatbot[msg.sender.jid][chatbot[msg.sender.jid].length - 1] = "Ai: " + text
// }, {
//   prefix: false
// })

cmd.on(["join"], [], async (msg, {
  quotedMsg, query
}) => {
  // let id = msg.quotedMsg.strig.split(`chat.whatsapp.com/`)
  let result = quotedMsg ? quotedMsg.string.split('https://chat.whatsapp.com/')[1] : query.split('https://chat.whatsapp.com/')[1]
  return await client.groupAcceptInvite(result).then((res) => client.reply(msg, `${res}`)).catch((err) => client.reply(`${err}`))
}, {
  owner: '--noresp'
})