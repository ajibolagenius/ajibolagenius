
**Data & Backend Integration**

* **Live Data Implementation:** Strip out all mock data (text, images, and media) across the homepage and completely replace it with live data fetched from Supabase.
* **State Management Refactor:** Update the frontend state to connect directly to the Supabase database, eliminating any reliance on local or hardcoded data.
* **Database Scalability:** Ensure the backend architecture is designed to easily accommodate future content updates and data expansion.

**User Experience (UX) & Reliability**

* **Loading States:** Implement clear visual indicators (like skeleton screens or spinners) to improve the user experience while data is being fetched.
* **Robust Error Management:** Create graceful fallbacks and error messages to handle situations where database connections fail or data is temporarily unavailable.
* **Media Integrity:** Verify that all image and media URLs point to the correct, active storage sources to entirely prevent broken links.

**UI & Design Strictures**

* **Design Freeze:** Strictly maintain the current homepage UI, layout, and visual aesthetic without introducing any changes.
* **Responsiveness:** Ensure the layout remains flawlessly responsive and functional across all mobile, tablet, and desktop devices.
