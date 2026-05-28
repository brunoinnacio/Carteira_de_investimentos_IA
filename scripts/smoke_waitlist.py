"""Smoke test end-to-end do formulario de waitlist em producao."""
from __future__ import annotations

import sys
from playwright.sync_api import sync_playwright

URL = "https://fiibrasil.vercel.app"
EMAIL = "smoketest@fiibrasil.dev"


def main() -> int:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto(URL, wait_until="networkidle", timeout=30_000)
        print(f"[OK] {URL} carregada")

        page.fill("input[type='email']", EMAIL)
        page.click("button[type='submit']")
        print(f"[OK] formulario submetido com {EMAIL}")

        try:
            page.wait_for_selector(
                "[role='status']",
                timeout=15_000,
            )
            msg = page.locator("[role='status']").inner_text()
            print(f"[RESULT] mensagem do servidor: {msg}")
            ok = "lista" in msg.lower() or "ja esta" in msg.lower()
        except Exception as e:
            print(f"[FAIL] nao apareceu mensagem de retorno: {e}")
            ok = False

        browser.close()
        return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
