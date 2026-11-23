"""Check references against the staged GitHub Pages artifact."""

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class SiteLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.canonical = ""
        self.share_image = ""

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if attrs.get("property") == "og:image":
            self.share_image = attrs.get("content", "")
        for key in ("href", "src", "poster"):
            if attrs.get(key):
                self.links.append(attrs[key])


def check(site):
    html = SiteLinks()
    html.feed((site / "index.html").read_text(encoding="utf-8"))
    origin = urlsplit(html.canonical)
    image = urlsplit(html.share_image)
    if not origin.netloc or origin.scheme != "https":
        raise ValueError("index.html must declare an absolute HTTPS canonical URL")
    if image.scheme != "https" or image.netloc != origin.netloc or not image.path:
        raise ValueError("og:image must use an absolute HTTPS URL on the portfolio site")

    projects = re.findall(r"""\bslug:\s*['"]([^'"]+)['"]""", (site / "archive.js").read_text(encoding="utf-8"))
    fragments = html.ids | {"project/" + slug for slug in projects}
    references = [("index.html", link) for link in [*html.links, html.share_image]]
    for css in site.glob("*.css"):
        for link in re.findall(r"""url\(\s*['"]?([^'")\s]+)['"]?\s*\)""", css.read_text(encoding="utf-8")):
            references.append((css.name, link))
    for js in site.glob("*.js"):
        for link in re.findall(r"""['"]((?:art|downloads)/[^'"]+)['"]""", js.read_text(encoding="utf-8")):
            references.append((js.name, link))

    errors = []
    for source, link in references:
        if link.startswith("#"):
            if link != "#" and unquote(link[1:]) not in fragments:
                errors.append(f"{source}: unknown destination {link}")
            continue
        url = urlsplit(link)
        if (url.netloc or url.scheme) and link != html.share_image:
            continue  # Live demos on the same GitHub Pages host belong to other repos.
        target = (site / unquote(url.path).lstrip("/")).resolve()
        if url.path.endswith("/"):
            target = (target / "index.html").resolve()
        if not target.is_relative_to(site) or not target.is_file() or not target.stat().st_size:
            errors.append(f"{source}: missing asset {link}")
    if errors:
        sys.exit("\n".join(errors))


if __name__ == "__main__":
    check(Path(sys.argv[1]).resolve())
