import QRCodeStyling from "qr-code-styling";
import { JSDOM } from "jsdom";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";

export const generateQR = async (config: any) => {
    console.log("QR generation started");

    const dom = new JSDOM("<!DOCTYPE html><html><body><div id='qr'></div></body></html>");
    global.window = dom.window as any;
    global.document = dom.window.document as any;

    // Canvas bindings
    (global as any).HTMLCanvasElement = dom.window.HTMLCanvasElement;
    (global as any).CanvasRenderingContext2D =
        createCanvas(300, 300).getContext("2d")?.constructor;

    // ⚠️ logo image preload (VERY IMPORTANT)
    let logoImage;
    if (config.logoPath) {
        logoImage = await loadImage(config.logoPath);
        console.log("Logo loaded");
    }

    const qr = new QRCodeStyling({
        width: 300,
        height: 300,
        data: config.data,
        image: logoImage,
        dotsOptions: {
            color: config.dotsColor || "#000000",
            type: config.dotsType || "rounded",
        },
        backgroundOptions: {
            color: config.bgColor || "#ffffff",
        },
        imageOptions: {
            margin: 5,
        },
    });

    const container = document.getElementById("qr");
    if (!container) throw new Error("QR container not found");

    // 🔥 MOST IMPORTANT LINE
    qr.append(container);

    console.log("QR appended to DOM");

    // allow render cycle
    await new Promise((r) => setTimeout(r, 100));

    const buffer = await qr.getRawData("png");
    console.log("Buffer generated");

    const filePath = path.join(
        process.cwd(),
        "uploads",
        `qr-${Date.now()}.png`
    );
    console.log(filePath)

    fs.writeFileSync(filePath, buffer as Buffer);

    console.log("QR saved:", filePath);

    return filePath;
};
