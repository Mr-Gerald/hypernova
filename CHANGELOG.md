# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2024-07-30

### Changed

-   **Tracking Page UI/UX Overhaul**: Significantly improved the user experience on the Tracking Page by implementing progressive disclosure.
    -   Key details (Sender/Receiver names, Origin/Destination, Dates) and the shipment timeline are now shown by default for a cleaner initial view.
    -   A "Show Full Details" button now reveals more granular information like full contact details and comprehensive package specs.
-   **Responsive Layout Refinement**: The primary shipment details now use a responsive grid, displaying as a 2-column layout on mobile and a 3-column layout on larger screens for better readability.
-   **Admin Comment Logic**: The `updateShipmentStatus` logic in the mock API was modified. A new comment from an admin now overwrites the main shipment comment, ensuring the most recent update is always featured prominently.
-   **Improved Comment Visibility**: The main "Special Instructions" comment is now always visible on the tracking page, placed just above the shipment history.

### Fixed

-   **Mobile UI Bug**: Corrected a visual bug on the Tracking Page where the long, unbreakable Carrier Reference Number would overflow its container on mobile devices.

## [1.3.0] - 2024-07-30

### Added

-   **AI Chatbot Assistant**: Integrated a site-wide, floating chatbot powered by the Gemini API. This provides users with instant, 24/7 customer support.
-   **Conversational Streaming UI**: The chatbot features a clean, responsive interface and streams responses token-by-token for a dynamic user experience.
-   **Context-Aware Logic**: Implemented a new `services/chatService.ts` to manage the chat session and provide the AI with system instructions, ensuring it acts as a knowledgeable HyperNova Express agent.
-   **Chatbot Component**: Created a reusable `components/Chatbot.tsx` that encapsulates the entire chat UI, state management, and interaction logic.

## [1.2.0] - 2024-07-29

### Added

-   **Interactive Action Hub**: Implemented a dynamic, tab-based component in the hero section inspired by industry leaders. It includes functionalities for "Track," "Get a Quote," and "Book Shipment," making the homepage a functional tool for users.
-   **Quote Simulation**: The "Get a Quote" tab includes a simple form to simulate shipping costs, adding immediate value for potential customers.

### Changed

-   **Homepage Hero Section**: Replaced the static tracking form with the new, multi-functional "Action Hub".
-   **Image Reliability**: Proactively replaced all `istockphoto` and other unreliable image links with high-quality, stable alternatives to prevent broken images due to hotlink protection.
-   **Process Section Layout**: Refined the "Simple & Transparent Process" section with a more professional two-column layout, integrating a new team photo.

## [1.1.1] - 2024-07-29

### Changed

-   Updated the homepage hero section to use a specific, user-provided background image (`logistics banner`).
-   Adjusted the hero section headline and sub-headline to better align with the new global logistics theme.
-   Fine-tuned the hero section overlay by adding a `backdrop-blur` effect to improve text legibility against the detailed background.

## [1.1.0] - 2024-07-29

### Added

-   **Multi-Section Homepage**: The homepage was completely overhauled to be a long, scrollable landing page, making the site feel more professional and content-rich.
-   **New Homepage Sections**:
    -   "Our Core Services" section with custom icons and descriptions.
    -   "Simple & Transparent Process" (How It Works) section with a 3-step visual guide.
    -   "Our Global Network" section featuring a world map to showcase reach.
    -   "Trusted by Thousands" (Testimonials) section to build social proof.
-   **Visual Tracking Progress Bar**: Added a progress bar to the Tracking Page to give users an at-a-glance view of their shipment's status (Booked, In Transit, Delivered).
-   **Responsive Header**: Implemented a fully functional hamburger menu in the header for a clean, accessible mobile navigation experience.
-   **Professional Footer**: Redesigned the footer into a multi-column layout with quick links, service details, contact information, and social media icons.

### Changed

-   Replaced the simple hero-only homepage with the new, comprehensive landing page structure.
-   Updated the hero section background image to a more professional courier-themed photo.

## [1.0.0] - 2024-07-29

### Added

-   **Initial Project Scaffold**: Created the entire frontend application using React, TypeScript, and React Router.
-   **Styling**: Integrated Tailwind CSS for a utility-first styling approach and a custom theme.
-   **Core Pages**:
    -   `HomePage`: Initial hero section with a tracking form.
    -   `LoginPage`: Combined Login and Sign Up forms with mock authentication.
    -   `BookingPage`: Form to create new shipments.
    -   `TrackingPage`: Page to view shipment status and history.
    -   `NotFoundPage`: A standard 404 page.
-   **Admin Panel**:
    -   `AdminDashboard`: Displays analytics and AI-powered insights.
    -   `AdminShipmentsPage`: Lists all shipments with search functionality.
    -   `AdminUpdateShipmentPage`: Form to update the status of a specific shipment.
-   **Authentication System**:
    -   Implemented `AuthContext` and `useAuth` hook for managing user login state.
    -   Created `ProtectedRoute` and `AdminRoute` to secure application sections.
-   **Mock Backend**:
    -   Developed `services/mockApi.ts` to simulate all backend functionality, including user management, shipment CRUD, and analytics.
-   **Gemini AI Integration**:
    -   Created `services/geminiService.ts` to fetch logistics market insights from the Google Gemini API.
-   **UI Component Library**:
    -   Built a set of reusable UI components (`Card`, `Button`, `Input`, `Modal`) for a consistent design.
-   **Deployment Setup**:
    -   Configured the application to run from a static `index.html` with dependencies loaded from a CDN via an `importmap`.