const QRCodeStyling = require('qr-code-styling');
const { JSDOM } = require('jsdom');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const generateQR = async (config) => {
    console.log("QR generation started");

    const dom = new JSDOM("<!DOCTYPE html><div id='qr'></div></body></html>");
    global.window = dom.window;
    global.document = dom.window.document;

    // Canvas bindings
    (global).HTMLCanvasElement = dom.window.HTMLCanvasElement;
    (global).CanvasRenderingContext2D =
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
        image,
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

    fs.writeFileSync(filePath, buffer);

    console.log("QR saved:", filePath);

    return filePath;
};

module.exports = { generateQR };
