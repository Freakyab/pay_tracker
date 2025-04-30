const express = require("express");
const cors = require("cors");
const app = express();
const Transaction = require("./models/transaction.model");
const Budget = require("./models/budget.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", async (_, res) => {
  try {
    return res.status(200).json({
      message: "Welcome to the Expense Tracker API",
      status: true,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
});

app.get("/categories-budgets", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      type: "expense",
    }).sort({ date: -1 });
    const generateColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count;
        colors.push(`hsl(${hue}, 70%, 65%)`);
      }
      return colors;
    };

    const categoryTotals = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

    const uniqueCategories = Object.keys(categoryTotals).length;
    const colors = generateColors(uniqueCategories);
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

    const categories = Object.entries(categoryTotals).map(
      ([name, value], index) => ({
        name,
        value,
        fill: shuffledColors[index],
      })
    );

    const budgets = await Budget.find();

    return res.status(200).json({
      message: "Categories fetched successfully",
      status: true,
      data: categories,
      budgets: budgets,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
});

app.post("/add", async (req, res) => {
  try {
    const { amount, description, category, date, type } = req.body;

    if (!amount || !description || !category || !date || !type) {
      return res.status(400).json({
        message: "Please provide all the required fields",
        status: false,
      });
    }

    let finalCategory = category;

    if (category === "auto") {
      try {
        const allCategories = await Transaction.distinct("category");
        const gemini_api_key = process.env.API_KEY;
        const googleAI = new GoogleGenerativeAI(gemini_api_key);
        const geminiModel = googleAI.getGenerativeModel({
          model: "gemini-2.0-flash-001",
        });

        const prompt = `Suggest a one-word category for this transaction: "${description}". Just give the word.
        check if the word is one of these: ${allCategories.join(
          ", "
        )}. If it is not, suggest a new category. If you cannot find a category, just say "uncategorized"
        `;
        const result = await geminiModel.generateContent(prompt);
        const text = await result.response.text();
        finalCategory = text.trim().split(/\s+/)[0].toLowerCase();
      } catch (error) {
        console.error("AI categorization error:", error);
        finalCategory = "uncategorized";
      }
    }

    const transaction = new Transaction({
      amount,
      description,
      category: finalCategory,
      date,
      type,
    });

    await transaction.save();

    return res.status(200).json({
      message: "Transaction added successfully",
      status: true,
      data: transaction,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
});

app.get("/list-3-transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).limit(3);
    return res.status(200).json({
      message: "Last 3 transactions fetched successfully",
      status: true,
      data: transactions,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
});

app.post("/add-budget", async (req, res) => {
  try {
    const { budgets } = req.body;
    if (!budgets) {
      return res.status(400).json({
        message: "Please provide all the required fields",
        status: false,
      });
    } 

    const existingBudgets = await Budget.find({});
    const updatedBudgets = [];

    // update existing budgets or create new ones
    for (const budget of budgets) {
      const existingBudget = existingBudgets.find(
        (b) => b.category === budget.category
      );
      if (existingBudget) {
        existingBudget.amount = budget.amount;
        await existingBudget.save();
        updatedBudgets.push(existingBudget);
      } else {
        const newBudget = new Budget({
          category: budget.category,
          amount: budget.amount,
        });
        await newBudget.save();
        updatedBudgets.push(newBudget);
      }
    }

    return res.status(200).json({
      message: "Budget added successfully",
      status: true,
      data: updatedBudgets,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
});

app.get("/todays-budget", async (_, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const yesterday = new Date(today.setDate(today.getDate() - 1));

    const lastDayTransactions = await Transaction.find({
      date: { $gte: yesterday, $lte: endOfDay },
    }).sort({ date: -1 });

    const transactions = await Transaction.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1 });

    const earned = transactions.reduce((acc, transaction) => {
      if (transaction.type === "income") {
        return acc + transaction.amount;
      }
      return acc;
    }, 0);

    const lastDayEarned = lastDayTransactions.reduce((acc, transaction) => {
      if (transaction.type === "income") {
        return acc + transaction.amount;
      }
      return acc;
    }, 0);

    const lastDaySpent = lastDayTransactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        return acc + transaction.amount;
      }
      return acc;
    }, 0);

    const earnedInPercentage = lastDayEarned
      ? ((earned - lastDayEarned) / lastDayEarned) * 100
      : 0;

    const spent = transactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        return acc + transaction.amount;
      }
      return acc;
    }, 0);
    const spentInPercentage = lastDaySpent
      ? ((spent - lastDaySpent) / lastDaySpent) * 100
      : 0;

    let net = earned - spent;

    if (spent > earned) {
      net = 0;
    }

    return res.status(200).json({
      message: "Today's expenses fetched successfully",
      status: true,
      data: {
        earned,
        spent,
        net,
        earnedInPercentage,
        spentInPercentage,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
