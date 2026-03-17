import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const logoPath = path.join(publicDir, "aegis-logo-2500w-opti.png");

async function generateIcons() {
    try {
        console.log("🎨 PWA 아이콘 생성 중...\n");

        // 192x192 아이콘 생성
        await sharp(logoPath)
            .resize(192, 192, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255 },
            })
            .png()
            .toFile(path.join(publicDir, "pwa-192x192.png"));
        console.log("✓ pwa-192x192.png");

        // 512x512 아이콘 생성
        await sharp(logoPath)
            .resize(512, 512, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255 },
            })
            .png()
            .toFile(path.join(publicDir, "pwa-512x512.png"));
        console.log("✓ pwa-512x512.png");

        // 192x192 Maskable 아이콘 생성
        await sharp(logoPath)
            .resize(192, 192, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255 },
            })
            .png()
            .toFile(path.join(publicDir, "pwa-192x192-maskable.png"));
        console.log("✓ pwa-192x192-maskable.png");

        // 512x512 Maskable 아이콘 생성
        await sharp(logoPath)
            .resize(512, 512, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255 },
            })
            .png()
            .toFile(path.join(publicDir, "pwa-512x512-maskable.png"));
        console.log("✓ pwa-512x512-maskable.png");

        // Apple 터치 아이콘 생성 (iOS)
        await sharp(logoPath)
            .resize(180, 180, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255 },
            })
            .png()
            .toFile(path.join(publicDir, "apple-touch-icon.png"));
        console.log("✓ apple-touch-icon.png (iOS용)");

        console.log("\n✅ 모든 PWA 아이콘이 생성되었습니다!");
        console.log("   aegis-logo-2500w-opti.png를 기반으로 생성됨");
    } catch (error) {
        console.error("❌ 아이콘 생성 실패:", error.message);
        process.exit(1);
    }
}

generateIcons();
