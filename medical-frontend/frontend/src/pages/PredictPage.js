// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../ScanUpload.css";

// function PredictPage() {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No file selected");
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fileInputRef = useRef(null);
//   const scanSectionRef = useRef(null);
//   const navigate = useNavigate();






// const [prediction, setPrediction] = useState(null);
// const [showVerify, setShowVerify] = useState(false);
// const [actualBlood, setActualBlood] = useState("");
// const [recordId, setRecordId] = useState(null);





//   // Scroll to scan section
//   const scrollToScan = () => {
//     scanSectionRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (selected) {
//       setFile(selected);
//       setFileName(selected.name);
//       setPreview(URL.createObjectURL(selected));
//     }
//   };

//   // Remove selected file
//   const removeFile = () => {
//     setFile(null);
//     setFileName("No file selected");
//     setPreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // Handle scan and prediction
//   const handleScan = async () => {
//     if (!file) {
//       alert("Please upload a fingerprint image");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:5000/predict",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 30000, // 30 seconds timeout
//         }
//       );

//       // Navigate to Result page with prediction data
//       navigate("/result", {
//         state: {
//           bloodGroup: res.data.blood_group,
//           confidence: res.data.confidence,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Backend Error! Make sure app.py is running.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* HERO SECTION */}
//       <section className="scan-hero">
//         <h1>AI-Based Blood Group Detection</h1>
//         <p>
//           Upload your fingerprint and let AI predict your blood group accurately.
//         </p>
//         <button className="hero-btn" onClick={scrollToScan}>
//           Start Scan ↓
//         </button>
//       </section>

//       {/* SCAN SECTION */}
//       <div className="page" ref={scanSectionRef}>
//         <div className="card">
//           <h2 className="title">Fingerprint Scan</h2>
//           <p className="subtitle">Supported formats: JPG, PNG</p>

//           <div className="upload-box">
//             <div className="icon">🧬</div>
//             <p className="filename">{fileName}</p>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               ref={fileInputRef}
//               disabled={loading}
//             />
//           </div>

//           {preview && (
//             <div className="preview-box">
//               <img src={preview} alt="Preview" />
//               <div className="remove" onClick={removeFile}>
//                 ×
//               </div>
//             </div>
//           )}

//           <button
//             className="scan-btn"
//             onClick={handleScan}
//             disabled={loading}
//           >
//             {loading ? <span className="spinner">Analyzing...</span> : "Scan Fingerprint"}
//           </button>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <footer className="scan-footer">
//         © 2026 Hemoprint | AI-Powered Blood Group Detection
//       </footer>
//     </>
//   );
// }

// export default PredictPage;


























// import React, { useState, useRef } from "react";
// import axios from "axios";
// import "../ScanUpload.css";

// function PredictPage() {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No file selected");
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Verification states
//   const [prediction, setPrediction] = useState(null);
//   const [showVerify, setShowVerify] = useState(false);
//   const [actualBlood, setActualBlood] = useState("");
//   const [recordId, setRecordId] = useState(null);

//   const fileInputRef = useRef(null);
//   const scanSectionRef = useRef(null);

//   // Scroll to scan section
//   const scrollToScan = () => {
//     scanSectionRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (selected) {
//       setFile(selected);
//       setFileName(selected.name);
//       setPreview(URL.createObjectURL(selected));
//     }
//   };

//   // Remove selected file
//   const removeFile = () => {
//     setFile(null);
//     setFileName("No file selected");
//     setPreview(null);
//     setPrediction(null);
//     setShowVerify(false);
//     setActualBlood("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // 🔥 Handle scan + prediction
//   const handleScan = async () => {
//     if (!file) {
//       alert("Please upload a fingerprint image");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       // ✅ THIS IS WHERE YOUR CODE GOES
//       const res = await axios.post(
//         "http://127.0.0.1:5000/predict",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       // ✅ SAVE prediction + record id
//       setPrediction(res.data.blood_group);
//       setRecordId(res.data.id);
//       setShowVerify(true);

//     } catch (err) {
//       console.error(err);
//       alert("Backend Error! Make sure app.py is running.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Verify correct blood group
//   const handleVerify = async () => {
//     if (!actualBlood) return;

//     try {
//       await axios.post("http://127.0.0.1:5000/verify", {
//         id: recordId,
//         actual_blood: actualBlood,
//       });

//       alert("Verification saved successfully!");
//       setShowVerify(false);
//     } catch (err) {
//       alert("Verification failed");
//     }
//   };

//   return (
//     <>
//       {/* HERO SECTION */}
//       <section className="scan-hero">
//         <h1>AI-Based Blood Group Detection</h1>
//         <p>Upload your fingerprint and let AI predict your blood group.</p>
//         <button className="hero-btn" onClick={scrollToScan}>
//           Start Scan ↓
//         </button>
//       </section>

//       {/* SCAN SECTION */}
//       <div className="page" ref={scanSectionRef}>
//         <div className="card">
//           <h2 className="title">Fingerprint Scan</h2>
//           <p className="subtitle">Supported formats: JPG, PNG</p>

//           <div className="upload-box">
//             <div className="icon">🧬</div>
//             <p className="filename">{fileName}</p>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               ref={fileInputRef}
//               disabled={loading}
//             />
//           </div>

//           {preview && (
//             <div className="preview-box">
//               <img src={preview} alt="Preview" />
//               <div className="remove" onClick={removeFile}>
//                 ×
//               </div>
//             </div>
//           )}

//           <button
//             className="scan-btn"
//             onClick={handleScan}
//             disabled={loading}
//           >
//             {loading ? "Analyzing..." : "Scan Fingerprint"}
//           </button>

//           {/* ✅ VERIFICATION SECTION */}
//           {showVerify && (
//             <div className="verify-box">
//               <h3>
//                 Predicted Blood Group: <span>{prediction}</span>
//               </h3>

//               <p>Is this correct?</p>

//               <select
//                 value={actualBlood}
//                 onChange={(e) => setActualBlood(e.target.value)}
//               >
//                 <option value="">Select correct blood group</option>
//                 <option>A+</option>
//                 <option>A-</option>
//                 <option>B+</option>
//                 <option>B-</option>
//                 <option>AB+</option>
//                 <option>AB-</option>
//                 <option>O+</option>
//                 <option>O-</option>
//               </select>

//               <button
//                 className="verify-btn"
//                 disabled={!actualBlood}
//                 onClick={handleVerify}
//               >
//                 Submit Correct Blood Group
//               </button>
//             </div>
//           )}
//         </div>
//       </div>















//       {/* FOOTER */}
//       <footer className="scan-footer">
//         © 2026 Hemoprint | AI-Powered Blood Group Detection
//       </footer>
//     </>
//   );
// }

// export default PredictPage;





import React, { useState, useRef } from "react";
import axios from "axios";
import "../ScanUpload.css";

function PredictPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Verification states
  const [prediction, setPrediction] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [actualBlood, setActualBlood] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  const fileInputRef = useRef(null);
  const scanSectionRef = useRef(null);

  // Scroll to scan section
  const scrollToScan = () => {
    scanSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // Reset
  const removeFile = () => {
    setFile(null);
    setFileName("No file selected");
    setPreview(null);
    setPrediction(null);
    setRecordId(null);
    setActualBlood("");
    setShowVerify(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 🔥 Predict
  const handleScan = async () => {
    if (!file) {
      alert("Please upload a fingerprint image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPrediction(res.data.blood_group);
      setRecordId(res.data.id);
      setShowVerify(true);

    } catch (err) {
      console.error(err);
      alert("Prediction failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prediction correct
  const confirmCorrect = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/verify", {
        id: recordId,
        actual_blood: prediction,
      });

      alert("Prediction verified as correct ✅");
      setShowVerify(false);
    } catch (err) {
      alert("Verification failed ❌");
    }
  };

  // ❌ Prediction wrong
  const submitCorrectBlood = async () => {
    if (!actualBlood) return;

    try {
      await axios.post("http://127.0.0.1:5000/verify", {
        id: recordId,
        actual_blood: actualBlood,
      });

      alert("Correct blood group saved ✅");
      setShowVerify(false);
    } catch (err) {
      alert("Verification failed ❌");
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="scan-hero">
        <h1>AI-Based Blood Group Detection</h1>
        <p>Upload your fingerprint and let AI predict your blood group.</p>
        <button className="hero-btn" onClick={scrollToScan}>
          Start Scan ↓
        </button>
      </section>

      {/* SCAN */}
      <div className="page" ref={scanSectionRef}>
        <div className="card">
          <h2 className="title">Fingerprint Scan</h2>
          <p className="subtitle">Supported formats: JPG, PNG</p>

          <div className="upload-box">
            <div className="icon">🧬</div>
            <p className="filename">{fileName}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={loading}
            />
          </div>

          {preview && (
            <div className="preview-box">
              <img src={preview} alt="Preview" />
              <div className="remove" onClick={removeFile}>×</div>
            </div>
          )}

          <button className="scan-btn" onClick={handleScan} disabled={loading}>
            {loading ? "Analyzing..." : "Scan Fingerprint"}
          </button>

          {/* ✅ VERIFY */}
          {showVerify && (
            <div className="verify-box">
              <h3>
                Predicted Blood Group: <span>{prediction}</span>
              </h3>

              <p>Is this prediction correct?</p>

              <button className="verify-btn correct-btn" onClick={confirmCorrect}>
                Yes, Prediction is Correct
              </button>

              <hr />

              <p>If wrong, select correct blood group:</p>

              <select
                value={actualBlood}
                onChange={(e) => setActualBlood(e.target.value)}
              >
                <option value="">Select correct blood group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>

              <button
                className="verify-btn"
                disabled={!actualBlood}
                onClick={submitCorrectBlood}
              >
                Submit Correct Blood Group
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="scan-footer">
        © 2026 Hemoprint | AI-Powered Blood Group Detection
      </footer>
    </>
  );
}

export default PredictPage;
