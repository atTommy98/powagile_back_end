/// <reference types="Cypress" />

describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.request("http://localhost:8080");
  });
});

describe("post should create a new user with the same username, email and authID they entered or where assigned to", () => {
  it("successfully create new user with the same credentials", () => {
    cy.request("POST", "http://localhost:8080/users/", {
      userName: "Jane",
      email: "test@test.com",
      AuthId: "123456",
    })
      .then((response) => {
        expect(response.body).to.have.property(
          "userName",
          "Jane",
          "email",
          "test@test.com",
          "AuthId",
          "123456"
        );
      })
      .then(console.log);
  });
});

describe("should get all users", () => {
  it("successfully gets all users", () => {
    cy.intercept("GET", "users/*", { fixture: "users.json" });
  });
});

describe("should get all meetings", () => {
  it("successfully gets all meetings", () => {
    cy.intercept("GET", "meetings/*", { fixture: "meetings.json" });
  });
});

describe("user should have property of _id", () => {
  it("user has property _id", () => {
    cy.request("http://localhost:8080/users").then((response) => {
      expect(response.body[0]).to.have.property("_id");
    });
  });
});

describe("meeting should have property of _id", () => {
  it("meeting has property _id", () => {
    cy.request("http://localhost:8080/meeting").then((response) => {
      expect(response.body[0]).to.have.property("_id");
    });
  });
});

describe("user should have property of email", () => {
  it("user has property of email", () => {
    cy.request("http://localhost:8080/users").then((response) => {
      expect(response.body[5]).to.have.property("email");
    });
  });
});

describe("meeting should type is equal to Standup", () => {
  it("meeting type is equal to standup", () => {
    cy.request("http://localhost:8080/meeting").then((response) => {
      expect(response.body[0].type).to.equal("StandUp", "Retro");
      console.log(response.body[0]);
    });
  });
});

describe("meeting partipant should have be an array", () => {
  it("meeting participents is an array", () => {
    cy.request("http://localhost:8080/meeting").then((response) => {
      expect(response.body[0].meetingParticipants).to.be.a("Array");
      console.log(response.body[0].meetingParticipants);
      console.log(response.body[0]);
    });
  });
});

describe("hasHadTurn should have be an boolean", () => {
  it("hasHadTurn should have be an boolean", () => {
    cy.request("http://localhost:8080/meeting").then((response) => {
      expect(
        response.body[0].meetingParticipants.every(
          (el) => typeof el.hasHadTurn === "boolean"
        )
      ).to.be.true;
    });
  });
});

// response.body[0].meetingParticipants.forEach((hasHadTurn) =>
// console.log(hasHadTurn)

describe("should get all users", () => {
  it("successfully gets all users", () => {
    cy.request("http://localhost:8080/users").then((response) => {
      expect(response.body[0]).to.have.property("_id");
    });
  });
});

// describe("should get post new user ", ()=> {
//   it("succesfully posts a new user", () =>{

//   })
// });

describe("users should have atleast 10 users", () => {
  it("atleast has 10 users", () => {
    cy.request("http://localhost:8080/users").then((response) => {
      expect(response.body).to.have.length.of.at.least(10);
    });
  });
});
