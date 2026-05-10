import mongoose from "mongoose";

/* ---------------------------------------------
   1. Recursive Category Node Schema
   Handles the nested tree logic (Parent > Child > Grandchild).
--------------------------------------------- */
const CategoryNodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    // Removed icon field as requested
    children: {
      type: [],
      default: [],
    },
  },
  { _id: false } // Ensures nested nodes don't generate extra Mongo IDs
);

// 🔁 Enable infinite nesting by adding children of the same schema type
CategoryNodeSchema.add({
  children: [CategoryNodeSchema],
});

/* ---------------------------------------------
   2. Category Section Schema (ONE TREE)
   Stores the entire architecture in a single document.
--------------------------------------------- */
const CategorySectionSchema = new mongoose.Schema(
  {
    // If you need a label for the whole tree (e.g., "Engineering Department")
    sectionTitle: { type: String, trim: true }, 
    
    categories: {
      type: [CategoryNodeSchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

// Prevent model overwrite during development
const CategorySection = mongoose.models.CategorySection || mongoose.model("CategorySection", CategorySectionSchema);

export default CategorySection;