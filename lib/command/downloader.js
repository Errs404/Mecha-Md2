process.on("uncaughtException", console.log);
const Axios = require("axios")
const { yts } = require("../scrapper/youtube")
const { ytdl2 } = require("../scrapper/youtube")
const { yutube } = require("../scrapper/yeteh")
const { searchApk, getApk, getApkReal, searchApkpure, sizer } = require("../scrapper/apk")
const { zippyDl } = require("../scrapper/zippyshare")
const { gdriveDl } = require("../scrapper/gdrive")
const getLink = require("mediafire-link")
const mega = require("megajs")
const tiktok = require("tiktok-scraper-without-watermark");
const { facebook } = require("../scrapper/facebok");
let { list, head, line } = config.unicode

// YOUTUBE
cmd.on(['yt', 'yts', 'ytsearch', 'youtubesearch', 'ytmp4', 'ytvid', 'ytvideo', 'ytmp4doc', 'ytmp3', 'ytmusic', 'ytmp3doc', 'play', 'lagu', 'song'], ['download'], async (msg, {
    client, query, prefix, command, urls
}) => {
    if (command == "yts" || command == "ytsearch" || command == "youtubesearch") {
        try {
            let yt = await yts(query)
            let ytsr = await yt.result
            let captions = `*${head}${line.repeat(4)}${list} Youtube Search*
_*Pencarian Ditemukan*_\n\n`
            for (let tr of ytsr) {
                captions += functions.parseResult(tr, { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" }) + "\n\n"
            }
            // return await client.reply(msg, captions + `*MechaBot*`)
            await client.sendAdReply(msg.from, { text: captions + `*MechaBot*` }, { title: ytsr.title, description: config.botname, matchedText: ytsr[0].url, canonicalUrl: global.linkgcme, thumbnail: ytsr[0].thumbnail, previewType: 2, renderLargerThumbnail: true, mediaType: 1 })
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }


    if (command == "yt" || command == "ytmp4" || command == "ytvid" || command == "ytvideo") {
        if (!urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        if (urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        try {
            if (!urls || !urls[0].includes('youtu')) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
            if (urls[0].includes("/shorts/")) {
                let result = await yutube("mp4", urls[0])
                captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
                captions += `
*Title:* ${result.title}
*Quality:* ${result.data[1].bitrate}
*Size:* ${result.data[1].size}
${head}${line.repeat(3)}${list}
${config.botname}`
                let filename = result.title + " Convert By: MechaBot"
                client.reply(msg, { video: result.data[1].url, fileName: filename, caption: captions})
            }
            if (urls[0].includes("/shorts/")) return
            let play = await yts(urls[0]);
            if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
            let sul = play.result[0].url
            let result = await yutube("mp4", sul)
            captions =
                `*_${head}${line.repeat(4)}${list} Youtube Downloader_*
  Data Berhasil Didapatkan:\n`
            captions += functions.parseResult(play.result[0], { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" })
            let filename = result.title + " Convert By: MechaBot"
            client.reply(msg, { video: result.data[1].url, caption: captions })
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }

    if (command == "ytmp4doc" || command == "ytmp3doc") {
        try {
            if (!urls) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
            if (!urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
            if (urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)

            if (command == "ytmp4doc") {
                if (urls[0].includes("/shorts/")) {
                    let result = await yutube("mp4", urls[0])
                    captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
                    captions += `
*Title:* ${result.title}
*Quality:* ${result.data[1].bitrate}
*Size:* ${result.data[1].size}
${head}${line.repeat(3)}${list}`
                    let filename = result.title + " Convert By: MechaBot"
                    return client.sendAdReply(msg, { document: result.data[1].url, fileName: filename }, { title: result.title, body: result.data[1].bitrate + ` || ` + result.data[0].size, thumbnail: result.thumb, mediaType: 1, mediaUrl: urls[0], sourceUrl: urls[0] })
                }
                if (urls[0].includes("/shorts/")) return
                let play = await yts(urls[0]);
                if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
                let sul = play.result[0].url
                let result = await yutube("mp3", sul)
                let filename = play.result[0].title + " Convert By: MechaBot"
                return client.sendAdReply(msg, { document: result.data[1].url, fileName: filename }, { title: play.result[0].title, body: play.result[0].type + ` || ` + result.data[1].bitrate + ` || ` + result.data[0].size, thumbnail: play.result[0].thumbnail, mediaType: 1, mediaUrl: sul, sourceUrl: sul })
            }
            if (command == "ytmp3doc") {
                if (urls[0].includes("/shorts/")) {
                    let result = await yutube("mp3", urls[0])
                    captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
                    captions += `
*Title:* ${result.title}
*Quality:* ${result.data[1].bitrate}
*Size:* ${result.data[1].size}
${head}${line.repeat(3)}${list}`
                    let filename = result.title + " Convert By: MechaBot"
                    return client.sendAdReply(msg, { document: result.data[1].url, fileName: filename }, { title: result.title, body: result.data[1].bitrate + ` || ` + result.data[0].size, thumbnail: result.thumb, mediaType: 1, mediaUrl: urls[0], sourceUrl: urls[0] })
                }
                if (urls[0].includes("/shorts/")) return
                let play = await yts(urls[0]);
                if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
                let sul = play.result[0].url
                let result = await yutube("mp3", sul)
                let filename = result.title + " Convert By: MechaBot"
                return client.sendAdReply(msg, { document: result.data[1].url, fileName: filename }, { title: play.result[0].title, body: play.result[0].type + ` || ` + result.data[1].bitrate + ` || ` + result.data[0].size, thumbnail: play.result[0].thumbnail, mediaType: 1, mediaUrl: sul, sourceUrl: sul })
            }
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }

    if (command == "ytmp3" || command == "ytmusic" || command == "ytmp3doc") {
        if (!urls) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
        if (!urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        if (urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        try {
            if (!urls[0] || !urls[0].includes('youtu')) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
            if (urls[0].includes("/shorts/")) {
                let result = await yutube("mp3", urls[0])
                captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
                    captions += `
*Title:* ${result.title}
*Quality:* ${result.data[1].bitrate}
*Size:* ${result.data[1].size}
${head}${line.repeat(3)}${list}`
                let filename = result.title + " Convert By: MechaBot"
                return client.sendAdReply(msg, { audio: result.data[1].url, fileName: filename }, { title: result.title, body: result.data[1].bitrate + ` || ` + result.data[0].size, thumbnail: result.thumb, mediaType: 1, mediaUrl: urls[0], sourceUrl: urls[0] })
            }
            if (urls[0].includes("/shorts/")) return
            let play = await yts(urls[0]);
            if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
            let sul = play.result[0].url
            let result = await yutube("mp3", sul)
            captions =
                `*_${head}${line.repeat(4)}${list} Youtube Downloader_*
  Data Berhasil Didapatkan:\n`
            captions += functions.parseResult(play.result[0], { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" })
            let filename = result.title + " Convert By: MechaBot"
            client.sendButton(msg, { image: play.result[0].thumbnail, content: captions + "\n\n_Mohon Tunggu Sebentar_", footer: config.botname }, [{ reply: "Video", value: `.ytmp4 ${sul}` }, { reply: "Document", value: `.ytmp3doc ${sul}` }])
            await client.sendAdReply(msg, { audio: result.data[1].url, fileName: filename }, { title: result.title, body: result.data[1].bitrate + ` || ` + result.data[0].size, thumbnail: result.thumb, mediaType: 1, mediaUrl: urls[0], sourceUrl: urls[0] })
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }

    if (command == "play" || command == "lagu" || command == "song") {
        try {
            let play = await yts("song " + query);
            if (play.length === 0) return client.reply(msg, `Lagu tidak dapat ditemukan!`);
            let sul = play.result[0].url
            // let res = await ytdl(sul)
            //     captions =
            //       `*_${head}${line.repeat(4)}${list} Youtube Play_*
            // Data Berhasil Didapatkan:`
            //     captions += functions.parseResult(res.data, { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" }) + "\n\n *MechaBot*"
            //     // if (!as[0].link) return client.reply(msg, "Terjadi Kesalahan Saat Mengunduh Lagu Tersebut")
            //     // if (as[0].size.split('MB')[0] >= 100) return client.reply(msg, 'GAGAL MENGUNDUH! | File Melebihi Batas 100MB\n\n *File Size : ' + as[0].size)
            //     // client.reply(msg, {image: res.data.thumbnail, caption: captions + "\n\n_Mohon Tunggu Sebentar_"})
            //     client.reply(msg, captions + "\n\n_Mohon Tunggu Sebentar_")
            //     // let done = getAud(res.result)
            //     let done = getQuality(res.result, "144p")
            //     let tinyurl = await Axios.get(`https://tinyurl.com/api-create.php?url=${done}`)
            //     await client.reply(msg, { audio: tinyurl.data, mimetype: "audio/mp4" })
            //     // await client.sendAdReply(msg, { audio: done }, { title: res.result.title, body: as[0].size, thumbnail: as[0].thumb, mediaType: 1, mediaUrl: res[0].url, soutceUrl: res[0].url })
            let result = await yutube("mp3", sul)
            //   captions =
            //     `*_${head}${line.repeat(4)}${list} Youtube Downloader_*
            // Data Berhasil Didapatkan:\n`
            //   captions += functions.parseResult(play.result[0], { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" })
            //   client.sendButton(msg, { image: play.result[0].thumbnail, content: captions + "\n\n_Mohon Tunggu Sebentar_", footer: config.botname }, [{ reply: "Video", value: `ytmp4 ${sul}` }, { reply: "Document", value: `ytmp3doc ${sul}` }])
            let filename = result.title + " Convert By: MechaBot"
            await client.sendAdReply(msg, { audio: result.data[0].url, fileName: filename }, { title: result.title, body: result.data[1].bitrate + ` || ` + result.data[0].size, thumbnail: result.thumb, mediaType: 2, mediaUrl: sul, sourceUrl: sul })
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
        }
    }

}, {
    query: "Masukkan Sebuah Link | Enter A Link",
    wait: "*WAIT! | Mohon Tunggu Sebentar..*",
    param: functions.needed('query/link')
})

cmd.on(['tt', 'tiktok', 'ttdl', 'ttdownloader', 'tiktokdownloader', 'ttaudio', 'tiktokaudio'], ['download'], async (msg, {
    client, query, urls, command
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Tiktok Yang ingin diunduh`)
    if (!urls && !urls[0].includes('tiktok')) return client.reply(msg, `*Bruh, Masukkan Link Tiktok nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('tiktok')) return client.reply(msg, `*Bruh, Masukkan Link Tiktok nya,*\n*_Bukan Link! : ${query}_*`)

    if (command == "tt" || command == "tiktok" || command == "ttdl" || command == "ttdownloader" || command == "tiktokdownloader") {
        try {
            let data = await tiktok.tiklydown(urls[0])
            caption = `*_${head}${line.repeat(4)}${list} Tiktok Downloader_*
Data Berhasil Didapatkan:

*VideoId:* ${data.id}
*Title:* ${data.title}
*Uploadded:* ${data.created_at}
*Coments:* ${data.stats.commentCount}
*Share:* ${data.stats.shareCount}
*Views:* ${data.stats.playCount}
*Duration:* ${data.video.duration} _Second_
*Quality:* ${data.video.ratio}

*Author:* ${data.author.name}
*Id:* ${data.author.id}
*Username:* ${data.author.unique_id}
*Desc:* ${data.author.signature}
${head}${line.repeat(3)}${list}

*${config.botname}*`
            // let data = await tiktokdownload(`https://vt.tiktok.com/${urel}`)
            await client.sendButton(msg, { video: data.video.noWatermark, caption: caption, footer: `Tik-tok Downloader MechaBot` }, [{ reply: "Audio", value: `.ttaudio ${urls[0]}` }])
        } catch (err) {
            try {
                let data = await tiktok.dlpanda(urls[0])
                caption = `*_${head}${line.repeat(4)}${list} Tiktok Downloader_*
Data Berhasil Didapatkan:

*VideoId:* ${data.id}
*Title:* ${data.title}
*Uploadded:* ${data.created_at}
*Coments:* ${data.stats.commentCount}
*Share:* ${data.stats.shareCount}
*Views:* ${data.stats.playCount}
*Duration:* ${data.video.duration} _Second_
*Quality:* ${data.video.ratio}

*Author:* ${data.author.name}
*Id:* ${data.author.id}
*Username:* ${data.author.unique_id}
*Desc:* ${data.author.signature}
${head}${line.repeat(3)}${list}

*${config.botname}*`
                // let data = await tiktokdownload(urls[0])
                await client.sendButton(msg, { video: data.video.noWatermark, caption: caption, footer: `Tik-tok Downloader MechaBot` }, [{ reply: "Audio", value: `.ttaudio ${urls[0]}` }])
            } catch (err) {
                client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut.. Coba Untuk Ulangi\n\n` + err)
                console.log(err)
            }
        }
    }

    if (command == "ttaudio" || command == "tiktokaudio") {
        try {
            let data = await tiktok.tiklydown(urls[0])
            await client.sendAdReply(msg, { audio: data.music.play_url }, { title: data.music.title, body: `Audhor: ${data.music.author}\nConvert By: ${config.botname}`, thumbnail: data.music.cover_hd, mediaType: 1, mediaUrl: "https://instagram.com/sgt_prstyo", sourceUrl: "https://instagram.com/sgt_prstyo" })
        } catch (err) {
            try {
                let data = await tiktok.dlpanda(urls[0])
                await await client.sendAdReply(msg, { audio: data.music.play_url }, { title: data.music.title, body: `Audhor: ${data.music.author}\nConvert By: ${config.botname}`, thumbnail: data.music.cover_hd, mediaType: 1, mediaUrl: "https://instagram.com/sgt_prstyo", sourceUrl: "https://instagram.com/sgt_prstyo" })
            } catch (err) {
                client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
            }
        }
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['zippy', 'zippydl', 'zippyshare', 'zippysharedl', 'zippysharedownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Zippyshare Yang ingin diunduh`)
    if (!urls && !urls[0].includes('zippy')) return client.reply(msg, `*Bruh, Masukkan Link Zippyshare nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('zippy')) return client.reply(msg, `*Bruh, Masukkan Link Zippyshare nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await zippyDl(urls[0])
        // if (res.result.name.includes(".mp4")) 
        // let formatter = res.result.name.split("].")[1]
        return client.sendAdReply(msg, { document: res.result.download, fileName: res.result.name, caption: `*ZippyShare Downloader*\n\n*Title:* ${res.result.name}\n*Size*: ${res.result.size}\n*Uploadded:* ${res.result.upload} \n\n *MechaBot*` }, { title: res.result.name, body: res.result.size + "||" + res.result.upload, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://Instagram.com/sgt_prstyo", sourceUrl: "https://Instagram.com/sgt_prstyo" })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['fb', 'fbdl', 'facebook', 'facebookdl', 'facebookdownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Video Facebook Yang ingin diunduh`)
    // if (!urls && !urls[0].includes('facebook.com')) return client.reply(msg, `*Bruh, Masukkan Link Facebook nya,*\n*_Bukan Link! : ${query}_*`)
    // if (urls && !urls[0].includes('facebook.com')) return client.reply(msg, `*Bruh, Masukkan Link Facebook nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await facebook(urls[0])
        const dl_key1 = res.length > 0 ? Object.keys(res[0]) : -1
        let cut = await Axios.get('https://tinyurl.com/api-create.php?url=' + res[0][dl_key1])
        let r = await cut.data
        return client.sendAdReply(msg, { video: res[0][dl_key1], caption: `*Facebook Video Downloader*\n\n*Manual Download:* ${r}  \n\n *MechaBot*` }, { title: "Facebook Downloader", body: "MechaBot", thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['gdrive', 'gdrivedl', 'googledrive', 'googledrivedl', 'googledrivedownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Google Drive Yang ingin diunduh`)
    if (!urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await gdriveDl(urls[0])
        // if (res.result.name.includes(".mp4")) 
        // let formatter = res.result.name.split("].")[1]
        return client.sendAdReply(msg, { document: res.result.download, fileName: res.result.name, mimetype: res.result.mimetype, caption: `*Google Drive Downloader*\n\n*Title:* ${res.result.name}\n*Size*: ${res.result.size} \n\n *MechaBot*` }, { title: res.result.name, body: res.result.size, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['mediafire', 'mediafiredl', 'mediafiredownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Mediafire Yang ingin diunduh`)
    if (!urls && !urls[0].includes('mediafire')) return client.reply(msg, `*Bruh, Masukkan Link Mediafire nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('mediafire')) return client.reply(msg, `*Bruh, Masukkan Link Mediafire nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await getLink(urls[0])
        return client.sendButton(msg, { document: res, fileName: res.split("mediafire.com/")[1].split("/")[2], caption: `*Mediafire Downloader*\n\n*Title:* ${res.split("mediafire.com/")[1].split("/")[2]}\n\n_Note: jikalau File Tidak Bisa Dibuka Silahkan Download Manual_ \n\n *MechaBot*` }, [{ url: "Download Manual", value: res }])
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['mega', 'megadl', 'megadownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Mega Yang ingin diunduh`)
    if (!urls && !urls[0].includes('mega.nz')) return client.reply(msg, `*Bruh, Masukkan Link Mega nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('mega.nz')) return client.reply(msg, `*Bruh, Masukkan Link Mega nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await mega.File.fromURL(urls[0])
        let data = await res.downloadBuffer()
        let result = await res.loadAttributes()
        return client.reply(msg, { document: data, fileName: result.name, caption: `*Mega Downloader*\n\n*Title:* ${result.name}\n*Size*: ${functions.parseByteName(result.size)}\n ${result.label} \n\n *MechaBot*` })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['searchapk', 'apksearch', 'apks'], ['download'], async (msg, {
    client, query, urls
}) => {
    try {
        let res = await searchApk(query)
        let captions = `*_${head}${line.repeat(4)}${list} Apk Search_*
*Aplikasi ditemukan*\n`
        for (let i = 0; i < res.length; i++) {
            const { name, thumb, url, dl_url, desc } = res[i]
            captions += `
*➛ Nama Aplikasi:* ${name}
*➛ Url:* ${url}
*➛ Url Download:* ${dl_url} 
*➛ Descriptions:* ${desc}
*_${head}${line.repeat(3)}${list}_*

`
        }
        client.reply(msg, { image: res[0].thumb, caption: captions + `*MechaBot*` })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Nama Aplikasi | Enter A Application Name",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/application name')
})

// cmd.on(['downloadapk', 'apkdl', 'dlapk', 'apkdownload'], ['download'], async (msg, {
//   client, query, prefix, command
// }) => {
//   if (!urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
//   if (urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
//   try {
//     let urel = query.replace("https://rexdlfile.com/", "https://rexdlbox.com/")
//     let res = await getApk(urel)
//     let caption = `*_${head}${line.repeat(4)}${list} Apk Downloader_*
// *Aplikasi telah Diunduh*`
//                 const { title, upload_at, views, download } = nim
//                 captions += `
//     *➛ Title:* ${title}
//     *➛ Diupload Pada:* ${upload_at}
//     *➛ Views:* ${views} 
//     *➛ Download:* 

//     `
//     for (let tr of nim.download) {
//         captions += functions.parseResult(tr, { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" }) + "\n"
//       }

//     let caption = `*_${head}${line.repeat(4)}${list} Apk Downloader_*
// *Aplikasi telah Diunduh*

// ➛ Nama Aplikasi: ${res[0].name}
// ➛ Version: ${res[0].url}
// ➛ Size: ${res[0].desc}
// *_${head}${line.repeat(3)}${list}_*
// _Tunggu Sebentar MechaBot Sedang Menggirim File_

// *MechaBot*`

//     client.reply(msg, caption)
//     client.reply(msg, { document: res[0].dl_url.replace("https", "http"), mimetype: 'application/vnd.android.package-archivef', filename: res[0].name + ".apk" })
//   } catch (err) {
//     client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
//   }
// }, {
//   query: "Masukkan Nama Aplikasi | Enter A Application Name",
//   wait: "*WAIT! | Mohon Tunggu Sebentar...*",
//   param: functions.needed('query/link')
// })



// cmd.on(['yt2'], ['download'], async (msg, { client, query }) => {
//   const filename = `${msg.sender.jid?.replace("@s.whatsapp.net", "")}-${msg.key.id}`;
//   const nem = [];
//   nem.push(filename)
//   console.log(`nem=` + nem)
//   await require("ytdl-core")(query).pipe(require('fs').createWriteStream(`./tmp/${nem}.mp4`))
//   client.reply(msg, { video: require('fs').readFileSync(`./tmp/${nem}.mp4`) })
//   if (nem.length > 0) { nem.push(""); console.log(`nem=` + nem) }
// }, {})

// cmd.on(['pixiv'], ['download'], async (msg, { client, query }) => {
//     try {
//         let { data } = await Axios.get(`https://itztobz.me/api/piviv?query${query}`)
//         result = data.result
//         metadata = result[Math.floor(Math.random() * result.length)]
//         let captions = `*${head}${line.repeat(4)}${list} Pixiv Downloader*
// _*Gambar Ditemukan*_\n\n`
//         captions += `
// *ID:* ${metadata.id}
// *Title:* ${metadata.title}
// *Desc:* ${metadata.description}
// *Tags:* ${metadata.tags}
// *Created:* ${metadata.createDate}

// *${head}${line.repeat(3)}${list}*
// `
//         let image = metadata.url
//         client.reply(msg, { image: image, caption: captios })
//     } catch (err) {
//         client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
//     }
// }, {})
