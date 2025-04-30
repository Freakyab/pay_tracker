type categoryType = {
    uv: number;
    name: string;
    value: number;
    fill: string;
};

type transactionType = {
    _id: number;
    amount: number;
    description: string;
    date: Date;
    category: string;
    type : string;
};

type budgetType = {
    category: string;
    amount: string;
};
