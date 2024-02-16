import { HfInference } from 'https://cdn.jsdelivr.net/npm/@huggingface/inference@2.6.4/+esm';
import { classifyAudio } from "./audio.js";
document.addEventListener("DOMContentLoaded", async function () {
    const hr = new HfInference()
    const classificationInput = document.getElementById("classificationInput");
    const classifyBtn = document.getElementById("classifyButton");
    const dropArea = document.getElementById("dragImage");
    
    let classificationFile = null;
    
    classificationInput.addEventListener("change", async (event) => {
        classificationFile = event.target.files[0]
        dropArea.classList.add("active");
        dropArea.parentElement.classList.add("active-parent");
        dragText.textContent = "File Uploaded";
      })
      
    classifyBtn.addEventListener("click", async function () {
      if (!classificationFile) {
        return
      }
      // const tmp = await new Response(classificationFile).arrayBuffer(); //TODO: USE WHEN HUGGINFACE IS READY

      const res = await classifyAudio(hr, classificationFile)
      const resObj = await res.json()

      const predictionResult = document.getElementById('predictionResult');
      predictionResult.textContent = `Genre of the track is: ${resObj.predicted_genre}.`;
    })


    // Drag and drop functionality
    const dragText = document.getElementById("areaText")
    const areaButton = document.getElementById("areaButton")

    areaButton.onclick = ()=>{
      classificationInput.click(); 
    }
    
    dropArea.addEventListener("dragover", (event)=>{
      event.preventDefault();
      dropArea.classList.add("active");
      dragText.textContent = "Release to Upload File";
    });
    
    
    dropArea.addEventListener("dragleave", ()=>{
      dropArea.classList.remove("active");
      dragText.textContent = "Drag & Drop to Upload File";
    }); 
    
    dropArea.addEventListener("drop", (event)=>{
      event.preventDefault(); 
      dropArea.parentElement.classList.add("active-parent");
      classificationFile = event.dataTransfer.files[0];
      dragText.textContent = "File Uploaded";
  })

});
