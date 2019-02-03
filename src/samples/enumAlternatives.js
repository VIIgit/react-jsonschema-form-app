module.exports = {
  schema: {
    title: "A registration form",
    description: "Enum and Enum alternatives form example.",
    type: "object",
    properties: {
      
      gender: {
        type: "string",
        enum: [
          "MALE",
          "FEMALE",
          "OTHER"
        ],
        default: "FEMALE",
        title: "Gender",
      },
      plan: {
        type: "string",
        title: "Plan",
        oneOf: [
          {const: "A"},
          {const: "B", title: "Why Plan B?"},
        ]
      },
      age: {
        type: "integer",
        title: "Age",
        oneOf: [
          {const: "TEENAGER", title: "after puberty but < 19 years"},
          {const: "YOUNG_ADULT", title: "between 19 to 25 years"},
          {const: "YOUNG_ADULT", title: "> 25 years"},
          {const: "SENIOR", title: "senior citizens"},
        ]        
      },
      favouriteColors: {
        type: "array",
        title: "Favourite Colors",
        items: {
          type: "string",
          default: "#0000ff",
          oneOf: [
            {const: "#ff0000", title: "Red"},
            {const: "#0000ff", title: "Blue"},
          ]  
        }

      }
    },
  },
  uiSchema: {

  },
  formData: {
  
  }

};
