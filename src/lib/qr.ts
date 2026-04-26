import QRCode from "qrcode";

export async function qrToDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 480,
    errorCorrectionLevel: "M",
    color: { dark: "#0E1020", light: "#FFFFFF" },
  });
}

export async function qrToSvgString(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: 1,
    width: 320,
    errorCorrectionLevel: "M",
    color: { dark: "#0E1020", light: "#FFFFFF" },
  });
}
