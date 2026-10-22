# Lost Wild — Bootstrap Version

Responsive classic movie rental prototype built with HTML, custom CSS, JavaScript, and Bootstrap 5.3.3.

## Structure

```text
lost-wild-bootstrap/
├── index.html
├── style.css
├── js/
│   └── app.js
├── pages/
│   └── README.txt
└── assets/
    └── README.txt
```

## How to Run

1. Extract the ZIP file.
2. Open the folder in VS Code.
3. Run `index.html` with Live Server or open it directly in your browser.
4. An internet connection is required to load Bootstrap 5.3.3 and Google Fonts via CDN.

## Demo Features

- Login and account creation with simple validation.
- Simulated Google Sign-In.
- Catalog with 20 classic movies, search, gender/format filtering, and sorting.
- Wishlist, movie details, shopping bag, and demo checkout.
- Shelf for reservations, rentals, and purchases; dummy address and pickup deadline.
- Editable profile, pending/settled fines, dispute system, and fee table.
- Adding and removing test credit cards.
- Logout and local persistence via `localStorage`.

## Security and Limitations

This project is a front-end prototype. The demo account password is stored in `localStorage` solely to demonstrate the workflow and **is not secure for production**. Google Sign-In does not actually authenticate with Google; checkout and cards do not process real payments. To launch a real application, implement a backend, secure authentication, OAuth integration, and a PCI DSS-compliant payment processor. No actual account locks are enforced. Fines are purely demonstrative and disputable via the UI.

## Design and Accessibility

Palette inspired by the provided references: deep green, teal, mint, ochre, and oxide red. The layout utilizes Bootstrap breakpoints, visible focus states, form labels, a skip-to-content link, status messages, keyboard navigation, and the `prefers-reduced-motion` media feature.

## Preview

<video>
    <source src="assets/gpt_bootstrap_video.mp4" />
</video>