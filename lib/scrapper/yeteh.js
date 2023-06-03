const axios = require("axios")
const cheerio = require("cheerio")
// const ytdl_core = require("ytdl-core")
let ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/

async function yutube(type, url) {
    // let id = await ytdl_core.getVideoID(url)
    let ytId = ytIdRegex.exec(url)[1]

    let res = await axios.get(`https://joyconverter.com/file/${type}/${ytId}`)
    let $ = cheerio.load(res.data)
    let result = {}
    result.title = $('div.text-center > h2').text()
    result.thumb = $(".block > .img").attr("style").match(/(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg))/i)[0]
    result.data = []
    $('.download > a').each(function (a, b) {
        let textmd = $(b).find('div.text-md')
        result.data.push({
            url: $(b).attr('href'),
            bitrate: textmd.eq(0).text().trim(),
            size: textmd.eq(1).text().trim()
        })
    })
    return result
}

module.exports = { yutube }

