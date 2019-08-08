import {firestore} from "firebase-admin";

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

const StudentTypes = {
    FirstYear: "First-Year Students",
    Transfer: "Transfer Students"
};


export {
    Category,
    Colleges,
    StudentTypes
}