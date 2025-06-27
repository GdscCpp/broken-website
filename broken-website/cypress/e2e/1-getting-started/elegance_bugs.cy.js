// cypress/e2e/elegance_bugs.cy.js

describe('Elegance Emporium Critical Bug Testing', () => {

    // --- Stage 2.1: Test Setup (before each test) ---
    // What's Happening: Before every individual test runs, Cypress will perform these actions.
    // This ensures each test starts from a clean slate.
    beforeEach(() => {
        // cy.visit() tells Cypress to load our web page.
        // Make sure your `http-server` is running in your project directory
        // (e.g., you ran `npm run start-app` in another terminal).
        cy.visit('http://localhost:8080/index.html'); // Adjust port if http-server uses a different one
        cy.pause(); // PAUSE 1: After visiting the page. Explain the initial state of the website.
    });

    // --- Stage 2.2: Test Case for Broken Cart Total ---
    // What's Happening: This test simulates a user adding multiple items
    // and then checking the cart total, expecting a correct sum.
    it('should show incorrect total when multiple items are added to cart', () => {
        // Find the first "Add to Cart" button (Classic Denim Jeans) and click it.
        // `cy.get()` selects elements using CSS selectors. `.eq(0)` gets the first one.
        cy.get('.product-grid button').eq(0).click();
        cy.pause(); // PAUSE 2: After adding the first item. Point out the cart count update (or lack thereof).

        // Find the second "Add to Cart" button (Floral Summer Dress) and click it.
        cy.get('.product-grid button').eq(1).click();
        cy.pause(); // PAUSE 3: After adding the second item. Point out the cart count should be 2.

        // Open the cart modal
        cy.get('#cart-button').click();
        cy.pause(); // PAUSE 4: After opening the cart modal. Ask the audience to observe the total displayed.

        // Assertion 1: Verify the cart count displays "2" items.
        // `.should('have.text', '2')` checks if the element's text content is exactly '2'.
        cy.get('#cart-count').should('have.text', '2');

        // --- BUG REVEALED HERE ---
        // Assertion 2: Verify the cart total is correct.
        // The expected correct total for 49.99 + 75.00 is 124.99.
        // On the broken website, due to the JavaScript bug, this assertion will FAIL.
        // It will likely show a concatenated string (e.g., "049.9975") or an incorrect float.
        cy.get('#cart-total').should('have.text', '124.99');
        cy.pause(); // PAUSE 5: After the assertion. This pause will only be hit if the assertion passes (which it won't initially).
                    // If it fails, the test will stop here, allowing you to explain the failure.
    });

    // --- Stage 2.3: Test Case for XSS Vulnerability ---
    // What's Happening: This test attempts to inject a malicious script
    // into the review section and then checks if it executed or was safely escaped.
    it('should execute XSS payload when submitted in a review (VULNERABLE)', () => {
        // Navigate to the "Advanced Robotics" section where the review form is located.
        // We use a data attribute selector for robustness.
        cy.get('.nav-link[data-target="page-robotics"]').click();
        cy.pause(); // PAUSE 6: After navigating to the Robotics page. Explain why we're here.

        // Define the XSS payload – an image tag that will trigger an alert on error.
        const xssPayload = '<img src=x onerror="alert(\'XSS executed!\')">';

        // Type the malicious payload into the review textarea.
        cy.get('#review-text').type(xssPayload);
        cy.pause(); // PAUSE 7: After typing the XSS payload. Show the audience the malicious script in the text area.

        // Click the "Submit Review" button.
        cy.get('#submit-review').click();
        cy.pause(); // PAUSE 8: After clicking submit. The alert should pop up now. This is the visual proof of XSS.

        // --- BUG REVEALED HERE ---
        // When running this test in Cypress, you will visually see a browser alert pop up.
        // This clearly demonstrates the XSS vulnerability.
        //
        // For the assertion below:
        // On the *broken* site, the HTML is NOT escaped, so this assertion will FAIL
        // because `reviews-list` will contain the raw `<img...>` tag, not `&lt;img...&gt;`.
        // After fixing (escaping HTML), this assertion should then PASS.
        cy.get('#reviews-list').should('contain.html', '&lt;img src=x onerror=&quot;alert(\'XSS executed!\')&quot;&gt;');
        cy.pause(); // PAUSE 9: After the assertion. Similar to the cart test, this pause will be hit if the assertion passes.
                    // If it fails (which it will, initially), the test will stop here, allowing you to explain the failure.
    });
});