import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifydataamplifycodege-xlbjhi6tuxfw', // Use existing bucket name
  access: (allow) => ({
    // Public read access to all files in the bucket
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read'])
    ]
  })
});