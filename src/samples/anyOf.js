module.exports = {
  schema: {
    type: 'object',
    title: 'Menue (AnyOf)',
    properties: {
      quantity: {
        type: 'integer',
        minimum: 1,
        maximum: 10
      }
    },
    required: [
      'quantity'
    ],
    anyOf: [
      {
        type: 'object',
        title: 'Starter',
        properties: {
          type: {
            const: 'STARTTER'
          },
          name: {
            type: 'string',
            default: 'Salat'
          },
          remark: {
            type: 'string',
            default: 'French Dressing'
          }
        },
        required: [
          'name', 'type'
        ]
      },
      {
        type: 'object',
        title: 'Main',
        properties: {
          type: {
            const: 'MAIN'
          },
          dish: {
            type: 'string',
            default: 'T-bone 500g'
          },
          remark: {
            type: 'string',
            default: 'Medium'
          }
        },
        required: [
          'dish', 'type'
        ]
      },
      {
        type: 'object',
        title: 'Dessert',
        properties: {
          type: {
            const: 'DESSERT'
          },
          dessertCoupe: {
            type: 'string'
          },
          extra: {
            type: 'object',
            title: 'Extras',
            anyOf : [
              {
                type: 'object',
                title: 'Extra Eiscreme',
                required: ['option', 'flavours'],
                properties: {
                  option: {
                    const: 'A'
                  },
                  flavours: {
                    type: 'array',
                    title: 'flavours',
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      type: 'string',
                      oneOf : [
                        {
                          const: 'VANILLE',
                          title: 'Vanille'
                        },{
                          const: 'STRAWBERRY',
                          title: 'Straberry'
                        },{
                          const: 'CHOCOLATE',
                          title: 'Chocolate'
                        }
                      ],
                      default : 'CHOCOLATE'
                    },
                    default : [
                      "CHOCOLATE"
                    ]
                  }        
                }
              },{
                type: 'object',
                title: 'Extra',
                required: ['option'],
                properties: {
                  option: {
                    const: 'B'
                  },
                  remark: {
                    type: 'string',
                    default: 'Whipped cream'
                  }
                }
              }
            ]         
          }
        },
        required: [
          'dessertCoupe', 'type'
        ]
      }
    ]    
  },
  uiSchema: {

  },
  formData: {
    quantity: 1,
    extra : {
      option: 'A',
      flavours: [
        'VANILLE',
        'STRAWBERRY'
      ]
    },
    dessertCoupe: 'Romanoff'
  }
};
