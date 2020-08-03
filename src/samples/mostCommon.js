module.exports = {
  schema: {
    title: "Example - Most common: A registration form",
    description: "Most common form example.",
    type: "object",
    required: ["firstName", "lastName"],
    additionalProperties: false,
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
      age: {
        type: "integer",
        title: "Age",
        minimum: 18,
        maximum: 99,
        default: 18,
      },
      startMembership: {
        type: "string",
        format: "date",
        title: "Start Membership at",
      },
      donation: {
        type: "string",
        format: "decimal",
        title: "Donation",
        'x-multipleOf': "5",
        'x-minimum': "10",
        'x-maximum': "500"
      }
    }
  },
  uiSchema: {

  },
  formData: {
    
  }

};
