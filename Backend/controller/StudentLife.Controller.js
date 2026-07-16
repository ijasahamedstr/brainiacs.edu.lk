import StudentLife from "../models/StudentLife.models.js";

// @desc    Get all student life sections (Sorted by custom order)
export const getStudentLife = async (req, res) => {
  try {
    // Sorted by order first, then fallback to newest createdAt
    const data = await StudentLife.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create section (Automatically appends to the bottom of the list)
export const createStudentLife = async (req, res) => {
  try {
    const highestOrderRecord = await StudentLife.findOne().sort('-order');
    const nextOrderIndex = highestOrderRecord ? highestOrderRecord.order + 1 : 0;

    const newEntry = await StudentLife.create({
        ...req.body,
        order: nextOrderIndex
    });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update section
export const updateStudentLife = async (req, res) => {
  try {
    const updatedEntry = await StudentLife.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEntry) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete section
export const deleteStudentLife = async (req, res) => {
  try {
    const deletedEntry = await StudentLife.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update ordering (Used for frontend Up/Down arrows)
export const reorderStudentLife = async (req, res) => {
  try {
      const { items } = req.body; 

      if (!items || !Array.isArray(items)) {
          return res.status(400).json({ message: "Invalid payload layout." });
      }

      const bulkOps = items.map((item) => ({
          updateOne: {
              filter: { _id: item.id },
              update: { $set: { order: item.order } }
          }
      }));

      await StudentLife.bulkWrite(bulkOps);
      res.status(200).json({ message: "Student Life ordering synchronized successfully." });
  } catch (error) {
      res.status(500).json({ message: "Internal server error during sync.", error: error.message });
  }
};

// @desc    Bulk import from CSV
export const importStudentLife = async (req, res) => {
  try {
      const { sections } = req.body; 

      if (!sections || !Array.isArray(sections) || sections.length === 0) {
          return res.status(400).json({ message: "No data provided for import." });
      }

      const highestOrderRecord = await StudentLife.findOne().sort('-order');
      let nextOrderIndex = highestOrderRecord ? highestOrderRecord.order + 1 : 0;

      const recordsToInsert = sections.map(section => ({
          name: section.name || "Untitled Event",
          date: section.date || new Date(),
          // Ensure strings are converted to arrays if passed as single strings from CSV
          descriptions: Array.isArray(section.descriptions) ? section.descriptions : [section.descriptions || ""],
          imageUrls: Array.isArray(section.imageUrls) ? section.imageUrls : [section.imageUrls || ""],
          order: nextOrderIndex++
      }));

      const insertedData = await StudentLife.insertMany(recordsToInsert);

      res.status(201).json({ 
          message: `${insertedData.length} records successfully imported.`,
          count: insertedData.length
      });
  } catch (error) {
      res.status(500).json({ message: "Failed to import records.", error: error.message });
  }
};