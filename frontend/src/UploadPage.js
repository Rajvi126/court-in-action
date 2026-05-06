import React, { useState } from "react";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category); // future use

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const blob = await response.blob();

      // Download PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "court_report.pdf";
      a.click();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚖️ Court In Action</h1>
        <p style={styles.subtitle}>
          Convert Court Judgements into Actionable Reports
        </p>

        {/* Category */}
        <select
          style={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>General</option>
          <option>Criminal Law</option>
          <option>Civil Disputes</option>
          <option>Property</option>
          <option>Family / Divorce</option>
        </select>

        {/* File */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />

        {/* Button */}
        <button onClick={handleUpload} style={styles.button}>
          {loading ? "Processing..." : "Upload & Generate Report"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #1e1e2f, #2c2c54)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  },
  input: {
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1e1e2f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};
 
export default UploadPage; 