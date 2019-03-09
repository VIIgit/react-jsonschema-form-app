module.exports = {
  schema: {
    type: 'object',
    title: 'Delivery Address',
    properties: {
      address: {
        type: 'string'
      },
      city: {
        type: 'string'
      }
    },
    oneOf: [
      {
        type: 'object',
        title: 'US',
        properties: {
          state: {
            type: 'string'
          },
          zipCode: {
            type: 'string'
          }
        },
        required: [
          'zipCode',
          'state'
        ]
      },
      {
        type: "object",
        title: 'Europe',
        properties: {
          county: {
            type: "string"
          },
          postCode: {
            type: "string"
          }
        },
        required: [
          "postCode"
        ]
      }
    ]    
  },
  uiSchema: {

  },
  formData: {
    adresse: "Mainstreet 24",
    zipCode: "8000",
    state: "Zurich" 
  }
};
