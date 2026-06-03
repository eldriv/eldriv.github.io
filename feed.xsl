<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS</title>
        <style>
          :root {
            --bg: #08080a;
            --card: #16161c;
            --text: #f4f4f5;
            --muted: #9898a6;
            --accent: #f97316;
            --border: rgba(255,255,255,0.08);
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            padding: 2rem 1.25rem 3rem;
          }
          .wrap { max-width: 42rem; margin: 0 auto; }
          h1 { font-size: 1.75rem; margin: 0 0 0.35rem; letter-spacing: -0.02em; }
          .meta { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
          .note {
            background: rgba(249,115,22,0.12);
            border: 1px solid rgba(249,115,22,0.25);
            border-radius: 12px;
            padding: 1rem 1.15rem;
            font-size: 0.9rem;
            margin-bottom: 2rem;
          }
          .note a { color: var(--accent); }
          ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
          li a {
            display: block;
            padding: 1rem 1.15rem;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text);
            text-decoration: none;
          }
          li a:hover { border-color: rgba(249,115,22,0.35); }
          .date { display: block; font-size: 0.8rem; color: var(--muted); margin-top: 0.25rem; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="meta"><xsl:value-of select="/rss/channel/description"/></p>
          <p class="note">
            This is the RSS feed for feed readers (NetNewsWire, Feedly, etc.).
            <a href="/subscribe.html">Subscribe page</a> ·
            <a href="/">Back to site</a>
          </p>
          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <a href="{link}">
                  <xsl:value-of select="title"/>
                  <span class="date"><xsl:value-of select="pubDate"/></span>
                </a>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
