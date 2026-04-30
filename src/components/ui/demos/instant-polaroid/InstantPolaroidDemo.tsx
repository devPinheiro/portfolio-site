import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import polaroidCameraSkin from "../../../../assets/polaroid-camera.webp";

type CameraState = "idle" | "ready" | "printing" | "printed" | "error";

function fitCover(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): [number, number, number, number] {
  const srcRatio = srcW / srcH;
  const dstRatio = dstW / dstH;
  if (srcRatio > dstRatio) {
    const cropW = srcH * dstRatio;
    return [(srcW - cropW) * 0.5, 0, cropW, srcH];
  }
  const cropH = srcW / dstRatio;
  return [0, (srcH - cropH) * 0.5, srcW, cropH];
}

function renderPolaroid(
  source: CanvasImageSource,
  sourceW: number,
  sourceH: number,
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const frameW = 980;
  const frameH = 1240;
  const sidePad = 56;
  const topPad = 56;
  const bottomPad = 210;
  const photoW = frameW - sidePad * 2;
  const photoH = frameH - topPad - bottomPad;
  const photoX = sidePad;
  const photoY = topPad;

  canvas.width = frameW;
  canvas.height = frameH;

  ctx.fillStyle = "#f7f6f2";
  ctx.fillRect(0, 0, frameW, frameH);

  const [sx, sy, sw, sh] = fitCover(sourceW, sourceH, photoW, photoH);
  // Keep detail first, then layer subtle film traits.
  ctx.filter = "saturate(1.03) contrast(1.01) brightness(1.01)";
  ctx.drawImage(source, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
  ctx.filter = "none";

  // Grayscale instant look with a slight warm paper cast.
  ctx.fillStyle = "rgba(14, 14, 14, 0.08)";
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.globalCompositeOperation = "saturation";
  ctx.fillStyle = "#808080";
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(255, 236, 205, 0.08)";
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Soft highlight bloom near top-left, common in instant snapshots.
  const highlight = ctx.createRadialGradient(
    photoX + photoW * 0.24,
    photoY + photoH * 0.2,
    photoW * 0.05,
    photoX + photoW * 0.24,
    photoY + photoH * 0.2,
    photoW * 0.75,
  );
  highlight.addColorStop(0, "rgba(255,250,236,0.2)");
  highlight.addColorStop(1, "rgba(255,250,236,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Very light edge vignette.
  const vignette = ctx.createRadialGradient(
    photoX + photoW * 0.5,
    photoY + photoH * 0.5,
    photoW * 0.42,
    photoX + photoW * 0.5,
    photoY + photoH * 0.5,
    photoW * 0.76,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(18,12,8,0.14)");
  ctx.fillStyle = vignette;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Controlled grain: lower intensity and luma-weighted.
  const imageData = ctx.getImageData(photoX, photoY, photoW, photoH);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const grainAmount = luma > 170 ? 2.4 : luma < 60 ? 1.6 : 2.1;
    const grain = (Math.random() - 0.5) * grainAmount;
    data[i] = Math.max(0, Math.min(255, data[i] + grain * 1.05));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain * 0.9));
  }
  ctx.putImageData(imageData, photoX, photoY);

  // Mild fade toward lifted blacks to mimic instant print chemistry.
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(photoX, photoY, photoW, photoH);

  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, frameW - 2, frameH - 2);

  return canvas.toDataURL("image/jpeg", 0.92);
}

export function InstantPolaroidDemo() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const printTimerRef = useRef<number | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");

  const [hasFlash, setHasFlash] = useState(false);
  const [printedUrl, setPrintedUrl] = useState<string>("");
  const [photoVersion, setPhotoVersion] = useState(0);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      if (printTimerRef.current) window.clearTimeout(printTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState("ready");
      // setStatusText("Camera ready. Press shutter.");
    } catch (error) {
      console.error(error);
      setCameraState("error");
      // setStatusText("Camera unavailable. Use upload fallback below.");
    }
  };

  const confirmCameraPermission = () => {
    setShowPermissionPrompt(false);
     // setStatusText("Requesting camera permission...");
    void startCamera();
  };

  const declineCameraPermission = () => {
    setShowPermissionPrompt(false);
   
  };

  const processCapture = (source: CanvasImageSource, w: number, h: number) => {
    const dataUrl = renderPolaroid(source, w, h);
    if (!dataUrl) {
      setCameraState("error");
    
      return;
    }
    setCameraState("printing");
  
    setPhotoVersion((v) => v + 1);
    if (printTimerRef.current) window.clearTimeout(printTimerRef.current);
    printTimerRef.current = window.setTimeout(
      () => {
        setPrintedUrl(dataUrl);
        setCameraState("printed");
      
      },
      reduceMotion ? 120 : 380,
    );
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    setHasFlash(true);
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(
      () => setHasFlash(false),
      reduceMotion ? 70 : 240,
    );

    processCapture(video, video.videoWidth, video.videoHeight);
  };

  const onUploadImage = (file: File | null) => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      processCapture(img, img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <section aria-label="Instant Polaroid camera demo">
      <p className="mb-6 max-w-3xl text-sm text-black/65 dark:text-white/65">
        Capture a real webcam photo and watch it print from the camera body with
        an instant-film look.{" "}
        <Link
          to="/demos"
          className="underline underline-offset-4 hover:opacity-80"
        >
          Back to demos
        </Link>
      </p>

      <div className="rounded-2xl border border-black/10 bg-white p-6 min-h-[960px]">
        <div className="mx-auto w-full max-w-2xl">
          <div className="relative aspect-[1.05/1.2]">
            <AnimatePresence>
              {showPermissionPrompt ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: reduceMotion ? 0 : -28,
                    y: reduceMotion ? 0 : -20,
                    scale: reduceMotion ? 1 : 0.96,
                  }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -18, y: -12, scale: 0.96 }}
                  transition={{
                    duration: reduceMotion ? 0.01 : 0.28,
                    ease: [0.2, 0.9, 0.2, 1],
                  }}
                  className="absolute left-3 top-3 z-20 w-[220px] rounded-xl border border-black/10 bg-white/95 p-3 shadow-lg backdrop-blur"
                >
                  <p className="text-[11px] font-medium text-black">
                    Enable camera for live preview?
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={confirmCameraPermission}
                      className="rounded-full bg-black px-2.5 py-1 text-[10px] font-medium text-white hover:opacity-90"
                    >
                      Allow
                    </button>
                    <button
                      type="button"
                      onClick={declineCameraPermission}
                      className="rounded-full border border-black/20 bg-white px-2.5 py-1 text-[10px] font-medium text-black hover:bg-black/5"
                    >
                      Not now
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <img
              src={polaroidCameraSkin}
              alt="Instant camera skin"
              className="pointer-events-none absolute left-0 -top-[9.4%] h-full w-full object-contain select-none"
              draggable={false}
            />

            <div className="absolute right-[20%] top-[16.2%] h-[12.0%] w-[13.2%] overflow-hidden rounded-[26px] bg-black shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute left-[21.2%] top-[34.3%] h-[6.8%] w-[6.8%] rounded-full">
              <button
                type="button"
                onClick={takePhoto}
                disabled={cameraState !== "ready" && cameraState !== "printed"}
                aria-label="Capture photo"
                className="h-full w-full rounded-full border border-black/20 bg-black/25 transition hover:bg-black/35 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="sr-only">Shutter</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUploadImage(e.target.files?.[0] ?? null)}
            />

            <div className="absolute left-[50%] top-[60.6%] h-[4px] w-[28.2%] -translate-x-1/2 rounded-full bg-black/55" />

            <div className="absolute left-[19.1%] top-[60.2%] h-[60%]  w-[60.8%] overflow-hidden">
              <AnimatePresence mode="wait">
                {printedUrl ? (
                  <motion.div
                    key={photoVersion}
                    initial={{ y: "-102%", opacity: 0.4, filter: "blur(6px)" }}
                    animate={{
                      y: ["-102%", "-8%", "0%"],
                      opacity: [0.5, 1, 1],
                      filter: "blur(0px)",
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reduceMotion ? 0.16 : 1,
                      ease: [0.22, 0.8, 0.22, 1],
                      times: [0, 0.8, 1],
                    }}
                    className="relative mx-auto w-full rounded-sm shadow-[0_18px_35px_-18px_rgba(0,0,0,0.55)]"
                  >
                    <img
                      src={printedUrl}
                      alt="Printed polaroid"
                      className="h-full w-full"
                    />
                    <a
                      href={printedUrl}
                      download="instant-polaroid.jpg"
                      aria-label="Download printed polaroid"
                      className="absolute right-2 top-2 rounded-full border border-black/20 bg-white/92 p-1.5 text-black shadow-sm backdrop-blur transition hover:bg-white"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M10 3v8m0 0 3-3m-3 3-3-3M4 13.5V15a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1.5"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.7"
                        />
                      </svg>
                    </a>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* <p className="mt-6 text-center text-xs text-black/55">{statusText}</p> */}
      </div>

      <AnimatePresence>
        {hasFlash ? (
          <motion.div
            key="screen-flash"
            initial={{ opacity: reduceMotion ? 0.5 : 0 }}
            animate={{
              opacity: reduceMotion ? 0 : [0, 0.96, 0.7, 0.26, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0.14 : 0.28,
              times: reduceMotion ? undefined : [0, 0.12, 0.3, 0.62, 1],
              ease: "easeOut",
            }}
            className="pointer-events-none fixed inset-0 z-50 bg-white"
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
