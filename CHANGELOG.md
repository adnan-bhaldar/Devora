# Changelog

All notable changes to Devora are listed here, newest first. Each heading is a version number.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). When you change something users can notice, add a line under **Unreleased**. At release time, move those lines under a new version heading (for example `## 1.9.7`).

## Unreleased

## 1.9.7

### Added

- **Download as PNG, JPG or WebP.** The Base64 Image Converter can now save a decoded image in another format, with a quality setting for JPG and WebP.
- Link previews: shared links to Devora now carry a page address and an image, so they show a proper preview.

### Changed

- The Base64 Image Converter's example is now the Devora app icon.
- The About page says exactly what stays in your browser: what you type never leaves it.

### Fixed

- Opening `/sitemap.xml` or `/robots.txt` in a browser that had installed Devora no longer shows "page not found".

## 1.9.6

### Added

- **Category pages.** Browse tools by category from the home page. Each category has its own page that lists all of its tools, and every tool page shows a Home / Category / Tool breadcrumb.
- **Install and offline use.** Devora can be installed as an app, and after your first visit every tool opens and works without an internet connection. Your data still never leaves your browser.
- **Copy link for tool settings.** The Hash, Password, UUID and Lorem Ipsum tools have a Copy link button that shares your settings (such as the algorithm or length). Your text, passwords and generated results are never included.
- A `sitemap.xml` and `robots.txt` are generated at build time, and the site has social preview tags.

### Changed

- The About page was redesigned and now links to the GitHub repository, the contribution guide and the developer.
- The changelog moved from a page on the site to this file. The old `/whats-new` address now opens the About page.

## 1.8.0

### Added

- **UUID Generator.** Generate one to a hundred random version 4 UUIDs, with uppercase and no-hyphen options and one-click copy.

## 1.6.0

### Added

- **Password Generator.** Create random passwords with a length slider, character types and an estimated strength. They are generated with a cryptographic random number generator and are never stored or sent anywhere.
- **Lorem Ipsum Generator.** Generate placeholder words, sentences or paragraphs with the classic opening line option.

## 1.4.0

### Added

- **Hash Generator.** SHA-256, SHA-384 and SHA-512 hashes of text as you type, shown as hex or Base64, using the Web Crypto API.
- **QR Code Decoder.** Read the contents of a QR code from an image. The result is labelled by type and shown as plain text.

## 1.2.0

### Added

- **QR Code Generator.** Turn text or a URL into a QR code with adjustable error correction, margin and colors. Download as PNG or SVG.
- **JWT Decoder.** Read a token's header, payload and signature, with readable dates and an expiry status. It decodes only and does not verify signatures.
- **Binary ↔ Text Converter.** Convert both ways as you type, with a spaced or continuous output option.
- **Base64 Image Converter.** Convert images to Base64 or data URIs, and turn Base64 back into an image you can preview and download.
- **Base64 Encoder & Decoder.** Encode and decode as you type, with a URL-safe option.

### Changed

- The CSS Gradient Generator now also creates reflected and diamond gradients.

## 1.0.0

### Added

- **CSS Gradient Generator.** Build linear and radial gradients with up to eight color stops, then copy the CSS or a shareable link.
- **Devora foundation.** Tool directory, search, command palette, favorites, recently used tools, and light and dark themes.
