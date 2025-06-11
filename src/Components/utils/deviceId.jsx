export const getDeviceId = () => {
  try {
    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
      // Always generate manually (no crypto dependency)
      deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error("Failed to generate deviceId:", error);
    return "unknown-device";
  }
};
