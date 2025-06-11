import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { showAlert } from "../../utils/ShowAlert";
import { getDeviceId } from "../../utils/deviceId";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const UserPdfView = () => {
  const hasRun = useRef(false);
  const { pdfid } = useParams();
  const [pdfFileUrl, setPdfFileUrl] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const getIpAddress = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL_API}/pdf/ip`);
    return res.data.ip;
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkAccess = async () => {
      try {
        setLoading(true);

        const ip = await getIpAddress();
        const deviceId = getDeviceId();

        // Fetch the specific PDF info from backend
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/view-one/${pdfid}`
        );
        const currentPdf = res.data.data;

        if (!currentPdf) {
          showAlert("error", "PDF not found");
          setLoading(false);
          return;
        }

        const accessedDevices = currentPdf.accessList || [];
        const userLimit = currentPdf.userLimit;

        const alreadyAccessed = accessedDevices.some(
          (entry) => entry.deviceId === deviceId
        );

        if (!alreadyAccessed) {
          if (accessedDevices.length >= userLimit) {
            setBlocked(true);
            showAlert("error", "User limit exceeded. Access denied.");
            setLoading(false);
            return;
          }

          // Save IP + deviceId to backend
          await axios.put(
            `${import.meta.env.VITE_BASE_URL_API}/pdf/add-ip/${pdfid}`,
            { ip, deviceId }
          );
        }

        // Construct full file URL for the PDF viewer
        const fullPdfUrl = `http://localhost:8080/${currentPdf.filePath}`;
        setPdfFileUrl(fullPdfUrl);
        setLoading(false);
      } catch (err) {
        console.error("Access check failed:", err);
        showAlert("error", err.response?.data?.message || "Access error");
        setLoading(false);
      }
    };

    checkAccess();
  }, [pdfid]);

  if (loading) {
    return (
      <div className="center-center">
        <div className="sphere sphere-1" />
        <div className="sphere sphere-2" />
        <div className="sphere sphere-3" />
        <div className="glass-card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold title mb-2">Please Wait</h1>
            <p className="text-white opacity-80">Loading PDF...</p>
          </div>
        </div>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="center-center">
        <div className="sphere sphere-1" />
        <div className="sphere sphere-2" />
        <div className="sphere sphere-3" />
        <div className="glass-card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold title mb-2">Access Denied</h1>
            <p className="text-white opacity-80">User limit exceeded.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pdfFileUrl) {
    return null; // or some fallback UI
  }

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
      <Viewer fileUrl={pdfFileUrl} />
    </Worker>
  );
};

export default UserPdfView;
