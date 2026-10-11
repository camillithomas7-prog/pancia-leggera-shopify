#!/usr/bin/env python3
"""Trasforma ~/pancia-leggera/index.html nel tema Shopify Pancia Leggera.
La landing vive nello snippet pl-page: la usano sia la pagina prodotto sia la home."""
import pathlib, re, shutil, json, sys

ROOT = pathlib.Path(__file__).parent
SRC = pathlib.Path.home() / "pancia-leggera"
HANDLE = "pancia-leggera"


def scope_css(css, scope, _top=True):
    """Prefissa ogni selettore con lo scope, saltando at-rule e keyframes."""
    if _top:
        css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out, i, n = [], 0, len(css)
    while i < n:
        if css[i].isspace():
            out.append(css[i]); i += 1
            continue
        if css[i] == "@":
            j = css.find("{", i)
            if j < 0:
                out.append(css[i:]); break
            at = css[i:j].strip()
            depth, k = 1, j + 1
            while k < n and depth:
                if css[k] == "{": depth += 1
                elif css[k] == "}": depth -= 1
                k += 1
            inner = css[j + 1:k - 1]
            if re.match(r"(?i)@(media|supports|layer|container)", at):
                inner = scope_css(inner, scope, False)
            out.append(at + "{" + inner + "}")
            i = k
            continue
        j = css.find("{", i)
        if j < 0:
            out.append(css[i:]); break
        sel = css[i:j]
        k = css.find("}", j)
        if k < 0:
            k = n
        body = css[j + 1:k]
        parts = []
        for one in sel.split(","):
            t = one.strip()
            if not t:
                continue
            if t.startswith(("@", scope)):
                parts.append(t)
            elif t in (":root", "html", "body", "*"):
                parts.append(scope if t in (":root", "body") else t)
            elif t.startswith(("html", "body")):
                parts.append(re.sub(r"^(html|body)\b", scope, t).strip())
            else:
                parts.append(scope + " " + t)
        out.append(", ".join(parts) + "{" + body + "}")
        i = k + 1
    return "".join(out)



def main():
    src = (SRC / "index.html").read_text(encoding="utf-8")
    css = "\n".join(re.findall(r"(?is)<style[^>]*>(.*?)</style>", src))
    js = "\n".join(re.findall(r"(?is)<script(?![^>]*src)[^>]*>(.*?)</script>", src))
    body = re.search(r"(?is)<body[^>]*>(.*)</body>", src).group(1)
    body = re.sub(r"(?is)<script.*?</script>", "", body)

    from PIL import Image
    import numpy as np
    for f in (SRC / "img" / "raw").glob("ic-*.png"):
        out = SRC / "img" / f.name
        if out.exists() and out.stat().st_mtime > f.stat().st_mtime:
            continue
        im = Image.open(f).convert("RGB"); im.thumbnail((320, 320), Image.LANCZOS)
        a = np.asarray(im).astype(float) / 255
        # "colore → alfa" sul bianco: il fondo sparisce, le ombre restano morbide
        alpha = np.clip((1 - a.min(axis=2)) * 1.25, 0, 1)
        alpha[alpha < .04] = 0
        rgb = np.where(alpha[..., None] > 0, (a - (1 - alpha[..., None])) / np.maximum(alpha[..., None], 1e-3), 0)
        rgba = np.dstack([np.clip(rgb, 0, 1), alpha])
        Image.fromarray((rgba * 255).astype("uint8"), "RGBA").save(out, optimize=True)
    used = sorted(set(re.findall(r"img/([\w.-]+\.(?:jpg|png))", src)))
    for name in used:
        shutil.copy(SRC / "img" / name, ROOT / "assets" / name)
    body = re.sub(r"img/([\w.-]+\.(?:jpg|png))", r"{{ '\1' | asset_url }}", body)

    # immagini sotto la piega: caricamento differito (hero esclusa)
    hero_end = body.index('<div class="marq"')
    body = body[:hero_end] + body[hero_end:].replace('<img src=', '<img loading="lazy" src=')
    (ROOT / "assets" / "pl-page.css").write_text(scope_css(css, ".pl"), encoding="utf-8")
    (ROOT / "assets" / "pl-page.js").write_text(js, encoding="utf-8")

    form = ('<form id="pl-atc" action="{{ routes.cart_add_url }}" method="post" hidden>'
            '<input type="hidden" name="form_type" value="product">'
            '<input type="hidden" name="utf8" value="&#10003;">'
            '<input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">'
            '<input type="hidden" name="quantity" value="1">'
            '<input type="hidden" name="return_to" value="/checkout">'
            '</form>')
    # prezzi presi dal prodotto, non fissi nel markup
    body = body.replace("29,99 €", "{{ product.price | money }}").replace("29,99&nbsp;€", "{{ product.price | money }}")
    head = ("{{ 'pl-page.css' | asset_url | stylesheet_tag }}\n"
            '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'
            "<script>window.PL_A=\"{{ 'ph-piatto.jpg' | asset_url | split: 'ph-piatto.jpg' | first }}\";</script>\n")
    liq = head + form + '<div class="pl">' + body + "</div>\n<script src=\"{{ 'pl-page.js' | asset_url }}\" defer></script>\n"
    assert len(liq) < 130000, len(liq)
    (ROOT / "snippets" / "pl-page.liquid").write_text(liq, encoding="utf-8")
    print("ok — snippet %d KB, css %d KB, %d immagini" % (len(liq)//1024, len(css)//1024, len(used)))

if __name__ == "__main__":
    main()
