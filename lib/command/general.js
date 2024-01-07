process.on("uncaughtException", console.log);
const os = require('os')
const speed = require('performance-now');
const { config } = require('process');

let { list, body, upper, down, line, head, wings, priority } = config.unicode;


cmd.on(["menu", "help", "??"], ["general"], async (msg, { client, prefix, query }) => {
    // global.linkgc = 'gada'
    let type = query && query.toLowerCase();
    let lama = [];
    if (!cmd.tags[type]) {
        let list_now = 0;
        let list_nitip = {};
        for (let b in cmd.tags) {
            list_nitip[b] = prefix + `menu${b}`;
            list_now++;
        }
        let text1 = `${functions.parseResult(list_nitip, { body: `${list} %value` })}`;
        const fakstu = functions.fs.readFileSync('./lib/random/katabijax.txt', 'utf-8').split('\n').map((v) => v.replace('\r', ''))

        return client.sendAdReply1(msg, {text: `Hai ${msg.pushName}👋, Saya adalah Mecha-Bot\n\n _${fakstu[Math.floor(Math.random() * fakstu.length + 1)].replace(0, -1)}_\n\n Berikut Adalah Group Menu\nUntuk menampilkan semua menu ketik Allmenu\n` + text1}, {title: "MechaBot", body: "Since2020", thumbnail: config.mecha_image, mediaType:1, mediaUrl: "https://instagram.com/sgt_prstyo", sourceUrl: "https://instagram.com/sgt_prstyo"})
        // let resize = await client.reSize(config.mecha_image, 370, 159)
        // return client.sendButton(msg, {
        //     document: Buffer.alloc(10),
        //     mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        //     fileName: 'Mecha Bot',
        //     jpegThumbnail: resize,
        //     pageCount: 1,
        //     fileLength: 1,
        //     caption: `Hai ${msg.pushName}👋, Saya adalah Mecha-Bot\n\n _${fakstu[Math.floor(Math.random() * fakstu.length + 1)].replace(0, -1)}_\n\n Berikut Adalah Group Menu\nUntuk menampilkan semua menu ketik Allmenu\n` + text1,
        //     footer: `Bot ini sedang tahap pengembangan, Jikalau ada kesalahan atau error silahkan leporkan kepada owner untuk diperbaiki!\n\n` + config.botname2
        // },
        //     [{ url: "Follow Us Instagram", value: "https://instagram.com/sgt_prstyo" },
        //     { url: "Group Mecha", value: linkgcme },
        //     // { call: "Owner Phone", value: "+6283862323152" },
        //     { reply: "Owner Bot", value: ".owner" },
        //     { reply: "Info & SNK", value: ".snk" },
        //     { reply: "Store", value: ".store" }])
    } else {
        for (let a of cmd.tags[type]) {
            if (!a.enable) continue;
            let prek = a.prefix ? prefix : ''
            let param = a.param ? a.param : ''
            lama = lama.concat(a.command.map(value => prek + value + ` ${param}`))
        }
        let hasil = `${head}${line.repeat(4)}${list} ${type[0].toUpperCase() + type.slice(1).toLowerCase()} Menu\n`;
        for (let a of cmd.tags[type]) {
            hasil += a.command.map(tr =>
                list + ` !${tr} ${a.param ? a.param : ""}`).join('\n') + `\n${line}\n`;
        }
        hasil = hasil.trim() + `\n${head}${line.repeat(2)}${list}`;
        return client.reply(msg, hasil)
    }
})

cmd.on(["allmenu", "menu2", "help"], ["general"], async (msg, { client, prefix }) => {
    if (!global.linkgcme) {
        let v = await client.groupInviteCode('6283836284553-1608991358@g.us')
        global.linkgcme = "https://chat.whatsapp.com/" + v;
    }
    const fakstu = functions.fs.readFileSync('./lib/random/katabijax.txt', 'utf-8').split('\n').map((v) => v.replace('\r', ''))
    let res = Object.keys(cmd.tags).map(tr => {
        let cmds = `${list} ` + prefix + (cmd.tags[tr].map(rt => rt.command.map(pe => pe + ' ' + (rt.param || " ")).join(`\n${list} ` + prefix).trim()).join(`\n${list} ` + prefix).trim())
        return `*${wings[0]}${tr}${wings[1]}*\n${cmds}`
    })
    let total = `*${priority[0]} Mecha Bot ${priority[1]}*\n\nHai ${msg.pushName}👋, Saya adalah Mecha-Bot\n\n_${fakstu[Math.floor(Math.random() * fakstu.length + 1)].replace(0, -1)}_ ${functions.readmore(800)}\n\n` + res.join('\n\n')
    return client.sendAdReply1(msg, {text: total.trim()}, {title: "MechaBot", body: "Since2020", thumbnail: config.mecha_image, mediaType:1, mediaUrl: "https://instagram.com/sgt_prstyo", sourceUrl: "https://instagram.com/sgt_prstyo"})
    // await client.reply(msg, total.trim())
    // client.sendButton(msg, { image: config.mecha_image, caption: total.trim() }, [{ url: "Follow Us Instagram", value: "https://instagram.com/sgt_prstyo" },
    // { url: "Group Mecha", value: linkgcme },
    // // { call: "Owner Phone", value: "+6283862323152" },
    // { reply: "Owner Bot", value: ".owner" },
    // { reply: "Info", value: ".snk" },
    // { reply: "Store", value: ".store" }])
});

cmd.on(['snk', 'info'], ['general'], async (msg, { client }) => {
    let timestamp = speed()
    let latensi = speed() - timestamp
    let text = `
    *[ Info User ]*
*ID*: ${msg.sender.jid}
*User Name*: ${msg.pushName}
*User Number*: ${msg.sender.jid.split("@")[0]}
*Status User*: -

    *[ Info Bot ]*
*🤖 Nama Bot :* *MechaBot-MD* 
*👨🏻‍💻 Creator :* *Squeezed Orange*
*👨🏻‍💻 Number :* @6283862323152
*👬 Total User Online :* *${database.user.length} User*
*🕴 Status Maintenance* : ${config.mainten ? '✅' : '❌'}
*📚 Library :* *Baileys*
*💽 Database :* *MySql*
*💻 Host :* *${os.platform()}*
*⚡ Speed :* ${latensi.toFixed(4)} _Second_ 
*🏻 Ram Usage :* _${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB_ 
*🔌 CPU :* _*${os.cpus()[0].model}*_
    
${msg.isGroup ? `    *[ Info Group ]*
*ID*: ${msg.groupData.id}
*Group Name*: ${msg.groupData.subject}
*Owner*: ${msg.groupData.owner == undefined ? "Tidak Terdeteksi" : "wa.me/" + msg.groupData.owner.split("@")[0]}
*Member*: ${msg.groupData.size}
*Created*: ${functions.parseDate("LLLL", Number(msg.groupData.creation + "000"))}
*Descriptions*: 
${msg.groupData.desc.toString() || msg.groupData.desc}
`: ``}

Owner MechaBot Squeezy    `
    client.reply(msg, { text: text, mentions: ['6283862323152@s.whatsapp.net'] })
})


cmd.on(['store', 'shop', 'sewa', 'buy'], ['general'], async (msg, { client }) => {
    let caption = `
    Berikut Adalah List Produk Mechabot
`
    client.sendButton(msg.from, {
        text: caption, footer: "", buttonText: "> Kilik Disini <"
    },
        [{ title: "Sewa", value: `.sewabot` },
        { title: "Rdp", value: `.rdp` },
        { title: "Premium", value: `.premium` }]);
})

cmd.on(['sewabot', 'rdp', 'premium'], ['general'], async (msg, { client, command }) => {
    if (command == "sewabot") {
        let capt = `
⫹⫺ 𝗦𝗘𝗪𝗔 𝗕𝗢𝗧 ⫹⫺

𝟭. 𝗦𝘁𝗮𝗻𝗱𝗮𝗿𝘁
❏ 𝐑𝐩. 𝟏𝟎,𝟎𝟎𝟎/𝐛𝐮𝐥𝐚𝐧 (𝟏 𝐆𝐫𝐨𝐮𝐩)
❏ 𝐑𝐩. 𝟐𝟓,𝟎𝟎𝟎/𝟑𝐛𝐮𝐥𝐚𝐧 (𝟏 𝐆𝐫𝐨𝐮𝐩)
❏ 𝐑𝐩. 𝟒𝟓,𝟎𝟎𝟎/𝟔𝐛𝐮𝐥𝐚𝐧  (𝟑𝐆𝐫𝐨𝐮𝐩)
❏ 𝐑𝐩. 𝟏𝟎𝟎,𝟎𝟎𝟎/𝐏𝐞𝐫𝐦𝐚 (𝟓 𝐆𝐫𝐨𝐮𝐩)
 

𝗡𝗮𝗺𝗲 𝗯𝗼𝘁 : ᴍᴇᴄʜᴀʙᴏᴛ ®
𝐌𝐨𝐫𝐞 𝐈𝐧𝐟𝐨 𝐇𝐮𝐛𝐮𝐧𝐠𝐢 𝐍𝐨𝐦𝐞𝐫 𝐃𝐢 𝐁𝐚𝐰𝐚𝐡 𝐈𝐧𝐢 :
𝐎𝐰𝐧𝐞𝐫 : +62 838-6232-3152 (𝐉𝐞𝐫𝐮𝐤 𝐏𝐞𝐫𝐚𝐳)
𝐀𝐝𝐦𝐢𝐧 : +62 877-1388-1680 (𝐋𝐮𝐜𝐢𝐚)
               +62 812-4221-8541 (𝐍𝐢𝐞𝐥)
               +62 821-3239-3960 (𝐃𝐢𝐱𝐱𝐲)`
        client.reply(msg, { image: config.sewa_image, caption: capt })
    }
    if (command == "rdp") {
        let capt = `
        # Ready Vps/Rdp

promo :

         -\`,✎ Ram 2gb/1core 
        ↳ op? 15k
         -\`,✎ Ram 4gb/2core 
        ↳ op? 25k
         -\`,✎ Ram 8gb/2core
        ↳ op? 40k
         -\`,✎ Ram 8gb/4core
        ↳ op? 60k
         -\`,✎ Ram 16gb/2core
        ↳ op? 90k
         -\`,✎ Ram 16gb/4core
        ↳ op? 110k
        
About Info :
- Support All Bot
- Support Hacking Hacktivist
- Full Acces Administrator
- And More
        
Available
- Windows :
  ↳ 2012/2016/2019/10/11 pro
- Linux :
  ↳ Ubuntu/Debian/CentOS/RedHat/Oracle/KaliLinux
        
System
  pay - create - check - done
        
TOS
- no mining
- no use VPN
- no DDOS
        
melanggar? auto ban.
        
contact me :
  https://wa.me/6283862323152`

        client.reply(msg, `${capt}`)
    }
    if (command == "premium") {
        client.reply(msg, `Coming Soon!`)
    }
})


cmd.on(['donasi', 'donate'], ['general'], async (msg, { client }) => {
    let caption = `
━ Kalian juga dapat Membantu Bot dengan cara Berdonasi *Seikhlasnya*\nHasil donasi untuk memperpanjang server agar bot terus aktif dan Support Owner :
083862323152 (Gopay/Dana/Shoopepay/Pulsa)
https://saweria.co/PraszDev (Saweria)
https://trakteer.id/PraszDev (Trakteer)

Terima kasih untuk kamu yangsudah donasi untuk perkembangan bot ini`
    client.sendPayment(msg, caption)
})

cmd.on(['owner', 'creator'], ['general'], async (msg, { client }) => {
    await client.sendMessage(msg.from, {
        contacts: {
            displayName: 'Prassz', contacts: [{
                "vcard": "BEGIN:VCARD\nVERSION:3.0\nFN:Jeruk Perassz\nORG:Owner MechaBot;\nitem1.TEL;waid=6283862323152:+62 838-6232-3152\nitem1.X-ABLabel:Telepon\nEND:VCARD"
            },
            {
                "vcard": "BEGIN:VCARD\nVERSION:3.0\nFN:MechaBot\nORG:Bot Number;\nitem1.TEL;waid=6283854324353:+62 838-5432-4353\nitem1.X-ABLabel:Telepon\nEND:VCARD"
            }]
        }
    })

    let resiz = await client.reSize(config.mecha_image, 300, 300)
    await client.sendButton(msg, {
        location: { jpegThumbnail: resiz }, content: `Haii ${msg.pushName} berikut di atas nomor owner, mohon jangan spam, call dll.
atau klik link dibawah ini`}, [{ url: "klik disini", value: "https://wa.me/6283862323152" }])
})

cmd.on(['p', 'ping'], ['general'], async (msg, { client }) => {
    let timestamp = speed()
    let latensi = speed() - timestamp
    let rs = process.memoryUsage();
    let run = functions.parseMs(process.uptime() * 1000);
    let content = `
*Runtime :*\n ${functions.parseResult(run)}
*Kecepatan Respone :* ${latensi.toFixed(4)} _Second_
*Ram Usage :* _${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB_ 
*RRS :* _${functions.parseByteName(rs.rss)}_
`
    client.reply(msg, content)
}, {
    sensitive: true
});

cmd.on(['maintinance', 'mc'], ['general'], async (msg, { client }) => {
    await client.groupUpdateSubject("6283836284553@g.us", "MechaBot Maintinance")
    config.mainten.push(true)
}, {
    owner: "--noresp",
});


cmd.on(['speed'], [], async (msg, { client, query }) => {
    client.reply(msg, 'Testing Speed...')
    let cp = require('child_process')
    let { promisify } = require('util')
    let exec = promisify(cp.exec).bind(cp)
    let o
    try {
        o = await exec('python speed.py')
    } catch (e) {
        o = e
    } finally {
        let { stdout, stderr } = o
        if (stdout.trim()) client.reply(msg, `${stdout}`)
        if (stderr.trim()) client.reply(msg, `${stderr}`)
    }
}, {
})
