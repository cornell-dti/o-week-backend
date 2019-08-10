interface Category {
    pk: string,
    category: string,
    timestamp: number
}

const Colleges = {
    AAP: "Architecture, Art & Planning",
    AS: "Arts & Sciences",
    CALS: "Agriculture & Life Sciences",
    Engineering: "Engineering",
    HumanEcology: "Human Ecology",
    ILR: "ILR School",
    Dyson: "SC Johnson College of Business - Dyson School",
    Hotel: "SC Johnson College of Business - Hotel Administration"
};

const CategoryToPk: Record<string, string> = {
    AAP: "8D0F380C-047E-8FD3-CDA449EB7C41A466",
    AS: "8D0D75B3-BE48-48D8-DF46CC38682879C3",
    CALS: "8D0BC52D-C504-D514-F334BEB4E18FF455",
    Engineering: "8D11CBA4-D6D3-7FDB-17ECC36ACBED42A5",
    HumanEcology: "8D107B76-AFFE-D1B3-D4D752BCD7ED2265",
    ILR: "8D139B03-E3DE-A329-B364603149879B5A",
    Dyson: "3D51CFD6-A23C-EF4E-A6DF0F01930ACB62",
    Hotel: "8D084B16-073C-2EF4-0716B6DB7034C2F6",
    Transfer: "B8AE27DD-DCD0-EF66-FC3B05EB37B392D7"
};

const StudentTypes = {
    FirstYear: "First-Year Students",
    Transfer: "Transfer Students"
};


export {
    Category,
    CategoryToPk,
    Colleges,
    StudentTypes
}