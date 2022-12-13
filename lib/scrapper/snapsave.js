const axios = require("axios");
const { load } = require("cheerio");
const FormData = require("form-data");

const decode = (source) => {
    const decode = global.eval;
    global.eval = (_code) => {
        global.eval = decode;
        return _code;
    };
    return decode(source);
};

const form = new FormData();
form.append("url", "https://fb.watch/gW4SlAatvn/");

axios.post("https://snapsave.app/action.php?lang=id", form, {
        method: "POST",
        headers: {
            ...form.getHeaders(),
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            referer: "https://snapsave.app/",
        },
    })
    .then(async ({ data }) => {
        const decoded = decode(data);
        const html = /.innerHTML = "(.*)";/.exec(decoded)[1].replace(/\\\"/g, '"');
        const $ = load(html);
        const result = await Promise.resolve(
            $(".column tbody tr")
                .map(function () {
                    return {
                        quality: Number($(this).find(".video-quality").text().match(/\d+/)),
                        url:
                            $(this).find("a").attr("href") ||
                            "https://snapsave.app" +
                            $(this)
                                .find("button")
                                .attr("onclick")
                                .match(/get_progressApi\(\\\'(\S+)\\\'\);showAd/)[1] ||
                            "",
                        needRender: value.includes("render"),
                    };
                })
                .toArray()
                .sort((low, high) => high.quality - low.quality)
        );
        console.log(result);
    });