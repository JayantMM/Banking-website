// temporary balance (for demo)
let balance = 1000;

// send money
router.post("/send", (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (amount > balance) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  balance -= amount;

  res.json({
    message: "Money sent successfully ✅",
    balance: balance
  });
});