import NewsModel from "../models/News.models.js";

// 1. CREATE - Create a new article
export const createNews = async (req, res) => {
  try {
    const { slug } = req.body;
    const existing = await NewsModel.findOne({ slug });
    
    if (existing) {
      return res.status(400).json({ message: "An article with this URL slug already exists." });
    }

    const newArticle = new NewsModel(req.body); // Fixed variable name
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: "Error creating news", error: error.message });
  }
};

// 2. GET ALL - View all news (Ordered by latest)
export const getAllNews = async (req, res) => {
  try {
    const news = await NewsModel.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GET SINGLE - View one article by Slug or ID
export const getSingleNews = async (req, res) => {
  try {
    const { identifier } = req.params;
    // Searches by ID if it's a valid Mongo ID, otherwise searches by Slug
    const query = identifier.match(/^[0-9a-fA-F]{24}$/) 
                  ? { _id: identifier } 
                  : { slug: identifier };

    const article = await NewsModel.findOne(query);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Error fetching article", error: error.message });
  }
};

// 4. UPDATE - Edit an existing article
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArticle = await NewsModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true } // Returns the modified document
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 5. DELETE - Remove an article
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NewsModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};