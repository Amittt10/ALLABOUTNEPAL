export const searchContent = async (req, res) => {
  try {
    const { festivalCollection, heritageCollection, placesCollection } = req.db;
    const q = (req.query.q || '').trim();

    if (!q) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    // MongoDB text search with score metadata, including image fields
    const festivals = await festivalCollection
      .find(
        { $text: { $search: q } },
        { projection: { score: { $meta: "textScore" }, name_en: 1, description: 1, image: 1 } } // Added image here
      )
      .sort({ score: { $meta: "textScore" } })
      .toArray();

    const heritageSites = await heritageCollection
      .find(
        { $text: { $search: q } },
        { projection: { score: { $meta: "textScore" }, name_en: 1, description: 1, image: 1 } } // Added image here
      )
      .sort({ score: { $meta: "textScore" } })
      .toArray();

    const places = await placesCollection
      .find(
        { $text: { $search: q } },
        { projection: { score: { $meta: "textScore" }, title_en: 1, description_en: 1, thumbnail: 1 } }
      )
      .sort({ score: { $meta: "textScore" } })
      .toArray();

    // Combine results and include type and score for possible further sorting
    const results = [
      ...festivals.map(f => ({ type: "festival", score: f.score, ...f })),
      ...heritageSites.map(h => ({ type: "heritage", score: h.score, ...h })),
      ...places.map(p => ({ type: "place", score: p.score, ...p })),
    ];

    // Optional: sort combined results by score descending
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching content:", error);
    res.status(500).json({ message: "Error searching content" });
  }
};
