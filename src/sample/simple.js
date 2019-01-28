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
        format: "markdown",
        readOnly: true,
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
      investment: {
        type: "string",
        format: "decimal",
        default: "1000.30",
        title: "Investment",
      },
      discount: {
        type: "string",
        format: "percentage",
        default: "0.305",
        title: "Discount",
      },
      hobbies: {
        type: "array",
        title: "Hobbies",
        uniqueItems: true,
        items: {
          type: "string",
          default: "Sport"
        }
      },

      profileImage: {
        type: "string",
        format: "data-url",
        title: "Profile Image"
      },
      attachments: {
        type: "array",
        title: "Attachments",
        items: {
          type: "string",
          format: "data-url"
        }
      },

      occupation: {
        type: "object",
        anyOf: [
          {
            properties: {
              selfEmployed: {
                type: "object",
                title: "Self Employed",
                properties: {
                  companyName: {
                    type: "string",
                    title: "Company Name"
                  }
                }
              }
            }
          },
          {
            properties: {
              employed: {
                type: "object",
                title: "Employed",
                properties: {
                  income: {
                    type: "string",
                    title: "Income",
                    format: "decimal",
                    default: "0"
                  }
                }
              }
            }
          }
        ]
      },
    },
    anyOf: [
      {
        title: "First method of identification",
        properties: {
          login: {
            type: "string",
            title: "Login name",
            default: "Chuck"
          },
          email: {
            type: "string",
            format: "email",
            title: "Email"
          }
        }
      },
      {
        title: "Second method of identification",
        properties: {
          idCode: {
            type: "string",
            title: "ID code"
          }
        }
      }
    ]
  },
  uiSchema: {

  },
  formData: {
    firstName: "Norris",
    lastName: "Jack",
    age: 75,
    bio: "# My Bio\n**Lorem** _ipsum_... \n\n1. First\n1. Second",
    hobbies: [
      "Biking",
      "Ski"
    ],
    occupation: {
      "selfEmployed": {
        "companyName": "MyCompany Ltd."
      }
    }
  }

};
