process.on("uncaughtException", console.log);
const fs = require('fs')
const request = require("request");
const moment = require("moment-timezone");
const { tebak } = require("../tebak")
const { tebak_lagu } = require("../tebak")
const { validmove, setGame } = require("../tictactoe");
var config = JSON.parse(fs.readFileSync('./config.json'))
const { setHangman, isPlayHangman } = require('../hangman')

global.db_tebak = { gambar: {}, kata: {}, lagu: {}, kalimat: {}, siapaaku: {}, susunkata: {}, lirik: {}, tekateki: {} }

cmd.on(['ttc', 'tictactoe', 'dellttc', 'deletttc'], ['game'], async (msg, { client, command, query, admin }) => {
    if (command == "ttc" || command == "tictactoe") {
        if (fs.existsSync(`./lib/database/tictactoe/${msg.from}.json`)) {
            const boardnow = setGame(`${msg.from}`);
            const matrix = boardnow._matrix;
            const chatMove = `*🎮 Tictactoe Game 🎳*
 Sedang ada sesi permainan digrup ini\n\n@${boardnow.X} VS @${boardnow.O}

❌ : @${boardnow.X}
⭕ : @${boardnow.O}
    
Giliran : @${boardnow.turn == "X" ? boardnow.X : boardnow.O}
${matrix[0][0]}  ${matrix[0][1]}  ${matrix[0][2]}
${matrix[1][0]}  ${matrix[1][1]}  ${matrix[1][2]}
${matrix[2][0]}  ${matrix[2][1]}  ${matrix[2][2]}
`;
            client.reply(msg, { text: chatMove, mentions: [boardnow.X + "@s.whatsapp.net", boardnow.O + "@s.whatsapp.net"] });
            return;
        }
        if (!msg.mentionedJid) return client.reply(msg, `Tag yang ingin jadi lawan anda!\n\nPenggunaan : *!tictactoe <@TagMember>*`);
        const boardnow = setGame(`${msg.from}`);
        console.log(`Start Tictactore ${boardnow.session}`);
        boardnow.status = false;
        boardnow.X = msg.sender.jid.replace("@s.whatsapp.net", "");
        boardnow.O = msg.mentionedJid[0].split("@")[0];
        fs.writeFileSync(`./lib/database/tictactoe/${msg.from}.json`, JSON.stringify(boardnow, null, 2));
        const strChat = `*🎮 Memulai game tictactoe 🎳*
@${msg.sender.jid.replace("@s.whatsapp.net", "")} menantang anda untuk menjadi lawan game
_[ ${query} ] Ketik Y/N untuk menerima atau menolak permainan_ 
`;
        client.reply(msg, { text: strChat, mentions: [msg.sender.jid, query.replace("@", "") + "@s.whatsapp.net"] });
    }
    if (command == "dellttc" || command == "deletttc") {
        let aadmin = msg.sender.admin == "admin" ? true : false || msg.sender.jid.includes(boardnow.X || boardnow.O)
        if (!aadmin) return client.reply(msg, `Hanya admin dan pemulai yang dapat menghapus sesi tictactoe!`);
        if (fs.existsSync("./lib/database/tictactoe/" + msg.from + ".json")) {
            fs.unlinkSync("./lib/database/tictactoe/" + msg.from + ".json");
            client.reply(msg, `Berhasil menghapus sesi di grup ini!`);
        } else {
            client.reply(msg, `Tidak ada sesi yg berlangsung, mohon ketik .tictactoe`);
        }
    }
}, {
    group: true
})


cmd.on(['tebakgambar', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebakgambar") {
        if (global.db_tebak.gambar[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi tebak lagu sedang berlangsung` }, { title: msg.pushName, body: `Tebak Gambar by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.gambar[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.gambar[msg.from]) return

                var countDownDate = global.db_tebak.gambar[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.gambar[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak Gambar");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak gambar telah berhenti karena lebih dari ${config.game_time.upper} detik 😔\n\nJawaban : ${global.db_tebak.gambar[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.gambar[msg.from].name} ( @${global.db_tebak.gambar[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.gambar[msg.from].listed.length}\n\nMulai lagi? ketik *!tebakgambar* 😊`, }, [{ reply: "Main Lagi!", value: "!tebakgambar" }])
                    delete global.db_tebak.gambar[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebak-gambar.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, { image: nebak.img, caption: `*Tebak gambar diatas ini*\n\nAnda mempunyai waktu ${config.game_time.upper} detik untuk menebak gambar tersebut.\n\n*CLUE* :   ${nebak.jawaban.replace(regextebak, "_").split("").join(" ")}\n\n\`\`\`Sedang menunggu jawaban...\`\`\`` })
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.gambar[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.upper, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            img: nebak.img,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['tebaklagu', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebaklagu") {
        if (global.db_tebak.lagu[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi tebak lagu sedang berlangsung` }, { title: msg.pushName, body: `Tebak Lagu by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.lagu[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.lagu[msg.from]) return

                var countDownDate = global.db_tebak.lagu[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.lagu[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak Lagu");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak lagu telah berhenti karena lebih dari ${config.game_time.upper} detik 😔\n\nJawaban : ${global.db_tebak.lagu[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.lagu[msg.from].name} ( @${global.db_tebak.lagu[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.lagu[msg.from].listed.length}\n\nMulai lagi? ketik *!tebaklagu* 😊`, }, [{ reply: "Main Lagi!", value: "!tebaklagu" }])
                    delete global.db_tebak.lagu[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebaklagu.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, { audio: nebak.link_song, ptt: true })
            client.reply(msg.from, `*Tebak lagu berikut ini*\n\nAnda mempunyai waktu ${config.game_time.upper} detik untuk menebak lagu tersebut.\n\n*CLUE* :  Nama Artist:  ${nebak.artist}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.lagu[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.upper, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            audio: nebak.link_song,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['tebakkata', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebakkata") {
        if (global.db_tebak.kata[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi tebak kata sedang berlangsung` }, { title: msg.pushName, body: `Tebak Lagu by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.kata[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.kata[msg.from]) return

                var countDownDate = global.db_tebak.kata[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.kata[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak Kata");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak kata telah berhenti karena lebih dari ${config.game_time.lowwer} detik 😔\n\nJawaban : ${global.db_tebak.kata[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.kata[msg.from].name} ( @${global.db_tebak.kata[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.kata[msg.from].listed.length}\n\nMulai lagi? ketik *!tebakkata* 😊`, }, [{ reply: "Main Lagi!", value: "!tebakkata" }])
                    delete global.db_tebak.kata[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebakkata.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Tebak kata berikut ini*\n\nAnda mempunyai waktu ${config.game_time.lowwer} detik untuk menebak kata tersebut tersebut.\n\n*CLUE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.kata[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.lowwer, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            audio: nebak.soal,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['tebakkalimat', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebakkalimat") {
        if (global.db_tebak.kalimat[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi tebak kalimat sedang berlangsung` }, { title: msg.pushName, body: `Tebak Lagu by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.kalimat[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.kalimat[msg.from]) return

                var countDownDate = global.db_tebak.kalimat[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.kalimat[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak Kalimat");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak Kalimat telah berhenti karena lebih dari ${config.game_time.lowwer} detik 😔\n\nJawaban : ${global.db_tebak.kalimat[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.kalimat[msg.from].name} ( @${global.db_tebak.kalimat[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.kalimat[msg.from].listed.length}\n\nMulai lagi? ketik *!tebakkalimat* 😊`, }, [{ reply: "Main Lagi!", value: "!tebakkalimat" }])
                    delete global.db_tebak.kalimat[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebakkalimat.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Tebak kalimat berikut ini*\n\nAnda mempunyai waktu ${config.game_time.lowwer} detik untuk menebak kalimat tersebut tersebut.\n\n*SENTENCE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.kalimat[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.lowwer, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            kalimat: nebak.soal,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['tebaklirik', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebaklirik") {
        if (global.db_tebak.lirik[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi tebak lirik sedang berlangsung` }, { title: msg.pushName, body: `Tebak Lagu by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.lirik[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.lirik[msg.from]) return

                var countDownDate = global.db_tebak.lirik[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.lirik[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak Lirik");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak lirik telah berhenti karena lebih dari ${config.game_time.lowwer} detik 😔\n\nJawaban : ${global.db_tebak.lirik[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.lirik[msg.from].name} ( @${global.db_tebak.lirik[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.lirik[msg.from].listed.length}\n\nMulai lagi? ketik *!tebaklirik* 😊`, }, [{ reply: "Main Lagi!", value: "!tebaklirik" }])
                    delete global.db_tebak.lirik[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebaklirik.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Tebak lirik berikut ini*\n\nAnda mempunyai waktu ${config.game_time.lowwer} detik untuk menebak lirik tersebut tersebut.\n\n*SENTENCE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.lirik[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.lowwer, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            lirik: nebak.soal,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['tekateki', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tekateki") {
        if (global.db_tebak.tekateki[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi tekateki sedang berlangsung` }, { title: msg.pushName, body: `Tebak Lagu by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.tekateki[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.tekateki[msg.from]) return

                var countDownDate = global.db_tebak.tekateki[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.tekateki[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tekateki");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tekateki telah berhenti karena lebih dari ${config.game_time.lowwer} detik 😔\n\nJawaban : ${global.db_tebak.tekateki[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.tekateki[msg.from].name} ( @${global.db_tebak.tekateki[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.tekateki[msg.from].listed.length}\n\nMulai lagi? ketik *!tekateki* 😊`, }, [{ reply: "Main Lagi!", value: "!tekateki" }])
                    delete global.db_tebak.tekateki[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tekateki.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Tebak tekateki berikut ini*\n\nAnda mempunyai waktu ${config.game_time.lowwer} detik untuk menebak tekateki tersebut tersebut.\n\n*SENTENCE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.tekateki[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.lowwer, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            tekateki: nebak.soal,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['siapakahaku', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "siapakahaku") {
        if (global.db_tebak.siapaaku[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi siapa aku sedang berlangsung` }, { title: msg.pushName, body: `Siapa aku by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.siapaaku[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.siapaaku[msg.from]) return

                var countDownDate = global.db_tebak.siapaaku[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.siapaaku[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired siapaaku");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi siapa aku telah berhenti karena lebih dari ${config.game_time.lowwer} detik 😔\n\nJawaban : ${global.db_tebak.siapaaku[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.siapaaku[msg.from].name} ( @${global.db_tebak.siapaaku[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.siapaaku[msg.from].listed.length}\n\nMulai lagi? ketik *!siapakahaku* 😊`, }, [{ reply: "Main Lagi!", value: "!siapakahaku" }])
                    delete global.db_tebak.siapaaku[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/siapakahaku.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Tebak Aku berikut ini*\n\nAnda mempunyai waktu ${config.game_time.lowwer} detik untuk menebak Siapa Aku.\n\n*SENTENCE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.siapaaku[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.lowwer, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            siapaaku: nebak.soal,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['susunkata', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "susunkata") {
        if (global.db_tebak.susunkata[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi susun kata sedang berlangsung` }, { title: msg.pushName, body: `Susun kata by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.susunkata[msg.from].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.susunkata[msg.from]) return

                var countDownDate = global.db_tebak.susunkata[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.susunkata[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired susunkata");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi susun kata telah berhenti karena lebih dari ${config.game_time.lowwer} detik 😔\n\nJawaban : ${global.db_tebak.susunkata[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.susunkata[msg.from].name} ( @${global.db_tebak.susunkata[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.susunkata[msg.from].listed.length}\n\nMulai lagi? ketik *!susunkata* 😊`, }, [{ reply: "Main Lagi!", value: "!susunkata" }])
                    delete global.db_tebak.susunkata[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/susunkata.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Susun kata berikut ini*\n\nAnda mempunyai waktu ${config.game_time.lowwer} detik untuk Menyusun Kata tersebut.\n\n*SENTENCE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.susunkata[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.lowwer, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            susunkata: nebak.soal,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})

cmd.on(['hangman'], ['game'], async (msg, { client, command }) => {
    const dataHang = setHangman(msg.from, 'falseXz', '', '')
    console.log(dataHang);
    if (dataHang.game == 'created') {
        let strMulaiHangman = `
Game hangman dimulai oleh ${msg.pushName} ✅😁
${dataHang.hangman}
${dataHang.kata}
Nyawa tersisa : ${numberToEmoji(Number(dataHang.kata_tersisa))}
_Cara main : Masukan huruf perkata sehingga melengkapi kalimat tersebut!_`
        client.reply(msg, `${strMulaiHangman}`)
    } else {
        let strMulaiHangman = `
Game hangman telah dimulai sebelumnya oleh ${msg.pushName} 🙂
${dataHang.hangman}
${dataHang.kata}
Nyawa tersisa : ${numberToEmoji(Number(dataHang.kata_tersisa))}
_Cara main : Masukan huruf perkata sehingga melengkapi kalimat tersebut!_`
        client.reply(msg, `${strMulaiHangman}`)
    }
}, {
})

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
// const { Aki } = require('aki-api');
// const region = 'id'
// const aki = new Aki({ region })


// cmd.on(['akinator'], ['game'], async (msg, { client, command }) => {
//     const reader = fs.readdirSync(`./lib/database/akinator/`);
//     if (reader.length > 0) return client.reply(msg, `Dalam Antrian Mohon Menunggu`)
//     if (reader.includes(msg.from + ".json")) {
//         client.reply(msg.from, { text: `Maaf sesi akinator sedang berlangsung` })
//             .then(() => {
//                 const datanya = JSON.parse(fs.readFileSync(`./lib/database/akinator/${msg.from}.json`));
//                 client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, {
//                     quoted: datanya.message,
//                 });
//             })
//     } else {
//         global.y = setInterval(function () {
//             if (!fs.existsSync(`./lib/database/akinator/${msg.from}.json`)) return;
//             let db_tebak = JSON.parse(fs.readFileSync(`./lib/database/akinator/${msg.from}.json`));
//         }, 1000);
//         client.reply(msg.from, `Pikirkan Seorang Karakter Fiksi Atau Nyata. Saya Akan Menebaknya`)
//         functions.delay(100)
//         await aki.start()
//         client.sendButton(msg, { text: aki.question, buttonText: "Opsi Akinator" }, [{ title: "Ya", value: `!akibalas 0`, description: "Opsi Untuk Yes" }, { title: "Tidak", value: `!akibalas 1`, description: "Opsi Untuk No" }, { title: "Tidak Tau", value: `!akibalas 2`, description: "Opsi Untuk Don't Know" }, { title: "Mungkin", value: `!akibalas 3`, description: "Opsi Untuk Probably" }, { title: "Mungkin Tidak", value: `!akibalas 4`, description: "Opsi Untuk Probably Not" }])
//             .then((obe) => {
//                 const objektebak = {
//                     status: true,
//                     name: msg.pushName,
//                     number: msg.sender.jid,
//                     message: obe,
//                     listed: []
//                 };
//                 fs.writeFileSync(`./lib/database/akinator/${msg.from}.json`, JSON.stringify(objektebak, null, 2));
//             });
//     }
// }, {
// })


// cmd.on(['akibalas'], [], async (msg, { client, query, command }) => {
//     const datanya = JSON.parse(fs.readFileSync(`./lib/database/akinator/${msg.from}.json`));
//     if (datanya.number == msg.sender.jid) {
//         if (aki.progress >= 70 || aki.currentStep >= 78) {
//             await aki.win();
//             client.reply(msg, { image: aki.answers[0].absolute_picture_path, caption: `${aki.answers[0].name}\n${aki.answers[0].description}\nKemungkinan: ${aki.answers[0].proba}%` });
//             functions.delay(1000)
//             await aki.back()
//             clearInterval(global.y)
//             return fs.unlinkSync(`./lib/database/akinator/${msg.from}.json`);
//         } else {
//             await aki.step(query)
//             client.sendButton(msg, { text: `${aki.currentStep}. ${aki.question}`, buttonText: "Opsi Akinator" }, [{ title: "Ya", value: `!akibalas 0`, description: "Opsi Untuk Yes" }, { title: "Tidak", value: `!akibalas 1`, description: "Opsi Untuk No" }, { title: "Tidak Tau", value: `!akibalas 2`, description: "Opsi Untuk Don't Know" }, { title: "Mungkin", value: `!akibalas 3`, description: "Opsi Untuk Probably" }, { title: "Mungkin Tidak", value: `!akibalas 4`, description: "Opsi Untuk Probably Not" }, { title: "Nyerah", value: `!akinyerah`, description: "" }])
//         }
//     } else client.reply(msg, { text: `opsi ini hanya untuk @${datanya.number.split("@")[0]}`, mentions: [datanya.number] })


// }, {
// })

// cmd.on(['akinyerah'], [], async (msg, { client, query, command }) => {
//     await aki.back()
//     client.reply(msg, "cobalagi nanti ya")
//     clearInterval(global.y)
//     return fs.unlinkSync(`./lib/database/akinator/${msg.from}.json`);
// }, {
// })


const {
    Aki
} = require('aki-api');
global.dbaki = {};
global.dbnext = {};

const emojis = [' 👍', ' 👎', ' ❔', ' 🤔', ' 🙄', ' ❌']
const akiimg = {
    "none": "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/none.jpg",
    "win": "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_win.png",
    "defeat": "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_defeat.png",
    "ran": ["https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_01.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_02.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_03.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_04.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_05.png"]
}
// cmd.on([''], [], async (msg, {
//     client, command, prefix
// }) => {
//     if (global.dbaki[msg.sender.jid].progress >= 70 || global.dbaki[msg.sender.jid].currentStep >= 78) {
//         await global.dbaki[msg.sender.jid].win();
//         // await client.sendAdReply(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.win, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
//         await client.sendButton(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, [{ reply: "Sebelumnya", value: "!akiback" }, { reply: "Benar", value: "!akidone" }, { reply: "Bukan", value: "!akinext" }])
//         global.dbnext[msg.sender.jid] = 0;
//         // await functions.delay(150000);
//         if (command != "akinext" || command != "akiback") {
//             await functions.delay(150000);
//             delete global.dbaki[msg.sender.jid];
//         }
//         // delete global.dbaki[msg.sender.jid];
//         return 0;
//     }
// })

cmd.on(['akinator', ' akiback', ' akistop'], ['game'], async (msg, {
    client, command, prefix
}) => {
    if (global.dbaki[msg.sender.jid]) {
        await client.sendAdReply(msg, { text: `Sesi Kamu Masih Aktif, Melanjutkan Sesi Sebelumnya` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.none, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
    } else {
        global.dbaki[msg.sender.jid] = new Aki({
            region: 'id'
        });
        await client.sendAdReply(msg, { text: `Pikirkan Seorang Karakter Fiksi Atau Nyata. Saya Akan Menebaknya` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.none, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
        await global.dbaki[msg.sender.jid].start()
    }
    return await client.sendButton(msg.from, {
        text: global.dbaki[msg.sender.jid].question, buttonText: "Pilih Jawaban Anda"
    }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
        return {
            title: tr + emojis[index], value: `!akijawab ${index}`
        };
    }));
});

cmd.on(['akijawab', 'akinext', 'akiback', 'akidone'], [], async (msg, {
    client, prefix, query, command
}) => {
    if (command == "akijawab") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        await global.dbaki[msg.sender.jid].step(Number(query)).catch((err) => {
            client.reply(msg, `Maaf Session Ada Sudah Expired. silahkan mulai lagi`)
            delete global.dbaki[msg.sender.jid];
        })
        if (global.dbaki[msg.sender.jid].progress >= 70 || global.dbaki[msg.sender.jid].currentStep >= 78) {
            await global.dbaki[msg.sender.jid].win();
            // await client.sendAdReply(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.win, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
            await client.sendButton(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, [{ reply: "Sebelumnya", value: "!akiback" }, { reply: "Benar", value: "!akidone" }, { reply: "Bukan", value: "!akinext" }])
            global.dbnext[msg.sender.jid] = 0;
            // await functions.delay(150000);
            if (command != "akinext" || command != "akiback") {
                await functions.delay(90000);
                delete global.dbaki[msg.sender.jid];
            }
            // delete global.dbaki[msg.sender.jid];
            return 0;
        }
        return await client.sendButton(msg.from, {
            text: global.dbaki[msg.sender.jid].currentStep + ". " + global.dbaki[msg.sender.jid].question, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b`, buttonText: "Pilih Jawaban Anda"
        }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
            return {
                title: tr + emojis[index], value: `!akijawab ${index}`
            };
        }));
    }

    if (command == "akinext") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        try {
            ran = global.dbaki[msg.sender.jid].answers
            dbnext[msg.sender.jid]++
            let res = ran[dbnext[msg.sender.jid]]
            await client.sendButton(msg, { image: res.absolute_picture_path, caption: `${dbnext[msg.sender.jid]} Dari ${ran.length - 1}\n\nSaya Menebak\n\n- ${res.name}\n- ${res.description}\n- Kemungkinan: ${res.proba}%` }, [{ reply: "Benar" }, { reply: "Bukan", value: "!akinext" }])
        } catch (err) {
            client.sendButton(msg, { text: `Hmm Sepertinya Saya Belum Bisa Menebaknya.. Lanjutkan Pertanyaan?`, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b` }, [{ reply: "Ya", value: "!akinext2" }, { reply: "Tidak", value: "akidone" }])
        }
    }
    if (command == "akiback") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        await global.dbaki[msg.sender.jid].back()
        return await client.sendButton(msg.from, {
            text: global.dbaki[msg.sender.jid].question, buttonText: "Pilih Jawaban Anda"
        }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
            return {
                title: tr + emojis[index], value: `!akijawab ${index}`
            };
        }));
    }
    if (command == "akidone") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        delete global.dbaki[msg.sender.jid];
    }

}, {
});

cmd.on(['dellaki', 'deleteaki', 'akistop', 'akidelet'], [], async (msg, {
    client, prefix, query
}) => {
    if (global.dbaki[msg.sender.jid] != undefined || msg.sender.admin != "admin") return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Atau Kamu Bukan Admin, Mulai Dengan ${prefix}akinator`);
    delete global.dbaki[msg.sender.jid];
    client.reply(msg, `Berhasil Menghapus Session Kamu`)
    if (msg.sender.admin == "admin") {
        if (!msg.quotedMsg && !msg.mentionedJid) return client.reply(msg, `Tag User Atau Reply User Dengan Pesan !akidell`)
        if (msg.mentionedJid.length != 0) {
            delete global.dbaki[mentionedJid]
            client.reply(msg, `Berhasil Menghapus Session User`)
        } else if (msg.quotedMsg) {
            delete global.dbaki[msg.quotedMsg.sender.jid]
            client.reply(msg, `Berhasil Menghapus Session User`)
        }
    }
}, {
});

// cmd.on(['akiback', 'akinext', 'akidone'], [], async (msg, {
//     client, prefix, query, command
// }) => {
//     if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//     if (command == "akinext") {
//         if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//         try {
//             ran = global.dbaki[msg.sender.jid].answers
//             dbnext[msg.sender.jid]++
//             let res = ran[dbnext[msg.sender.jid]]
//             await client.sendButton(msg, { image: res.absolute_picture_path, caption: `${dbnext[msg.sender.jid]} Dari ${ran.length - 1}\n\nSaya Menebak\n\n- ${res.name}\n- ${res.description}\n- Kemungkinan: ${res.proba}%` }, [{ reply: "Benar" }, { reply: "Bukan", value: "!akinext" }])
//         } catch (err) {
//             client.sendButton(msg, { text: `Hmm Sepertinya Saya Belum Bisa Menebaknya.. Lanjutkan Pertanyaan?`, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b` }, [{ reply: "Ya", value: "!akinext2" }, { reply: "Tidak", value: "akidone" }])
//         }
//     }
//     if (command == "akiback") {
//         if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//         await global.dbaki[msg.sender.jid].back()
//         return await client.sendButton(msg.from, {
//             text: global.dbaki[msg.sender.jid].question, buttonText: "Pilih Jawaban Anda"
//         }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
//             return {
//                 title: tr + emojis[index], value: `!akijawab ${index}`
//             };
//         }));
//     }
//     if (command == "akidone") {
//         if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//         delete global.dbaki[msg.sender.jid];
//     }

//     if (global.dbaki[msg.sender.jid].progress >= 70 || global.dbaki[msg.sender.jid].currentStep >= 78) {
//         await global.dbaki[msg.sender.jid].win();
//         // await client.sendAdReply(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.win, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
//         await client.sendButton(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, [{ reply: "Sebelumnya", value: "!akiback" }, { reply: "Benar", value: "!akidone" }, { reply: "Bukan", value: "!akinext" }])
//         global.dbnext[msg.sender.jid] = 0;
//         // await functions.delay(150000);
//         if (command != "akinext" || command != "akiback") {
//             await functions.delay(150000);
//             delete global.dbaki[msg.sender.jid];
//         }
//         // delete global.dbaki[msg.sender.jid];
//         return 0;
//     }
// }, {
// });

cmd.on(['akinext2'], [], async (msg, {
    client, command, prefix
}) => {
    if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
    await client.sendButton(msg.from, {
        text: global.dbaki[msg.sender.jid].currentStep + ". " + global.dbaki[msg.sender.jid].question, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b`, buttonText: "Pilih Jawaban Anda"
    }, [{ title: "Iya", value: `!akijawab2 0` }, { title: "Tidak", value: `!akijawab2 1` }, { title: "Tidak tahu", value: `!akijawab2 2` }, { title: "Mungkin", value: `!akijawab2 3` }, { title: "Mungkin tidak", value: `!akijawab2 4` }]);
});

cmd.on(['akijawab2',], [], async (msg, {
    client, prefix, query
}) => {
    if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
    await global.dbaki[msg.sender.jid].step(Number(query)).catch((err) => {
        client.reply(msg, `Maaf Session Ada Sudah Expired. silahkan mulai lagi`)
        delete global.dbaki[msg.sender.jid];
    })
    return await client.sendButton(msg.from, {
        text: global.dbaki[msg.sender.jid].currentStep + ". " + global.dbaki[msg.sender.jid].question, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b`, buttonText: "Pilih Jawaban Anda"
    }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
        return {
            title: tr + emojis[index], value: `!akijawab ${index}`
        };
    }));
}, {
    query: "Masukan Query"
});