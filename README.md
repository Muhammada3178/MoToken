
# MoToken
This is a test token that I have created to better understand the ERC20 protocol and have fun.

The ```MoToken.sol``` file is a basic smart contract for the token. It has a mint function which only the owner should be able to call.

## Tests
To execute the test cases. Run the following command:
```
npx hardhat test
```

## Deployment
This smart contract can be deployed by using the following command:
```
npx hardhat ignition deploy ignition/modules/MoToken.js --network localhost
```