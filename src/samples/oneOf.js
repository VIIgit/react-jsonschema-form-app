module.exports = {
  schema: {
    type: 'object',
    title: 'Delivery Address',
    describtion: 'OneOf',
    properties: {
      address: {
        type: 'string'
      },
      city: {
        type: 'string'
      },
      options: {
        oneOf: [
          {
            type: 'object',
            title: 'Delivery Express',
            required: ['company'],
            properties: {
              company: {
                const: 'DEx',
                default: 'DEx'
              },
              shipping: {
                type: 'string',
                default: 'STANDARD',
                oneOf: [{
                  const: 'FAST',
                  title: '24h + EUR 40'
                },{
                  const: 'STANDARD',
                  title: '3-5 Days'
                }]
              }
            }
          },
          {
            type: "object",
            title: 'Parcel Quick',
            required: ['company'],
            properties: {
              company: {
                const: 'PQ',
                default: 'PQ'
              },
              remarks: {
                type: 'string'
              }
            }
          }
        ]    
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
