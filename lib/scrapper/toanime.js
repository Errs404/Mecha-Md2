const axios = require("axios");
const md5 = (v) => require("crypto").createHash('md5').update(v).digest("hex");
const uuid = require("crypto").randomUUID;

async function toAnime(buff) {
    const obj = {
        busiId: 'different_dimension_me_img_entry', 
        extra: JSON.stringify({
            face_rects: [],
            version: 2,
            platform: 'web',
            data_report: {
                parent_trace_id: uuid(), 
                root_channel: '',
                level: 0,
            },
        }),
        images: [buff.buffer.toString('base64')],
    };
    

const str = JSON.stringify(obj);
 const sign = md5(
      'https://h5.tu.qq.com' +
        (str.length + (encodeURIComponent(str).match(/%[89ABab]/g)?.length || 0)) +
        'HQ31X02e');
const response = await axios.request({
                    method: 'POST',
                    url: 'https://ai.tu.qq.com/trpc.shadow_cv.ai_processor_cgi.AIProcessorCgi/Process',
                    data: obj,
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': 'https://h5.tu.qq.com',
                        'Referer': 'https://h5.tu.qq.com/',
                        'User-Agent':
                            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                        'x-sign-value': sign,
                        'x-sign-version': 'v1',
                    },
                    timeout: 30000,
                });
return response.data
};

module.exports = { toAnime } 
