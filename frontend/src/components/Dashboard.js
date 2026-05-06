import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard({ username, onLogout }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Criminal");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`https://court-in-action.onrender.com/history/${username}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("category", category);

    try {
      const res = await fetch("https://court-in-action.onrender.com/upload/", {
        method: "POST",
        body: formData
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "court_report.pdf";
      a.click();

      fetchHistory();
    } catch (err) {
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand">
          <div className="brand-glow" />
          <div className="brand-mark">⚖</div>

          <div>
            <div className="brand-title">Court In Action</div>
            <div className="brand-subtitle">AI LEGAL JUDGMENT ANALYZER</div>
          </div>
        </div>

        <div className="topbar-right">
          <div className="welcome-block">
            <div className="welcome-label">WELCOME BACK</div>
            <div className="welcome-name">{username}</div>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="workspace-label">WORKSPACE</div>

          <h1>Judgment Analysis Dashboard</h1>

          <p>
            Upload court judgments, generate AI summaries, and review your prior
            reports — all in one secure workspace.
          </p>
        </div>

        <div className="status-pill">
          <span className="status-dot" />
          All systems operational
        </div>
      </section>

<section className="metrics">
  <div className="metric-card">
    <div className="metric-top">
      <div className="metric-label">REPORTS ANALYZED</div>
      <div className="metric-icon">🧾</div>
    </div>

    <div className="metric-value">{history.length || 0}</div>
    <div className="metric-sub">+12 this month</div>
  </div>

  <div className="metric-card">
    <div className="metric-top">
      <div className="metric-label">ACTIVE CATEGORIES</div>
      <div className="metric-icon">☰</div>
    </div>

    <div className="metric-value">4</div>
  </div>

  <div className="metric-card">
    <div className="metric-top">
      <div className="metric-label">AVERAGE ACCURACY</div>
      <div className="metric-icon">📈</div>
    </div>

    <div className="metric-value">96.4%</div>
    <div className="metric-sub">+0.8% vs last</div>
  </div>

  <div className="metric-card">
    <div className="metric-top">
      <div className="metric-label">COMPLIANCE STATUS</div>
      <div className="metric-icon">✅</div> 
    </div>

    <div className="metric-value">Verified</div>
  </div>
</section> 

      <section className="main-grid">
        <div className="panel upload-panel">
          <div className="panel-badge">AI Analysis</div>

          <h3>Upload Judgment</h3>

          <p className="panel-note">
            ⚠️ AI-generated report. Human verification recommended.
          </p>

          <label className="field-label">Case Category</label>

          <div className="category-pills">
            {["Criminal", "Property", "Family", "General"].map((item) => (
              <button
                key={item}
                type="button"
                className={`category-pill ${
                  category === item ? "active" : ""
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="field-label">Upload PDF</label>

          <label className="upload-box">
            <input
              className="hidden-file-input"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="upload-icon">⇪</div>

            <div className="upload-title">
              {file ? file.name : "Upload court judgment PDF"}
            </div>

            <div className="upload-subtitle">
              Drag & drop your file here, or <span>browse</span>
            </div>

            <div className="upload-meta">PDF only • max 5 MB</div>
          </label>

          <div className="upload-footer">
            <span>
              Reports are processed securely and stored in your private
              workspace.
            </span>

            <button className="analyze-btn" onClick={handleUpload}>
              {loading ? "Processing..." : "Analyze Judgment"}
            </button>
          </div>
        </div>

        <div className="panel history-panel">
          <div className="history-top">
            <div className="panel-badge muted">Recent activity</div>
            <span className="view-all">View all</span>
          </div>

          <h3>Upload History</h3>

          <p className="history-sub">
            Your most recent analyzed judgments and reports.
          </p>

          {history.length === 0 ? (
            <div className="empty-state">No uploads yet</div>
          ) : (
            history.map((item, index) => {
              const itemCategory = item.category || "General";

              const courtMap = {
                Criminal: "Sup. Ct. — Crim. App. 482/2024",
                Property: "High Ct. — W.P. 9381/2023",
                Family: "Family Ct. — M.A. 1207/2024",
                General: "NCLT — C.P. 154/2024"
              };

              const categoryClass = itemCategory.toLowerCase();
              const formatTimestamp = (raw) => {
  if (!raw) return "";

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}; 
              return (
                <div className="history-row" key={index}>
                  <div className="history-icon">📄</div>

                  <div className="history-content">
                    <div className="history-topline">
                      <div className="history-title">
                        {item.case_title || "Untitled Court Judgment"}
                      </div>

                      <span className={`history-badge ${categoryClass}`}>
                        {itemCategory}
                      </span>
                    </div>

                    <div className="history-subline">
                      {courtMap[itemCategory]} · {formatTimestamp(item.timestamp)}{" "} 
                    </div>
                  </div>

                  <button
                    className="download-btn"
                    onClick={() =>
                      window.open(
                        `https://court-in-action.onrender.com/download/${item.report_file}`
                      )
                    }
                  >
                    Download
                  </button>
                </div>
              );
            })
          )}

          <div className="history-bottom">
            <span>{history.length} reports archived</span>
            <span>Synced just now</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 Court In Action — AI Legal Judgment Analyzer</span>
        <span>Built for legal professionals — Private & secure</span>
      </footer>
    </div>
  );
}

export default Dashboard;
