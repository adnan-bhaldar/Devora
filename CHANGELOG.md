# Changelog

All notable changes to Devora are listed here, newest first. Each heading is a version number.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). When you change something users can notice, add a line under an **Unreleased** heading at the top. At release time, rename it to the new version number (for example `## 1.10.1`).

## 1.18.2

### Fixed

- The "new version" message now appears for every release, not only some. A new version that was already downloading when the page opened was missed, and saved files could fail to match on servers that send a `Vary` header, which could leave a page blank right after a release.

## 1.18.1

### Changed

- Styles that belong to one tool, page, or component now live next to it (for example `src/tools/diff-checker/styles.css`), and `src/index.css` keeps only the shared styles and imports the rest. `src/index.css` is also organized into numbered sections. The built CSS is unchanged.

## 1.18.0

### Added

- **New version message.** When a new version of Devora has been downloaded in the background, a message offers **Reload now** (which loads the new version, like a hard refresh) or **Later**. Before, a new version only appeared after every Devora tab had been closed, or after a hard refresh. Open tabs also check for a new version when you come back to them and every 30 minutes.

## 1.17.0

### Added

- **Internet Speed Test.** Measure your download speed, upload speed, ping, and jitter, plus how much your ping rises while downloading and uploading. A live dial, a stage bar, and result tiles with small bar charts animate as the test runs. Switch between Mbps and MB/s, stop a test early, and copy the results. It is powered by Cloudflare’s open-source speed test and sends test data to speed.cloudflare.com, and it is in a new **Network** category.

### Changed

- The Content Security Policy now allows connections to `https://speed.cloudflare.com`, which the speed test needs.

## 1.16.0

### Added

- **Diff Checker.** Compare two texts or files and see which lines were added or removed and which words changed inside a line, side by side or in one unified column. Ignore whitespace or letter case, fold unchanged lines, wrap long lines, and swap the two texts. Copy the result or download it as a .patch file, and a link shares your display choices (never your text).

## 1.15.0

### Added

- **ASCII Art Generator.** Turn text into banner lettering in 17 fonts (Standard, Slant, Big, Block, Shadow, 3-D, and more) with letter spacing and a fill character of your choice, or turn a picture into characters with a width, contrast, brightness, character set, and invert option. Copy the art or download it as a .txt file, and a link shares your choices.

## 1.14.0

### Added

- **CSS Unit Converter.** Convert between px, rem, em, %, pt, pc, in, cm, mm, Q, vw, vh, vmin, and vmax. Set the root font size, parent font size, and window size that the relative units need, list a number in every unit at once, and copy the result with or without its unit. A table shows common pixel sizes as rem, em, pt, and percent, and a link shares your units and settings.

## 1.13.0

### Added

- **Dummy Data Generator.** Make fake test records from 32 fields (names, addresses, phone numbers, emails, IDs, dates and more) in 12 countries and languages. Choose the order and names of the columns, set limits, add a seed for repeatable results, and leave a share of values empty. Export as JSON, JSON Lines, CSV, HTML, SQL INSERT (PostgreSQL, MySQL, SQLite), XML, YAML, a Markdown table, TypeScript, or JavaScript. Everything is made in your browser.

### Changed

- **FFmpeg Commands.** “What the options mean” now opens one command at a time: opening another closes the first, and Escape closes the open one. The browser’s plain triangle is replaced by a chevron that turns smoothly, like on the HTTP Status Codes page.
- **Unix Timestamp Converter.** The time zone list now shows each zone’s UTC offset (for example UTC+05:30) in fainter text at the right of every row and of the closed box. You can search by offset, such as +5:30, and by modern names such as Kolkata, Kyiv, and Kathmandu.

### Removed

- Unused styles left over from the docs example block, the changelog list, and the chip dot.

## 1.12.0

### Added

- **Morse Code Translator.** Turn text into Morse code and Morse code back into text. Play the beeps at the speed and pitch you choose, flash a light in time with them, or download the sound as a .wav file. A chart lists every letter, number, and symbol, and a link shares your speed and pitch.

## 1.11.0

### Added

- **Case Converter.** Change text to UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg and iNVERSE case, and to camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, Header-Case, COBOL-CASE, dot.case, and path/case, all at once, with a copy button for each. Names such as XMLHttpRequest are split into words correctly.
- **Unix Timestamp Converter.** Turn a Unix timestamp (seconds, milliseconds, microseconds, or nanoseconds) into a date, or a date into a timestamp, in any time zone, with a live clock and a link that shares your time zone.
- **Bcrypt Hash Generator.** Make bcrypt hashes with the cost and version you choose, and check whether a password matches a bcrypt hash. It runs in your browser, so your password is never sent anywhere.

## 1.10.0

### Added

- **FFmpeg Commands.** A searchable reference of copy-ready FFmpeg commands for converting, compressing, resizing, cutting, joining, extracting audio, making GIFs, adding subtitles, and more. Each command explains what its options do, and every group has its own colour. It lives in the Reference category.
- **WhatsApp & Telegram Link Generator.** Make a chat link with a message already typed in, for WhatsApp by phone number or username, or for Telegram by username, phone number, or shared link, and download a QR code for it as PNG or SVG. Phone numbers have a separate country-code list.
- **.gitignore Generator.** Build a .gitignore file by choosing languages, frameworks, editors, and operating systems, or start from a ready-made combination. Add your own rules, then copy or download the file, or share your choices with a link.

### Changed

- The About page no longer has a developer card.

## 1.9.8

### Added

- **Slug Generator.** Turn titles and text into clean, URL-friendly slugs, with a choice of separator, an optional length limit, and a link that shares your options.
- **HTTP Status Codes.** A searchable reference of every HTTP status code, with what each means and when to use it. It lives in a new Reference category.

### Fixed

- On tablet-sized screens the page no longer scrolls sideways because of the hidden theme-button tooltip in the header.
- The Slug Generator keeps words in other scripts (such as Hindi) in one piece when "Keep non-Latin letters" is on, and a length limit never cuts a character in half.

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
