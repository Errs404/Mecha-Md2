const axios = require("axios")
const cheerio = require("cheerio")
const ytdl_core = require("ytdl-core")

async function yutube(type, url) {
    let id = await ytdl_core.getVideoID(url)

    let res = await axios.get(`https://joyconverter.com/file/${type}/${id}`)
    let $ = cheerio.load(res.data)
    let result = []
    $('.download > a').each(function (a, b) {
        let textmd = $(b).find('div.text-md')
        result.push({ url: $(b.attribs('href')), bitrate: textmd.eq(0).text().trim(), size: textmd.eq(1).text().trim() })
    })
    return result

}

module.exports = { yutube }