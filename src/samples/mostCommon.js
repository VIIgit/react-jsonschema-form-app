module.exports = {
  schema: {
    title: "A registration form",
    description: "Most common form example.",
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
        default: "Norris",
      },
      address: {
        type: "string",
        description: "Delivery address for letter correspondence",
        format: "text/plain",
        title: "Address",
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
      age: {
        type: "integer",
        minimum: 18,
        maximum: 99,
        title: "Age",
      }
    }
  },
  uiSchema: {

  },
  formData: {
    
  }

};
