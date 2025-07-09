import { ObjectId } from "mongodb";

export const getRecommended = async (req, res) => {
  try {
    const { type, exclude, lang = "en" } = req.query;
    const collections = req.db;

    if (!type || !collections) {
      return res.status(400).json({ error: "Missing type or DB collections" });
    }

    let collection;
    switch (type) {
      case "heritage":
        collection = collections.heritageCollection;
        break;
      case "festival":
        collection = collections.festivalCollection;
        break;
      case "place":
        collection = collections.placesCollection;
        break;
      default:
        return res.status(400).json({ error: "Invalid type parameter" });
    }

    let excludeId;
    if (exclude && exclude !== "null") {
      try {
        excludeId = new ObjectId(exclude);
      } catch {
        return res.status(400).json({ error: "Invalid exclude ID" });
      }
    }

    const matchFilter = excludeId ? { _id: { $ne: excludeId } } : {};

    const recommended = await collection
      .aggregate([
        { $match: matchFilter },
        { $sample: { size: 5 } },
      ])
      .toArray();

    const normalizeImagePath = (rawImage) => {
      if (!rawImage) return "";
      let path = rawImage.startsWith("/") ? rawImage.slice(1) : rawImage;

      // For festivals and places, ensure path starts with uploads/
      if (type === "festival" || type === "place") {
        if (!path.startsWith("uploads/")) {
          path = "uploads/" + path;
        }
      }

      return path;
    };

    const mapped = recommended.map((item) => {
      let name =
        item[`name_${lang}`] ||
        item[`title_${lang}`] ||
        item.name_en ||
        item.title_en ||
        item.name ||
        item.title ||
        "Untitled";

      let rawImage = item.image || item.thumbnail || (item.gallery?.[0] || "");
      let image = normalizeImagePath(rawImage);

      let extra = "";

      if (type === "heritage") {
        extra =
          item[`location_${lang}`] ||
          item.location_en ||
          item.location_np ||
          item.location ||
          "";
      } else if (type === "place") {
        extra = item.category || "";
      }

      return {
        _id: item._id,
        name,
        image,
        extra,
      };
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching recommended items" });
  }
};
