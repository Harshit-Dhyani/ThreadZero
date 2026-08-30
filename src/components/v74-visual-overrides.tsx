"use client";

export function V74VisualOverrides() {
  return <style>{`
    .v74-report-body > div {
      padding-top: 1.5rem;
    }

    .v74-report-body > div > nav[aria-label="Breadcrumb"] {
      display: none;
    }

    .v74-report-body h1 {
      max-width: 28ch;
      font-size: 1.85rem;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    .v74-report-body h1 + p {
      margin-top: 0.75rem;
    }

    .v74-secondary-body > div {
      max-width: none;
      margin-left: 0;
      margin-right: 0;
      padding: 0;
    }

    .v74-secondary-body > div > nav:nth-of-type(2) {
      display: none;
    }

    footer > div:first-child > section:last-child {
      position: relative;
      display: block !important;
      min-height: 14rem;
      overflow: hidden;
      isolation: isolate;
      background: linear-gradient(135deg, rgb(244 249 255) 0%, rgb(255 255 255) 46%, rgb(238 247 255) 100%);
    }

    footer > div:first-child > section:last-child::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(90deg, rgba(255,255,255,.99) 0%, rgba(255,255,255,.95) 38%, rgba(255,255,255,.48) 62%, rgba(255,255,255,0) 82%);
    }

    footer > div:first-child > section:last-child > div:first-child {
      position: relative;
      z-index: 2;
      width: min(62%, 19rem);
    }

    footer > div:first-child > section:last-child > div:last-child {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 0;
      display: flex;
      width: 60%;
      height: 100%;
      align-items: flex-end;
      justify-content: flex-end;
      pointer-events: none;
      opacity: .98;
    }

    footer > div:first-child > section:last-child > div:last-child picture,
    footer > div:first-child > section:last-child > div:last-child img {
      width: 100% !important;
      height: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: right bottom;
    }

    @media (min-width: 640px) {
      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:first-child {
        padding: 1.25rem 1.5rem;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:nth-child(2) {
        display: block;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:nth-child(2) > ol {
        padding: 1.25rem 1.5rem .9rem;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:nth-child(2) > div {
        display: flex;
        align-items: center;
        gap: 1.75rem;
        border-top: 1px solid var(--line, #dce3ec);
        border-left: 0;
        background: white;
        padding: .9rem 1.5rem;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:nth-child(2) > div > h3 {
        flex: 0 0 auto;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:nth-child(2) > div > dl {
        display: flex;
        flex: 1;
        align-items: center;
        gap: 1.5rem;
        margin-top: 0;
        text-align: left;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:nth-child(2) > div > dl > div {
        display: flex;
        align-items: baseline;
        gap: .45rem;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] > div:nth-child(2) > div > dl dd {
        margin-top: 0;
        font-size: 1.05rem;
      }
    }

    @media (min-width: 1024px) {
      .v74-track-frame > div > header {
        margin-top: 1.5rem;
        padding-bottom: 1.5rem;
      }

      .v74-track-frame section[aria-labelledby="preparation-progress-title"] {
        margin-top: 1.5rem;
      }
    }

    @media (max-width: 639px) {
      footer > div:first-child > section:last-child {
        min-height: 16.5rem;
        padding-bottom: 7.5rem;
      }

      footer > div:first-child > section:last-child > div:first-child {
        width: 82%;
      }

      footer > div:first-child > section:last-child > div:last-child {
        width: 78%;
        height: 58%;
      }

      footer > div:first-child > section:last-child::after {
        background: linear-gradient(180deg, rgba(255,255,255,.99) 0%, rgba(255,255,255,.96) 45%, rgba(255,255,255,.35) 72%, rgba(255,255,255,0) 100%);
      }
    }
  `}</style>;
}
