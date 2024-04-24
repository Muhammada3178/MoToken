async function main() {
    const [deployer] = await ethers.getSigners();
    const contractAddress = ""; // Replace with your contract's address
    const Contract = await ethers.getContractFactory("MoToken");
    const contract = await Contract.attach(contractAddress);

    const recipient = ""; // Replace with the recipient's address
    const amount = ethers.parseUnits("", 18); // Replace with the amount

    const transaction = await contract.connect(deployer).mint(recipient, amount);
    await transaction.wait();
    console.log(`Successfully minted ${ethers.formatUnits(amount, 18)} tokens to ${recipient}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
