module.exports = {
  schema: {
    title: 'A registration form',
    description: 'All kind of widgets form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First name',
        default: 'Chuck',
      },
      lastName: {
        type: 'string',
        maxLength: 10,
        title: 'Last name',
      },
      address: {
        type: 'string',
        description: 'Delivery address for letter correspondence',
        format: 'text/plain',
        title: 'Address',
      },
      gender: {
        type: 'string',
        enum: [
          'female',
          'male'
        ],
        default: 'male',
        title: 'Gender',
      },
      startMembership: {
        type: 'string',
        format: 'date',
        title: 'Start Membership at',
      },
      age: {
        type: 'integer',
        minimum: 18,
        maximum: 99,
        title: 'Age',
      },
      bio: {
        type: 'string',
        format: 'markdown',
        readOnly: false,
        title: 'Bio',
      },
      telephone: {
        type: 'string',
        title: 'Telephone',
        minLength: 10,
      },
      investment: {
        type: 'string',
        format: 'decimal',
        default: '1000.30',
        title: 'Investment',
      },
      discount: {
        type: 'string',
        format: 'percentage',
        default: '0.305',
        title: 'Discount',
      },
      hobbies: {
        type: 'array',
        title: 'Hobbies',
        uniqueItems: true,
        items: {
          type: 'string',
          default: 'Sport'
        }
      },
      
      favouriteColor: {
        type: 'string',
        format: 'color',
        title: 'Favourite Color'
      },
      profileImage: {
        type: 'string',
        format: 'data-url',
        title: 'Profile Image'
      },
      attachments: {
        type: 'array',
        title: 'Attachments',
        items: {
          type: 'string',
          format: 'data-url'
        }
      },

      occupation: {
        type: 'object',
        anyOf: [
          {
            title: 'Self Employed',
            properties: {
              companyName: {
                type: 'string',
                title: 'Company Name'
              },
              numberOfEmployees: {
                type: 'string',
                enum: ['1 - 50', '51 - 200', '200 plus'],
                title: 'Number of Employees'
              }
            },
            required:
            ['companyName', 'numberOfEmployees']
          },
          {
            title: 'Employed',
            properties: {
              income: {
                type: 'string',
                title: 'Income',
                format: 'decimal',
                default: '0'
              }
            },
            required:
            ['income']
          }
        ]
      },
    },
    anyOf: [
      {
        title: 'First method of identification',
        properties: {
          login: {
            type: 'string',
            title: 'Login name',
            default: 'guest'
          },
          email: {
            type: 'string',
            format: 'email',
            title: 'Email'
          }
        },required:
        ['login']
      },
      {
        title: 'Second method of identification',
        type: 'object',
        properties: {
          idCode: {
            type: 'string',
            title: 'ID code'
          }
        },required:
        ['idCode']
      }
    ]
  },
  uiSchema: {

  },
  formData: {
    firstName: 'Norris',
    lastName: 'Jack',
    age: 75,
    bio: '# My Bio\n**Lorem** _ipsum_... \n\n1. First\n1. Second',
    address: '24 Main Street\nAuckland',
    favouriteColor: '#ffd300',
    hobbies: [
      'Biking',
      'Ski'
    ],
    occupation: {
      companyName: 'My Inc',
      numberOfEmployees: '1 - 50'
    },
    login: 'GUEST',
    email: 'w@vii.ch',
    profileImage: 'data:image/png;name=logo.png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAC6klEQVR4Ae3cA4xdQRgF4Nq2bbtBbTdOFdW2bdu2bdu2u7Ztneal8U73zlTzpntOTrD6k3yrd++dmTSYkxZz0kiUTUsChZKAWMQiFrGIxZKAWMQiFrGIxZKAWMQiVqrCWlse5wbg2kT77gSc7Y81ZbRiXR6NxHiYkoRYnB+kCWtPCyAJZiUpEdsb68B6tBIm5t5CHVgvthmJ9WQtsYhFLGIRK+U+22Qk1qOVOrDODTAS62QfHVjzMsLltmFSDpcxN72my535mXB5FJyuw/etvdfhCi4MxbwMvOvAWzTEIhaxlP4tLshi752XUTfWymJwugZT8vUClhfWhLWsAMK9YFZCXLAktw6sG1NgYq6M0XIhvdVIrMdr/hgW7zoQi1jEIhax7i0wEuvmdB1Y68ojLsowqdgwrCqh6XJnV1MEfjVGyv8TtjfWfSG9roJNbVczO25TrCnLWzS8n0UsYhFL/WkYPp2Ew2VBP53C1XFYkNliyKWR8HqOUDeEuierG7xf4cZki43v5wbC7z2iAhAdLGiEDxyuYFMtrVgHOiA+GpZJjMe+duIJC7LaRGQS6Y+l+cRDvF7ILvs7P1gT1sriagtKF+UQDPlyFvJxuSuYcH4Q5JOYgGUFdGBdGKp4i3KcYEi4N+QTEyaY4HAJSjnYRQfWlbFQyp25giGRfpBPXIRgguoTk8PdiUUsYhGLWMQiFrGIRSxiEYtYxCIWsYhFLGIRi1jEkgmxHK9CKYe66cA62w9KOT9QMMT/I+QT6i6YcH8RFJKEDVV1YC3Nr7DDIj5a/Fz6RE8kJUIyF4eLH9NGBUAyr3boeyK9pQ78PsAygd+wufaPLxF7hftYTIgKwtn+P52wvBDeHUgZ3QZ6bQLmptOGZeu89NjTEpdGCM9isr1/b2vrzbZz02FbQxzqgkNdk7ULtjeW2q67OLftm7e9kaAbqoonqGOxxCIWsYhFLGKxxCIWsYhFLGL9pyUWsYhFLGKlpYJc034HUuzQ02DHy2QAAAAASUVORK5CYII='
  }

};
