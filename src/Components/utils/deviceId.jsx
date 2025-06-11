// utils/deviceId.js
export function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID(); // Requires modern browsers
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}
