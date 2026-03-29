
import { useState } from "react";
export default function App() {
  const [input, setInput] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Prompt Enhancer
  const enhancePrompt = (text) => {
    return `A highly detailed, ultra realistic, cinematic image of ${text}, 4k resolution, soft lighting, sharp focus, professional photography`;
  };

  // 🧠 Fake Image Analyzer (can upgrade later with real AI)
  const analyzeImage = () => {
    return "a detailed photo of an object, realistic, high quality"; 
  };

  const loadPuter = async () => {
    return new Promise((resolve) => {
      if (window.puter) return resolve();

      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  // ✨ Text → Image
  const handleTextGenerate = async () => {
    if (!input) return alert("Enter text");

    setLoading(true);
    setImage(null);

    const improved = enhancePrompt(input);
    setEnhancedPrompt(improved);

    try {
      await loadPuter();

      const img = await window.puter.ai.txt2img(improved, {
        model: "stabilityai/stable-diffusion-3-medium",
      });

      setImage(img.src);
    } catch (err) {
      alert("Error generating image");
    }

    setLoading(false);
  };

  // 🖼️ Image → Image
  const handleImageGenerate = async () => {
    if (!uploadedImage) return alert("Upload image first");

    setLoading(true);
    setImage(null);

    // Step 1: Analyze image (fake for now)
    const analysis = analyzeImage();

    // Step 2: Enhance
    const improved = enhancePrompt(analysis);
    setEnhancedPrompt(improved);

    try {
      await loadPuter();

      const img = await window.puter.ai.txt2img(improved, {
        model: "stabilityai/stable-diffusion-3-medium",
      });

      setImage(img.src);
    } catch (err) {
      alert("Error generating image");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial" }}>
      <h1>🎨 AI Image Generator</h1>

      {/* 🔤 TEXT INPUT */}
      <h3>Text → Image</h3>
      <input
        type="text"
        placeholder="Enter text like 'dog'"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <br /><br />
      <button onClick={handleTextGenerate}>Generate from Text</button>

      <hr style={{ margin: "30px 0" }} />

      {/* ⏳ Loading */}
      {loading && (
  <div style={{ marginTop: "20px" }}>
    <div className="spinner"></div>
    <p>Generating image...</p>
  </div>
)}

      {/* ✨ Enhanced Prompt */}
      {enhancedPrompt && (
        <div style={{ marginTop: "20px" }}>
          <h3>✨ AI Prompt:</h3>
          <p style={{ maxWidth: "500px", margin: "auto" }}>
            {enhancedPrompt}
          </p>
        </div>
      )}

      {/* 🖼️ Output */}
      {image && (
        <div style={{ marginTop: "20px" }}>
          <h3>🖼️ Generated Image:</h3>
          <img
            src={image}
            alt="Generated"
            style={{ width: "400px", borderRadius: "12px" }}
          />
        </div>
      )}
    </div>
  );
}
