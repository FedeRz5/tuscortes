"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintQRButton({ qrUrl, orgName }: { qrUrl: string; orgName: string }) {
  function handlePrint() {
    const win = window.open("", "_blank", "width=500,height=600");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR - ${orgName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #fff;
              padding: 40px 32px;
            }
            .title {
              font-size: 22px;
              font-weight: 700;
              color: #18181b;
              margin-bottom: 6px;
              text-align: center;
            }
            .subtitle {
              font-size: 14px;
              color: #71717a;
              margin-bottom: 32px;
              text-align: center;
            }
            .qr-wrapper {
              border: 2px solid #e4e4e7;
              border-radius: 16px;
              padding: 24px;
              display: inline-block;
              box-shadow: 0 4px 24px rgba(0,0,0,0.07);
            }
            img { display: block; }
            .cta {
              margin-top: 28px;
              font-size: 15px;
              font-weight: 600;
              color: #3730a3;
              text-align: center;
            }
            .url {
              margin-top: 8px;
              font-size: 13px;
              color: #71717a;
              font-family: monospace;
              text-align: center;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <p class="title">${orgName}</p>
          <p class="subtitle">Escaneá para reservar tu turno</p>
          <div class="qr-wrapper">
            <img src="${qrUrl.replace("180x180", "300x300")}" width="300" height="300" alt="QR" />
          </div>
          <p class="cta">¡Reservá en segundos!</p>
          <p class="url">tuscortes.com</p>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 300);
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  }

  return (
    <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
      <Printer className="h-3.5 w-3.5" />
      Imprimir QR
    </Button>
  );
}
