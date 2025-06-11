export const getDeviceId = () => {
  try {
    // Use existing deviceId from localStorage if available
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      // Safe fallback for environments without crypto.randomUUID
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Use built-in randomUUID or fallback
      deviceId = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : generateUUID();

      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  } catch (error) {
    console.error("Failed to generate deviceId:", error);
    return "unknown-device";
  }
};
