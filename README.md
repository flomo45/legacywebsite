# Legacy Beauty Academy – Professional Makeup Business Website

A complete, elegant multi-page website for **Legacy Beauty Academy**, founded by Elizabeth Tengbeh.

## Features

- **Luxury black & gold design** matching the academy branding and provided logo/photos
- **Home** – Hero, services overview, founder highlight
- **About** – Founder bio, mission, Certificate of Completion
- **Services** – All 6 professional makeup types + academy programs
- **Products** – Makeup products with prices, filterable by category (Face, Eyes, Lips, Tools)
- **Gallery** – Founder photos, logo, certificate, services menu (click to enlarge)
- **Student Registration** – Full form with:
  - Client-side validation
  - Password strength meter
  - Input sanitization (XSS prevention)
  - Terms agreement
  - Demo storage in localStorage (with clear security notes)
- **Contact** – Phone, location, message form
- **Security measures**:
  - Content-Security-Policy meta tag on every page
  - Password never stored in plain text (demo only)
  - Form validation & sanitization
  - HTTPS recommendation notes
  - Secure coding practices documented

## How to Use

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
2. All pages are linked via the navigation menu.
3. Registration works offline for demo purposes (data saved in browser localStorage).
4. For a live production site, host on a server with HTTPS and connect the forms to a real backend.

## File Structure

```
legacy-beauty-academy/
├── index.html
├── about.html
├── services.html
├── products.html
├── gallery.html
├── register.html
├── contact.html
├── css/style.css
├── js/main.js
├── images/
│   ├── logo.jpg
│   ├── founder-portrait.jpg
│   ├── founder-artist.jpg
│   ├── founder-blazer.jpg
│   ├── founder-casual.jpg
│   ├── services-menu.jpg
│   └── certificate.jpg
└── README.md
```

## Contact (from branding)

- **Phone:** 0770 220 135
- **Location:** Barnesville Band and Stop
- **Founder:** Elizabeth Tengbeh

---

© 2025 Legacy Beauty Academy. All rights reserved.
