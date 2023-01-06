const {
    parse: urlParser
} = require("url");
const cheerio = require('cheerio');
const host = `https://us.tiktok.com`;

function extractJson(string) {
    let $ = cheerio.load(string);
    let json = JSON.parse($("script[id=\"SIGI_STATE\"]").toString().split(`application/json">`)[1].split('</script')[0]);
    return json;
}

function tiktokStalk(username) {
    let response = functions.curl(`${host}/@${username}`, "-H", `User-agent: Mozilla/5.0 (Linux; Android 11; RMX3235) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36`);
    return extractJson(response).MobileUserModule;
}

function tiktokDownload(url) {
    if (url.includes('vt')) {
        let res = functions.curl(url, "-I", "-H", `User-agent: Mozilla/5.0 (Linux; Android 11; RMX3235) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36`)
        return tiktokDownload(res.split('\n').find(tr => tr.includes('Location')).split('Location:')[1].trim())
    } else {
        let parse = urlParser(url);
        url = `${host}${parse.path}`
        let response = functions.curl(url, "-H", `User-agent: Mozilla/5.0 (Linux; Android 11; RMX3235) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36`)
        let json = extractJson(response)
        json = {
            ...json.SEO.metaParams,
            data: json.SharingVideoModule.videoData
        }
        let split = json.description.split('.Video TikTok')
        let [suka,
            komentar] = split[0].split(',')
        let {
            video,
            music,
            author,
            createTime
        } = json.data.itemInfo.itemStruct;
        let result = {
            detail: {
                suka: suka.trim().split(' ')[0],
                komentar: komentar.trim().split(' ')[0],
                soundtrack: split[1].split('.')[1].trim(),
                desc: json.data.shareMeta.desc,
                uploaded: parseInt(createTime + "000")
            },
            author: {
                gid: author.id,
                id: author.uniqueId,
                name: author.nickname,
                avatar: author.avatarMedium
            },
            video,
            music
        }
        return result
    }
}