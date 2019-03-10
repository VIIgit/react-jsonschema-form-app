module.exports = {
  schema: {
    type: 'object',
    title: 'Menue',
    properties: {
      quantity: {
        type: 'number'
      }
    },
    anyOf: [
      {
        type: 'object',
        title: 'Entree',
        properties: {
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
          'name'
        ]
      },
      {
        type: 'object',
        title: 'Main',
        properties: {
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
          'dish'
        ]
      },
      {
        type: 'object',
        title: 'Dessert',
        properties: {
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
                properties: {
                  option: {
                    const: 'A'
                  },
                  flavours: {
                    type: 'array',
                    title: 'flavours',
                    uniqueItems: true,
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
                    }
                  }        
                }
              },{
                type: 'object',
                title: 'Extra',
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
          'dessertCoupe'
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
