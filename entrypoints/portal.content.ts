import React from 'react';
import ReactDOM from 'react-dom/client';
import NewTab from './newtab/main'; // Assuming main.tsx exports NewTab as default

export default defineContentScript({
  matches: ['*://www.hansung.ac.kr/hansung/10561/subview.do*'],
  mainWorld: true,
  runAt: 'document_end',

  async main(ctx) {
    console.log('Portal content script loaded');

    // 1. Scrape user data from the page
    //    These selectors are ASSUMPTIONS and may need to be adjusted.
    const loginInfoElement = document.querySelector('.login_info strong'); // Selector for the element containing the user's name
    const isLoggedIn = !!loginInfoElement;
    const userName = loginInfoElement?.textContent?.trim() || 'Guest';

    const userData = {
      isLoggedIn,
      userName,
    };

    console.log('Scraped User Data:', userData);

    // 2. Remove original page content and prepare the new UI root
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    const root = document.createElement('div');
    root.id = 'hansung-reservation-root';
    document.body.append(root);

    // 3. Render the React component
    ReactDOM.createRoot(root).render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(NewTab, { userData }),
      ),
    );
  },
});
