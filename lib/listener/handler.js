process.on("uncaughtException", console.log);
// const crud = require('../anony/crud')
// const cons = require('../anony/Config/constan');
const { stopChatting } = require('../anony/Function/processing');
const fs = require("fs")
const { validmove, setGame } = require("../tictactoe/index");
const { setHangman, isPlayHangman } = require('../hangman')

const {
    Configuration, OpenAIApi
} = require("openai");
const configuration = new Configuration({
    apiKey: config.openaiapi
});
global.openai = new OpenAIApi(configuration);
global.chatbot = {}
let anonjid = []
module.exports = async (client, msg) => {
    try {

        // const akistart = async () => {
        //     const region = 'id';
        //     const aki = new Aki({ region });
        //     await aki.start();
        //     if (aki.question) return client.reply(msg, `${aki.question}`)
        //     if (msg.string == "0" || msg.string.toLowerCase() == "Ya") return aki.step(0)
        //     console.log('question:', aki.question);
        //     console.log('answers: ', aki.answers);
        // }
        // module.exports = { akistart }

        // =================================================antilink

        if (msg.isGroup) {
            if (msg.string.match("chat.whatsapp.com/") && database[msg.from].antilink) {
                let link = await client.groupInviteCode(msg.from)
                if (msg.string.includes(`${link}`)) return client.reply(msg, `Ini Adalah Link Group Ini Anda Tidak Akan Di Kick`)
                if (!msg.client.admin == "admin") return client.reply(msg, 'Tidak Bisa Kick Saya Bukan Admin')
                if (msg.sender.admin == "admin") return client.reply(msg, 'Okelah lu admin gpp :D')
                client.reply(msg.key.remoteJid, { text: "Linkgroup Terdeteksi Dan Akan Saya Kick" })
                client.sendMessage(msg.key.remoteJid, { delete: msg.key })
                return client.groupParticipantsUpdate(msg.key.remoteJid, [msg.sender.jid], "remove")
            }


            if (msg.key.id.startsWith('BAE5') && !msg.key.fromMe && database[msg.from].nobot) {
                console.log("Antibot true")
                await client.reply(msg.key.remoteJid, "Bot Terdeteksi Dan Akan Saya Kick")
                return client.groupParticipantsUpdate(msg.key.remoteJid, [msg.sender.jid], "remove")
            };


            if (msg.realType.includes('viewOnce') && database[msg.from].antivo) {
                if (msg.type == 'templateMessage') return {}
                let down = msg.downloadMsg
                buf = await down()
                if (msg.type == 'imageMessage') {
                    return client.reply(msg.key.remoteJid, { image: buf.buffer, caption: "Anti ViewOnce Aktif\nPercuma si ngirim ViewOnce" })
                } else if (msg.type == 'videoMessage') {
                    return client.reply(msg.key.remoteJid, { video: buf.buffer, caption: "Anti ViewOnce Aktif\nPercuma si ngirim ViewOnce" })
                }

            }


            let med = msg.realType == 'imageMessage' || msg.realType == 'videoMessage' || msg.realType.includes('viewOnce')
            if (med && database[msg.from].autosticker) {
                if (msg.type == 'templateMessage') return {}
                let down = msg.downloadMsg
                buf = await down()
                if (msg.type == 'imageMessage') {
                    return client.reply(msg, { sticker: buf.buffer, exif: functions.createExif('Create By: Mechabot', "Owner: Squeezed") })
                } else if (msg.type == 'videoMessage') {
                    return client.reply(msg, { sticker: buf.buffer, exif: functions.createExif('Create By: Mechabot', "Owner: Squeezed") })
                }

            }
        }


        // =================================================user
        let user = require("../../src/json/user.json")
        isUser = user.includes(msg.sender.jid)
        if (cmd && !isUser) {
            user.push(msg.sender.jid)
            fs.writeFileSync('./src/json/user.json', JSON.stringify(user))
        }

        // =================================================user
        // if(database[msg.from].mute.includes(msg.from)) {
        //     let length = Object.keys(database[msg.from].chats[msg.from].message).length
        //     // if(length + 1 )return client.reply(msg. `test`)
        // }


        // =================================================tebak gambar detector
        if (global.db_tebak.gambar[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.gambar[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.gambar[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebakgambar*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebakgambar" }])
                delete global.db_tebak.gambar[msg.from]
            }
        }


        if (global.db_tebak.lagu[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.lagu[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.lagu[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebaklagu*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebaklagu" }])
                delete global.db_tebak.lagu[msg.from]
            }
        }

        if (global.db_tebak.kata[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.kata[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.kata[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebakkata*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebakkata" }])
                delete global.db_tebak.kata[msg.from]
            }
        }

        if (global.db_tebak.kalimat[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.kalimat[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.kalimat[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebakkalimat*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebakkalimat" }])
                delete global.db_tebak.kalimat[msg.from]
            }
        }

        if (global.db_tebak.siapaaku[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.siapaaku[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.siapaaku[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!siapaaku*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!siapaaku" }])
                delete global.db_tebak.siapaaku[msg.from]
            }
        }

        if (global.db_tebak.susunkata[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.susunkata[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.susunkata[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!susunkata*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!susunkata" }])
                delete global.db_tebak.susunkata[msg.from]
            }
        }

        if (global.db_tebak.lirik[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.lirik[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.lirik[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebaklirik*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebaklirik" }])
                delete global.db_tebak.lirik[msg.from]
            }
        }

        if (global.db_tebak.tekateki[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.tekateki[msg.from].listed.push(msg.string);
            if (badan.includes(global.db_tebak.tekateki[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tekateki*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tekateki" }])
                delete global.db_tebak.tekateki[msg.from]
            }
        }

        // =================================================anonchat
        const type = Object.keys(msg?.message)
        function groupBy(list, keyGetter) {
            const map = new Map();
            list.forEach((item) => {
                const key = keyGetter(item);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });
            return map;
        }

        function isItemInArray(array, item) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][0].jid == item || array[i][1].jid == item) {
                    return i;
                }
            }
            return -1;
        }

        const args = msg.string.split(/ +/g);
        const cmdn = msg.string.toLowerCase().split(" ")[0] || "";
        const prefix1 = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/.test(cmdn) ? cmdn.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/gi) : "-";

        //crud.showChatting()
        //   .then(async ({
        //        result
        //    }) => {
        //       const filteredChatting = result.filter(i => i.chat_key)
        //        const filteredSearching = result.filter(i => !i.chat_key)
        //       const grouped = groupBy(filteredChatting, i => i.chat_key)
        //       const sesiChat = Array.from(grouped).map(i => i[1])
        //      anonjid.push(filteredChatting.map(i => i.jid))
        // console.log(sesiChat);
        //      sesiChat.filter(i => i.length == 1).map(i => i[0].jid).forEach((v, i) => {
        //         stopChatting(v).then(() => {
        //             let button = [{ reply: 'LAPOR KESALAHAN SISTEM', value: prefix1 + 'anonbug' }]
        //              let content = 'Mohon maaf kamu telah distop oleh sistem, karna terdeteksi bug! silahkan chat admin untuk melapor agar nomer kamu baik baik saja'
        //            client.sendButton(msg, { text: content, footer: 'Anonymouschat MechaBot' }, button)
        //        }).catch(console.log)
        //     })
        //     const mainIndex = isItemInArray(sesiChat, msg.sender.jid)
        //     const index1 = sesiChat.findIndex(i => i[0].jid == msg.sender.jid)
        // const index2 = sesiChat.findIndex(i => i[1].jid == sender)
        // console.log(JSON.stringify(anon, null, 4));
        //    if (msg.string == prefix1 + 'sendprofile' && (filteredChatting.findIndex(i => i.jid == msg.sender.jid) == -1)) {
        //        let button = [{ reply: `${cons.display_search}`, value: prefix1 + 'anonstart' }]
        //       let content = cons.cannot_sendprofile
        //       client.sendButton(msg, { text: content, footer: 'Anonymouschat MechaBot' }, button)
        //        return
        //     }
        //    if (mainIndex != -1) { // Jika user mempunyai sesi chat
        //       if (msg.from.includes('g.us')) return // Jika dari grup jangan respon
        //       if (msg.fromMe) return // Jika dikirim dari bot maka jangan respon (mencegah spam)
        // console.log(JSON.stringify(sesiChat, null, 2), anon.key); 
        //       const real = index1 != -1 ? 'pertama' : 'kedua' // Cek posisi pertama atau kedua
        //       const partnerJID = real == 'pertama' ? sesiChat[mainIndex][1]?.jid : sesiChat[mainIndex][0]?.jid // Jika posisi pertama, maka chat dengan kedua 
        //       if (msg.string == prefix1 + 'sendprofile') { // Kirim profile ke lawan chat
        //           const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
        //////////              +
        //              'VERSION:3.0\n' +
        ////////              'FN:' + msg.pushName + '\n' // full name
        //////              +
        ////             'ORG:AnonChat;\n' // the organization of the contact
        //       client.sendMessage(partnerJID, { contacts: { displayName: msg.pushName, contacts: [{ vcard }] } })
        //           .then((data) => {
        //                client.sendMessage(partnerJID, { text: cons.sending_profile }, {
        //                 quoted: data
        //             })
        //              client.reply(msg.from, cons.profile_sent)
        //            })
        //     }
        //    if (msg.string.startsWith(prefix1)) return // Jika berawal prefix maka jangan respon
        // kenapa gw bikin prefix1 karena gw pake no prefix klo pake no pref auto chatnya g anyaut
        // var some = command.find(tr => tr.command.includes(msg.string))
        // if (msg.string == cmd.command) return client.sendMessage(partnerJID, { text: msg.string }) //buat deteksi klo pake command ngirim text 
        //       // Cek tipe pesan
        //    if (msg.type == "conversation") {
        //        //   // sendTo(partnerJID, msg)
        //            client.sendMessage(partnerJID, { text: msg.string })
        //       } else if (msg.type == "extendedTextMessage") {
        //            client.sendMessage(partnerJID, { text: msg.string, contextInfo: msg.message["extendedTextMessage"].contextInfo })
        //       } else {
        //           contextInfo = msg.message[msg.type].contextInfo ?? {}
        //           client.sendMessageFromContent(partnerJID, msg.message, { contextInfo })
        //        }
        //      }
        //  }).catch((e) => console.log(e))

        // ==================================ttc
        try {
            let arrNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
            if (fs.existsSync(`./lib/database/tictactoe/${msg.from}.json`)) {
                const boardnow = setGame(`${msg.from}`);
                if (msg.string.toLowerCase() == "y" || msg.string.toLowerCase() == "yes" || msg.string.toLowerCase() == "ya") {
                    if (boardnow.O == msg.sender.jid.replace("@s.whatsapp.net", "")) {
                        if (boardnow.status)
                            return client.reply(msg, `Game telah dimulai sebelumnya!`);
                        const matrix = boardnow._matrix;
                        boardnow.status = true;
                        fs.writeFileSync(`./lib/database/tictactoe/${msg.from}.json`, JSON.stringify(boardnow, null, 2)
                        );
                        const chatAccept = `*🎮 Tictactoe Game 🎳*
                
❌ : @${boardnow.X}
⭕ : @${boardnow.O}

Giliran : @${boardnow.turn == "X" ? boardnow.X : boardnow.O}
${matrix[0][0]}  ${matrix[0][1]}  ${matrix[0][2]}
${matrix[1][0]}  ${matrix[1][1]}  ${matrix[1][2]}
${matrix[2][0]}  ${matrix[2][1]}  ${matrix[2][2]}
`;
                        client.reply(msg, { text: chatAccept, mentions: [boardnow.X + "@s.whatsapp.net", boardnow.O + "@s.whatsapp.net"] });

                    } else {
                        client.reply(msg, { text: `Opsi ini hanya untuk @${boardnow.O} !`, mentions: [boardnow.O + "@s.whatsapp.net"] });
                    }
                } else if (msg.string.toLowerCase() == "n" || msg.string.toLowerCase() == "no" || msg.string.toLowerCase() == "tidak") {
                    if (boardnow.O == msg.sender.jid.replace("@s.whatsapp.net", "")) {
                        if (boardnow.status)
                            return client.reply(msg, `Game telah dimulai sebelumnya!`);
                        fs.unlinkSync(`./lib/database/tictactoe/${msg.from}.json`);
                        client.reply(msg, { text: `Sayangnya tantangan @${boardnow.X} ditolak ❌😕`, mentions: [boardnow.X + "@s.whatsapp.net"] });

                    } else {
                        client.reply(msg, { text: `Opsi ini hanya untuk @${boardnow.O} !`, mentions: [boardnow.O + "@s.whatsapp.net"] });
                    }
                }
                if (msg.isGroup) {
                    if (arrNum.includes(msg.string)) {
                        // if (!fs.existsSync(`./lib/tictactoe/db/${from}.json`)) return {}
                        const boardnow = setGame(`${msg.from}`);
                        if (
                            (boardnow.turn == "X" ? boardnow.X : boardnow.O) !=
                            msg.sender.jid.replace("@s.whatsapp.net", "")
                        )
                            return;
                        const moving = validmove(Number(msg.string), `${msg.from}`);
                        const matrix = moving._matrix;
                        if (moving.isWin) {
                            if (moving.winner == "SERI") {
                                const chatEqual = `*🎮 Tictactoe Game 🎳*
          
Game berakhir seri 😐
`;
                                client.reply(msg, `${chatEqual}`);
                                fs.unlinkSync(`./lib/database/tictactoe/${msg.from}.json`);
                                return;
                            }
                            const winnerJID = moving.winner == "O" ? moving.O : moving.X;
                            const looseJID = moving.winner == "O" ? moving.X : moving.O;
                            const limWin = Math.floor(Math.random() * 20) + 10;
                            const limLoose = Math.floor(Math.random() * 10) + 5;
                            const chatWon = `*🎮 Tictactoe Game 🎳*
          
Telah dimenangkan oleh @${winnerJID} 😎👑
`;
                            // giftLimit(winnerJID + "@s.whatsapp.net", limWin);
                            // pushLimit(looseJID + "@s.whatsapp.net", limLoose);
                            client.reply(msg, { text: chatWon, mentions: [moving.winner == "O" ? moving.O + "@s.whatsapp.net" : moving.X + "@s.whatsapp.net"] })
                            fs.unlinkSync(`./lib/database/tictactoe/${msg.from}.json`);
                        } else {
                            const chatMove = `*🎮 Tictactoe Game 🎳*
          
❌ : @${moving.X}
⭕ : @${moving.O}
    
Giliran : @${moving.turn == "X" ? moving.X : moving.O}
${matrix[0][0]}  ${matrix[0][1]}  ${matrix[0][2]}
${matrix[1][0]}  ${matrix[1][1]}  ${matrix[1][2]}
${matrix[2][0]}  ${matrix[2][1]}  ${matrix[2][2]}
`;

                            client.reply(msg, { text: chatMove, mentions: [moving.X + "@s.whatsapp.net", moving.O + "@s.whatsapp.net",] })
                        }
                    }
                }
            }

        } catch (e) {
            client.reply(msg, `Bidang Tersebut Telah Terisi`)
        }

        // HANGMAN

        function checkOneWord(body) {
            if (body.length === 1) {
                if (body.match(/[a-zA-Z]/)) {
                    return true
                }
                else {
                    return false
                }
            } else {
                return false
            }
        }

        const emoji = require("node-emoji");
        function numberToEmoji(number) {
            if (isNaN(number)) return { status: false, message: 'Not a Number!' }
            let data = ''
            switch (number) {
                case 0:
                    data = emoji.emojify(":zero:")
                    break;
                case 1:
                    data = emoji.emojify(":one:")
                    break;
                case 2:
                    data = emoji.emojify(":two:")
                    break;
                case 3:
                    data = emoji.emojify(":three:")
                    break;
                case 4:
                    data = emoji.emojify(":four:")
                    break;
                case 5:
                    data = emoji.emojify(":five:")
                    break;
                case 6:
                    data = emoji.emojify(":six:")
                    break;
                case 7:
                    data = emoji.emojify(":seven:")
                    break;
                case 8:
                    data = emoji.emojify(":eight:")
                    break;
                case 9:
                    data = emoji.emojify(":nine:")
                    break;
                default:
                    break;
            }
            return data
        }

        if (isPlayHangman(msg.from)) {
            if (checkOneWord(msg.body)) {
                const dataHangman = setHangman(msg.from, msg.body.toLowerCase(), msg.pushName, msg.sender.jid)
                // console.log(dataHangman);
                // if (dataHangman.game == 'playing') {
                if (dataHangman.status) {
                    if (dataHangman.game == 'win') {
                        let dataUserBenar = dataHangman.jidUser.benar
                        let dataUserSalah = dataHangman.jidUser.salah
                        let strUser = `\`\`\`Hasil akhir\`\`\`\n\n`
                        for (let i = 0; i < dataUserBenar.length; i++) {
                            const randomOneTillThree = Math.floor(Math.random() * 2) + 1
                            // giftLimit(dataUserBenar[i], randomOneTillThree)
                            strUser += `${dataHangman.statusUser.benar[i]} +${randomOneTillThree} 🎁\n`
                        }
                        for (let i = 0; i < dataUserSalah.length; i++) {
                            const randomOneTillTwo = Math.floor(Math.random() * 1) + 1
                            // pushLimit(dataUserSalah[i], randomOneTillTwo)
                            strUser += `${dataHangman.statusUser.salah[i]} -${randomOneTillTwo} ⚠️\n`
                        }
                        let strMenang = `
Game telah dimenang kan total benar ${dataHangman.statusUser.benar.length} 😎✅
${dataHangman.hangman}
${dataHangman.kata}
${strUser} 🔥👌
`
                        client.reply(msg, `${strMenang}`)
                    } else {
                        let strBenarHangman = `
Selamat kata benar 😁✅ ditebak oleh ${msg.pushName}
${dataHangman.hangman}
${dataHangman.kata}
Nyawa tersisa : ${numberToEmoji(Number(dataHangman.kata_tersisa))}`
                        client.reply(msg, `${strBenarHangman}`)
                    }
                } else {
                    // console.log('masuk');
                    if (dataHangman.message == 'Kata salah!') {
                        let strSalahHangman = `
Sayangnya kata salah ☹️❌ ditebak oleh ${msg.pushName}
${dataHangman.hangman}
${dataHangman.kata}
Nyawa tersisa : ${numberToEmoji(Number(dataHangman.kata_tersisa))}`
                        client.reply(msg, `${strSalahHangman}`)
                    } else if (dataHangman.game == 'lose') {
                        let dataUserSalah = dataHangman.jidUser.salah
                        let strUser = `\`\`\`Hasil akhir\`\`\`\n\n`
                        for (let i = 0; i < dataUserSalah.length; i++) {
                            const randomOneTillTwo = Math.floor(Math.random() * 1) + 1
                            // pushLimit(dataUserSalah[i], randomOneTillTwo)
                            strUser += `${dataHangman.statusUser.salah[i]} -${randomOneTillTwo} ⚠️\n`
                        }
                        let strKalah = `
Game telah berakhir, total salah ${dataHangman.statusUser.salah.length} 😱❌
${dataHangman.hangman}
${dataHangman.kata}
${strUser}
_Note : Apabila game berakhir dengan kekalahan, jawaban yang benar tidak akan mendapat gift limit!_
`
                        client.reply(msg, `${strKalah}`)
                    } else {
                        client.reply(msg, `${dataHangman.message} ❌`)
                    }
                }
                // }
            }
        }

        // ====================================================
        // crud.showChatting().then(async ({ result }) => {
        //     const filteredChatting = result.filter(i => i.chat_key)
        //     const filteredSearching = result.filter(i => !i.chat_key)
        //     const grouped = groupBy(filteredChatting, i => i.chat_key)
        //     const sesiChat = Array.from(grouped).map(i => i[1])
        //     return anonjid.push(filteredChatting.map(i => i.jid))
        // })
        // console.log(anonjid)

        if (!chatbot[msg.sender.jid]) {
            if (!msg.isGroup) {
                if (Object.keys(client.chats[msg.from].messages).length == 1) {
                    if (anonjid.length == 1 ? anonjid[0].includes(msg.sender.jid) : "") return client.reply(msg, `Kamu Masih terhubung Dengan Anonymous Chat.. \nKetik !Anonstop untuk stop sesi chating`)
                    if (chatbot[msg.sender.jid]) {
                        delete chatbot[msg.sender.jid];
                        return await client.reply(msg, {
                            text: `Menghapus Sesi Ai Chat Bot...`
                        })
                    }
                    chatbot[msg.sender.jid] = [`Ai: Hari Ini : ${functions.parseDate("LLLL")}`, "Ai: Aku Adalah bot Whatsapp yang bernama MechaBot Yang Di Ciptakan Jeruk Peras, Gyn dan Team!", "Ai: Cara Menggunakan MechaBot Adalah Ketik Menggunakan awalan prefix dan dilanjutkan command tanpa sepasi contoh !menu", "Ai: Anggota tim pembuat mechabot adalah Pras, Galang dan Najmy dan suport yang terdiri dari Lucia, Niel, Dixxy dan desta", "Ai: Cara menambahkan MechaBot ke group adalah dengan cara sewa, info lanjut hubungi Owner no: 083862323152 / wa.me/6283862323152", `group whatsapp MechaBot: ${linkgcme}`]
                    await client.reply(msg, {
                        text: `Hallo! Saya MechaBot\nBot Whatsapp Yang akan Membantu anda..\nAda yang bisa saya bantu?`
                    })
                }
            }
        }
        // else {
        //     if (chatbot[msg.sender.jid]) {
        //         delete chatbot[msg.sender.jid];
        //         return await client.reply(msg, {
        //             text: `Menghapus Sesi Ai Chat Bot...`
        //         })
        //     }
        //     chatbot[msg.sender.jid] = ["Ai: Aku Adalah MechaBot Yang Di Ciptakan Jeruk, Gyn dan Team!"]
        //     await client.reply(msg, {
        //         text: `Halo! Sesi Chat Kamu Dimulai, Coba Perkenalkan Dirimu! ${msg.isGroup ? "Jika Kamu Ingin MechaBot Merespon, Tag Pesan Bot!" : ""}`
        //     })
        // }

        if (chatbot[msg.from]) {
            if (msg.fromMe) return;
            if (msg.isGroup && (!msg.quotedMsg || msg.quotedMsg.sender.jid)) return;
            if (msg.string.startsWith(prefix1)) return;
            chatbot[msg.from].push(`Human: ${msg.string}`)
            chatbot[msg.from].push(`Ai:`)
            let resp = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: chatbot[msg.from].join('\n'),
                temperature: 0.9,
                max_tokens: 2400,
                top_p: 1,
                stop: ["Ai:", "Human:"],
                frequency_penalty: 0,
                presence_penalty: 0,
            })
            let text = resp.data.choices[0].text.trim()
            if (!text) text = functions.randomize(["Aku Tidak Tau", "Kurang Tau", "Nanti Saya Belajar Lagi!", "Maaf Saya Tida Tau"])
            await client.reply(msg, {
                text
            })
            chatbot[msg.from][chatbot[msg.from].length - 1] = "Ai: " + text
        }

    } catch (e) {
        if (!String(e).includes('this.isZero')) {
            console.log(e);
            client.reply('6283862323152@s.whatsapp.net', `${functions.util.format(e)}`);
        }
    }
}
