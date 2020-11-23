# The ATM App

- Author: Nev Sutter
- Developed in: React
- Built with: Yarn
- Tested with: Jest (+jest-fetch-mock) & Enzyme (+@wojtekmaj/enzyme-adapter-react-17)

## Disclaimer 

The guidance for this challenge recommended selecting "the tools/frameworks/
libraries etc that you know best", but given that I already know that I need
to update my tech stack, it seemed like this was an ideal opportunity to teach
myself how to use React. For this reason, I have used 'plain' React, without
hooks or anything else which may have proved too much of a distraction.

Whether or not this was a wise decision remains to be seen, but at least I can
honestly say I've enjoyed working on this challenge and learning React as I've
gone along.

## Notes/Assumptions

- Given that the PIN API always returns the same balance, I decided that the 
  withdrawls all take place within a single transaction, i.e. all 3 amounts
  are withdrawn after a single PIN validation.

- For the same reason, the app only allows a single transaction and doesn't
  reset to the initial state after the transaction completes.

- Being a web app, I'm sure using a textbox for PIN and amount entry would have
  worked perfecty well, but I liked the idea of recreating the feel of an ATM.
  This extended to other ATM functionality not included in the challenge, such
  as locking the user out after 3 incorrect PIN attempts.

- For simplicity, I coded the CashBox class to handle only the 3 denominations
  of note required by the challenge, but it could easily be extend to handle
  £50 notes or even allow the value of the note to be specified along with the
  quantity, when the CashBox is initialised.

- The requirement to give a roughly even number of notes (rather than minimum
  number of notes) introduces edge conditions where it is possible to run out
  of some note denominations and be unable to fulfil the request even though 
  the requested amount could have been fulfilled from all the notes available.
  This should not happen within the parameters of the challenge but I've tried
  to tackle some of these conditions and ensured an error is thrown if the 
  system does become stuck.

- Display messages and amount validation could be extended to enforce multiples
  of £20, if tens and fives have run out.

- Some tests aren't as complete as I'd like, simply because I haven't (as yet)
  been able to find the right method of testing the functionality in question. 

# Standard ReadMe information follows...

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
