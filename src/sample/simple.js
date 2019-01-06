module.exports = {
    schema: {
      title: "A registration form",
      description: "A simple form example.",
      type: "object",
      required: ["firstName", "lastName"],
      properties: {
        firstName: {
          type: "string",
          title: "First name",
          default: "Chuck",
        },
        lastName: {
          type: "string",
          maxLength: 10,
          title: "Last name",
        },
        age: {
          type: "integer",
          minimum: 18,
          maximum: 99,
          title: "Age",
        },
        bio: {
          type: "string",
          title: "Bio",
        },
        gender: {
          type: "string",
          enum: [
            "female",
            "male"
          ],
          default: "male",
          title: "Gender",
        },
        startMembership: {
          type: "string",
          format: "date",
          title: "Start Membership at",
        },
        telephone: {
          type: "string",
          title: "Telephone",
          minLength: 10,
        },
      },
    },
    uiSchema: {
      firstName: {
        "ui:autofocus": true,
        "ui:emptyValue": "please enter a name",
      }
    },
    formData: {
      lastName: "Norris",
      age: 75
    },
  };
  