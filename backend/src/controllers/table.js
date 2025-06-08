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

module.exports.Edittable = [
    check("tablenumber").notEmpty().withMessage("Table number is required"),
    check("tablecapacity").notEmpty().withMessage("Table capacity is required"),
    async (req, res) =>
        {
        
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
                }
                const { tablenumber, tablecapacity } = req.body;
                
                const existingTable = await Table.findOne({ tablenumber: req.body.tablenumber });
                if (!existingTable) {
                    return res.status(400).json({ message: "Table number does not exist" });
                    }
                    try{
                        const updatedTable = await Table.findByIdAndUpdate(req.params.id, {
                            tablenumber: tablenumber,
                            tablecapacity: tablecapacity,
                            tablestatus: "Available"
                            }, { new: true });
                            res.status(200).json(updatedTable);
                            } catch (error) {
                                res.status(500).json({ message: "Server error" });
                                }
                               
                    }
]

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
        const tables = await Table.find().populate("waiter_id");
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


module.exports.AssignWaiter = [
  check("waiter_id").isMongoId().withMessage("Invalid waiter ID"),
  check("tablestatus").notEmpty().withMessage("Please send the status of the table"),

  async (req, res) => {
    try {
      const { waiter_id, tablestatus } = req.body;

      // Check if waiter is already assigned to another table
      const existingAssignment = await Table.findOne({
        waiter_id,
        tablestatus: "Assigned",
        _id: { $ne: req.params.id }, // exclude current table
      });

      if (existingAssignment) {
        return res.status(400).json({
          message: `Waiter is already assigned to another table (Table ID: ${existingAssignment._id})`,
        });
      }

      const table = await Table.findById(req.params.id);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      table.waiter_id = waiter_id;
      table.tablestatus = "Assigned";
      await table.save();

      return res.status(200).json({ message: "Table assigned successfully" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
];


module.exports.UnassignWaiter = [
  
  check("tablestatus")
    .notEmpty().withMessage("Table status is required")
    .isIn(["empty"]).withMessage("Invalid table status. Use 'empty' to unassign"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tablestatus } = req.body;
      const table = await Table.findById(req.params.id);

      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      table.waiter_id = null; // unassign waiter
      table.tablestatus = "Available"; // e.g. 'empty'
      await table.save();

      res.status(200).json({ message: "Table unassigned successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
];

