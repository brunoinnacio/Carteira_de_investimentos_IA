"""
Captura screenshots reais do site (dev server em http://localhost:3000)
para usar no README / portfolio.

Uso:
    npm run dev            # em outro terminal
    python scripts/screenshots.py

Salva PNGs em docs/screenshots/.
"""

import os
import time
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://localhost:3000")
OUT = os.path.join(os.path.dirname(__file__), "..", "docs", "screenshots")
os.makedirs(OUT, exist_ok=True)

VIEWPORT = {"width": 1440, "height": 900}


def shot(page, path, full_page=False):
    page.wait_for_load_state("networkidle")
    time.sleep(1.2)  # deixa cotacoes/animacoes assentarem
    page.screenshot(path=os.path.join(OUT, path), full_page=full_page)
    print("ok:", path)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport=VIEWPORT, device_scale_factor=2, locale="pt-BR"
        )
        page = ctx.new_page()

        page.goto(f"{BASE}/", wait_until="domcontentloaded")
        shot(page, "home.png")

        # Carteira: carrega o modo simulacao para popular a tela.
        page.goto(f"{BASE}/carteira", wait_until="domcontentloaded")
        try:
            page.get_by_role("button", name="Simular investimento").first.click(
                timeout=5000
            )
            time.sleep(1.5)
        except Exception as e:
            print("aviso: nao cliquei em simular:", e)
        shot(page, "carteira.png", full_page=True)

        # Calendario herda os dados da simulacao (mesmo localStorage).
        page.goto(f"{BASE}/calendario", wait_until="domcontentloaded")
        shot(page, "calendario.png")

        page.goto(f"{BASE}/oportunidades", wait_until="domcontentloaded")
        shot(page, "oportunidades.png", full_page=True)

        page.goto(f"{BASE}/radar", wait_until="domcontentloaded")
        shot(page, "radar.png")

        page.goto(f"{BASE}/calculadora-renda", wait_until="domcontentloaded")
        shot(page, "calculadora.png")

        browser.close()


if __name__ == "__main__":
    main()
