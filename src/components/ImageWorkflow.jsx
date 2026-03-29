
import { useState } from "react";

export default function ImageWorkflow() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const HF_TOKEN = import.meta.env.VITE_HF_TOKEN; // 🔑 add your token here

  // ✨ Prompt enhancer
  const enhancePrompt = (text) => {
    return `A highly detailed, ultra realistic, cinematic image of ${text}, 4k resolution, soft lighting, sharp focus`;
  };

  // 🔄 Load Puter
  const loadPuter = async () => {
    return new Promise((resolve) => {
      if (window.puter) return resolve();

      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  // 🧠 Real Image Analysis (HuggingFace)
 const analyzeImage = async (file) => {
  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": file.type,
        },
        body: file,
      }
    );

    const data = await res.json();

    console.log("HF response:", data);

    // 🔥 FIX: handle non-array response
    if (!Array.isArray(data)) {
      return "an image of something";
    }

    return data[0]?.generated_text || "an image";
  } catch (err) {
    console.error(err);
    return "an image";
  }
};

  // 🚀 Main Function
  const handleGenerate = async () => {
    if (!file) return alert("Upload image first");

    setLoading(true);
    setImage(null);

    try {
      // Step 1: Analyze image
      const desc = analyzeImage(file);
      setAnalysis(desc);

      // Step 2: Enhance prompt
      const improved = enhancePrompt(desc);

      // Step 3: Generate image
      await loadPuter();

      const img = await window.puter.ai.txt2img(improved, {
        model: "stabilityai/stable-diffusion-3-medium",
      });

      setImage(img.src);
    } catch (err) {
      console.error(err);
      alert("Error processing image");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>🖼️ Image → Image</h2>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
          }
        }}
      />

      {/* Preview */}
      {preview && (
        <div style={{ marginTop: "20px" }}>
          <h4>Uploaded Image:</h4>
          <img src={preview} width="250" style={{ borderRadius: "10px" }} />
        </div>
      )}

      <br />

      <button onClick={handleGenerate}>
        Generate Image
      </button>

      {/* Spinner */}
      {loading && (
        <div style={{ marginTop: "20px" }}>
          <div className="spinner"></div>
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <div style={{ marginTop: "20px" }}>
          <h4>🧠 Analysis:</h4>
          <p>{analysis}</p>
        </div>
      )}

      {/* Output */}
      {image && (
        <div style={{ marginTop: "20px" }}>
          <h4>🖼️ Generated Image:</h4>
          <img src={image} width="400" style={{ borderRadius: "12px" }} />
        </div>
      )}
    </div>
  );
}
