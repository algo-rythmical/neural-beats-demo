export const fetchAudio = async (prompt, retry = 1) => {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/facebook/musicgen-small",
    {
      // headers: { Authorization: "Bearer {API_TOKEN}" },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt
      }),
    })
    if(res.status === 503 && retry > 0)
      return fetchAudio(prompt, 0)
    return res
};

export const classifyAudio = async (hf, buffer) => {
  const fd = new FormData()
  fd.append('wav', buffer)
  // return await hf.audioClassification({model: 'superb/hubert-large-superb-er', data: buffer})
  return await fetch(
    "http://127.0.0.1:4000/classify_song",
    {
      // headers: { Authorization: "Bearer {API_TOKEN}" },
      method: "POST",
      body: fd,
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // }
    })
};

export const isPromptValid = (prompt) => {
  return prompt.length > 0;
};

export async function streamToBlob(readableStream) {
  const chunks = [];
  const reader = readableStream.getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
  }

  // Concatenate all the chunks into a single Uint8Array
  const uint8Array = new Uint8Array(
    chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
  );

  // Create a Blob from the Uint8Array
  return new Blob([uint8Array], { type: "audio/mpeg" });
}
