Feature: Teacher can create an assignment

    Feature Description

    Scenario: I can open the add assignment modal
        Given I am logged in as "teacher"
        And I am on the "assignments page"
        When I click the "add assignment button"
        And the "choose class selection" is displayed
        And the "choose topic selection" is displayed
        And the "modal title" text is equal to "Uus iseseisev töö"

        Postcondition: I have opened the create assignment modal

    Scenario: I can add exercises
        Given I have opened the create assignment modal
        When I select the "7A" option from "choose class selection"
        And I select the  "Ühe tundmatuga võrrandi lahendamine" option from "choose topic selection"
        And I select the "2" option from "choose mandatory exercise difficulty"
        When I click the "add mandatory exercise button"
        Then the "mandatory exercise card" is displayed
        And I select the "3" option from "choose optional exercise difficulty"
        And I click the "add optional exercise button"
        Then the "optional exercise card" is displayed

        Postcondition: I have added exercises to the assignment

    Scenario: I can create an assignment
        Given I have added exercises to the assignment
        When I click the "create assignment button"
        Then the "assignment created successfully" text is displayed

    Postcondition: I have created an assignment


I am on the "<location>"
I select the "<value>" option from "<selector>"
I click the "<selector>"
I fill the "<selector>" with "<value>"
I click the "<button>"
the "<selector>" text is equal to "<value>"
the "<selector>" is displayed