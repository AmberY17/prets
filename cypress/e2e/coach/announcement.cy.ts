describe("Coach Announcement", () => {
  beforeEach(() => {
    cy.loginAsCoach();
    cy.visit("/dashboard");
  });

  it("shows Post or Update Announcement button", () => {
    cy.contains(/Post Announcement|Update Announcement/).should("be.visible");
  });

  it("can post, edit, and delete announcement", () => {
    cy.contains(/Post Announcement|Update Announcement/).click();
    cy.get("textarea[placeholder*='announcement']").type(
      "E2E announcement - delete me"
    );
    cy.contains("button", "Post").click();
    cy.contains("E2E announcement - delete me").should("be.visible");

    cy.get('button[aria-label="Edit announcement"]').first().click();
    cy.get("textarea").clear().type("E2E announcement updated");
    cy.contains("button", "Post").click();
    cy.contains("E2E announcement updated").should("be.visible");

    cy.get('button[aria-label="Remove announcement"]').first().click();
    cy.contains("button", "Delete").click();
    cy.contains("E2E announcement updated").should("not.exist");
  });
});
