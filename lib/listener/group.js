process.on("uncaughtException", console.log);
global.response = {
  demote: {
    title: "Kasian Diturunkan Jabatannya🥺",
    body: `%group`,
    text: `「 Demote Admin 」
ID: %tag
Telah Diturunkan Jabatan Menjadi Member ( demote )`
  },
  promote: {
    title: "Anda Naik Pangkat Jabatan🥳",
    body: `%group`,
    text: `「 Promote Member 」
ID: %tag
Telah Dinaikan Jabatan Menjadi Admin ( Promote )`
  },
  add: {
    title: "Hai New Members 👋",
    body: `Selamat Datang Di %group`,
    text: `「 New Member 」
Haii Selamat Datang Saya MechaBot 👋
Bot Whatsapp Multi Fungsi Yang Siap Membantu Anda Kapanpun Dan dimanapun. Mweheheh
Salam Kenal %tag`
  },
  remove: {
    title: "Good Bye Beban 👋",
    body: `Sampai Jumpa dari grup %group`,
    text: `「 Out Member 」
Sayonara Teman, Semoga Bertemu lagi digroup yang sama👋
Member Magang
Jumpa Lagi %tag`
  }
};

client.ev.on('group-participants.update', async (msg) => {
  if (!database[msg.id]) database[msg.id] = {};
  if (!client.chats[msg.id]) client.chats[msg.id] = {};
  let metadata = await client.groupMetadata(msg.id)
  metadata.desc = metadata.desc.toString() || "-"
  for (let a in metadata) {
    database[msg.id][a] = metadata[a]
    client.chats[msg.id][a] = metadata[a]
  }
  try {
    msg.participants.forEach(async participant => {
      // if (msg.action == "remove" && database[msg.from].leave) return
      // if (database[msg.from].welcome) return
      let ppuser = await client.profilePictureUrl(participant, 'image').catch(a => `https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg`);
      let result1 = response[msg.action].text;
      let result2 = response[msg.action].body;


      if (msg.action == "add" && !Object.keys(database[msg.from].setwelcome).length != 0) {
        // let db_welcome = JSON.parse(database[msg.from].setwelcome);
        client.sendAdReply(msg.id, {
          text: `
  ${database[msg.from].setwelcome.data.text.replace(/(\%tag)/gi, "@" + participant.split('@')[0]).replace(/(\%group)/gi, metadata.subject)}`, mentions: [participant]
        }, { title: database[msg.from].setwelcome.data.title, body: database[msg.from].setwelcome.data.body.replace(/(\%group)/gi, metadata.subject), thumbnail: ppuser, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      }
      if (msg.action == "add" && database[msg.from].welcome) {
        result = result1.replace(/(\%tag)/gi, "@" + participant.split('@')[0]);
        body = result2.replace(/(\%group)/gi, metadata.subject);
        // if(database[msg.from].welcome.includes(msg.from)) return
        client.sendAdReply(msg.id, {
          text: `
${result}`, mentions: [participant]
        }, { title: response[msg.action].title, body: body, thumbnail: ppuser, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      }

      if (msg.action == "remove" && !Object.keys(database[msg.from].setleave).length != 0) {
        // let db_welcome = JSON.parse(database[msg.from].setleave);
        client.sendAdReply(msg.id, {
          text: `
  ${database[msg.from].setleave.data.text.replace(/(\%tag)/gi, "@" + participant.split('@')[0]).replace(/(\%group)/gi, metadata.subject)}`, mentions: [participant]
        }, { title: database[msg.from].setleave.data.title, body: database[msg.from].setleave.data.body.replace(/(\%group)/gi, metadata.subject), thumbnail: ppuser, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      }
      if (msg.action == "remove" && database[msg.from].leave) {
        result = result1.replace(/(\%tag)/gi, "@" + participant.split('@')[0]);
        body = result2.replace(/(\%group)/gi, metadata.subject);
        // if(database[msg.from].welcome.includes(msg.from)) return
        client.sendAdReply(msg.id, {
          text: `
${result}`, mentions: [participant]
        }, { title: response[msg.action].title, body: body, thumbnail: ppuser, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});


client.ev.on('groups.update', async msg => {
  //console.log(pea)
  if (!database[msg.id]) database[msg.id] = {};
  if (!client.chats[msg.id]) client.chats[msg.id] = {};
  let metadata = await client.groupMetadata(msg.id)
  metadata.desc = metadata.desc.toString() || "-"
  for (let a in metadata) {
    database[msg.id][a] = metadata[a]
    client.chats[msg.id][a] = metadata[a]
  }
  try {
    for (let tr of msg) {
      // Get Profile Picture Group
      try {
        ppgc = await client.profilePictureUrl(tr.id, 'image')
      } catch {
        ppgc = 'https://tinyurl.com/yx93l6da'
      }
      let img = ppgc
      if (tr.announce == true) {
        client.sendAdReply(tr.id, { text: `「 Group Settings Change 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !` }, { title: `Group Settings Change Message`, body: `${tr.subject}`, thumbnail: img, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      } else if (tr.announce == false) {
        client.sendAdReply(tr.id, { text: `「 Group Settings Change 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !` }, { title: `Group Settings Change Message`, body: `${tr.subject}`, thumbnail: img, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      } else if (tr.restrict == true) {
        client.sendAdReply(tr.id, { text: `「 Group Settings Change 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !` }, { title: `Group Settings Change Message`, body: `${tr.subject}`, thumbnail: img, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      } else if (tr.restrict == false) {
        client.sendAdReply(tr.id, { text: `「 Group Settings Change 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !` }, { title: `Group Settings Change Message`, body: `${tr.subject}`, thumbnail: img, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      } else {
        client.sendAdReply(tr.id, { text: `「 Group Settings Change 」\n\nGroup Subject telah diganti menjadi *${tr.subject}*` }, { title: `Group Settings Change Message`, body: `${tr.subject}`, thumbnail: img, mediaType: 2, mediaUrl: "https://www.instagram.com/sgt_prstyo/", sourceUrl: "https://www.instagram.com/sgt_prstyo/" });
      }
    }
  } catch (err) {
    console.log(err)
  }
})

// client.ev.on('groups.update', async (msg) => {
//   if (!database[msg.id]) database[msg.id] = {};
//   if (!client.chats[msg.id]) client.chats[msg.id] = {};
//   let metadata = await client.groupMetadata(msg.id)
//   metadata.desc = metadata.desc.toString()
//   for (let a in metadata) {
//     database[msg.id][a] = metadata[a]
//     client.chats[msg.id] = metadata[a]
//   }
// })

// client.ev.on('group-participants.update', async (msg) => {
//   if (!database[msg.id]) database[msg.id] = {};
//   if (!client.chats[msg.id]) client.chats[msg.id] = {};
//   let metadata = await client.groupMetadata(msg.id)
//   metadata.desc = metadata.desc.toString()
//   for (let a in metadata) {
//     database[msg.id][a] = metadata[a]
//     client.chats[msg.id] = metadata[a]
//   }
// })
