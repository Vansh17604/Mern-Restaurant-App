const Table = require("../models/table");
const {check, validationResult} = require("express-validator");

module.exports.createTable = [
    check("tablenumber").notEmpty().withMessage("Table number is required"),
    check("tablecapacity").notEmpty().withMessage("Table capacity is required"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { tablenumber, tablecapacity } = req.body;
        const existingTable = await Table.findOne({ tablenumber: req.body.tablenumber });
        if (existingTable) {
            return res.status(400).json({ message: "Table number already exists" });
        }
        
        try {

            const newTable = new Table({
                tablenumber,
                tablecapacity,
                tablestatus: "Available"
            });
            await newTable.save();
            res.status(201).json(newTable);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
];


module.exports.Deletetable = async (req, res) => {
  const { id } = req.params;

  try {
    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    await table.deleteOne(); // or Table.findByIdAndDelete(id) if you prefer one-liner

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getAllTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports.gettableAvlible = async (req, res) => {
    try {
        const tables = await Table.find({ tablestatus: "Available" });
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

