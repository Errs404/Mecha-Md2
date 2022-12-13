async function toAnime(req) {
    let res = await functions.fetch(
        'https://ai.tu.qq.com/trpc.shadow_cv.ai_processor_cgi.AIProcessorCgi/Process',
        {
            headers: {
                'Content-type': 'application/json',
                Origin: 'https://h5.tu.qq.com',
                Referer: 'https://h5.tu.qq.com',
            },
            method: 'POST',
            body: JSON.stringify({
                busiId: 'ai_painting_anime_img_entry',
                extra: JSON.stringify({
                    face_rects: [],
                    version: 2,
                    platform: 'web',
                    data_report: {
                        parent_trace_id: 'c26b66f0-caee-1a93-3713-67e585db33f7',
                        root_channel: '',
                        level: 0,
                    },
                }),
                images: [req.toString('base64')],
            }),
        }
    )
    let v = await res.json()
    if (res.code == 1) return v
    return JSON.parse(v.extra)
};

module.exports = { toAnime } 