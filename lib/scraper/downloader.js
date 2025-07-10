const axios = await "axios".import();
const cheerio =  await "cheerio".import();

export async function getType(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(url);
      if (response.request.res.responseUrl.includes("/photo/")) {
        resolve("image");
      } else {
        resolve("video");
      }
    } catch (error) {
      reject(error);
    }
  });
}

//================Tiktok==============//

export async function tiktok(url) {
  try {
    const response = await axios.post(
      "https://ttsave.app/download",
      {
        query: url,
        language_id: 1,
      },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTMi, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        },
      }
    );

    const html = response.data;
    const $ = cheerio.load(html);
    const type = await getType(url);

    const res = {
      type: type,
      nickname: $("h2.font-extrabold.text-xl.text-center").text().trim(),
      username: $("a.font-extrabold").text().replace("_", ""),
      description: $("p.text-gray-600").text().trim(),
      views: $("span.text-gray-500").eq(0).text().trim(),
      comment: $("span.text-gray-500").eq(1).text().trim(),
      favorite: $("span.text-gray-500").eq(2).text().trim(),
      sound: $("svg.h-5.w-5.text-gray-600 + span").text(),
      share: $("span.text-gray-500").eq(3).text(),
    };

    if (res.type === "video") {
      const videoUrl = {};
      $("a[onclick='bdl(this, event)']").each((index, element) => {
        const link = $(element).attr("href");
        const type = $(element).attr("type");
        videoUrl[type] = link;
      });
      res.video = videoUrl;
    }

    if (res.type === "image") {
      const imageUrl = [];
      $("img").each((index, element) => {
        const image = $(element).attr("src");
        imageUrl.push(image);
      });
      res.image = imageUrl;
    }

    return res;
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  }
}