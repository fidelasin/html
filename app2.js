const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const prompt = `Human: Bana 14K GOLD rengi ROSE boyutu 5 karatı 0.55 ağılığı 3.04,2.92 ile ilgili bir ürünün hakkında müşteri yorumu yazarmısın ürün detaylarını vermeden\n`;

(async () => {
      const gptResponse = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 1600,
          temperature: 0.9,
          top_p: 1,
          presence_penalty: 0,
          frequency_penalty: 0.5,
		  stop: [" Human:", " AI:"],

        });
        console.log(gptResponse.data.choices[0].text)
  })();

  console.log(prompt)