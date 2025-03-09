import Entry from "../models/entry.model.js";
import Tag from "../models/tag.model.js";

export const deleteEntry = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const existingEntry = await Entry.findOne({ _id: id, userId });
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found or not authorized",
      });
    }
    await Entry.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Entry deleted" });
  } catch (error) {
    console.error("Error in Delete Entry:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const updateEntry = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const entry = req.body;

  try {
    const existingEntry = await Entry.findOne({ _id: id, userId });
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: "Kayıt bulunamadı veya yetkiniz yok",
      });
    }

    const entryTags = entry.tags ?? [];
    const tagPromises = entryTags.map(async (tagData) => {
      if (!tagData._id) {
        const newTagt = new Tag({ ...tagData, userId });
        await tag.save();
        tagData._id = newTagt._id;
      }
    });

    await Promise.all(tagPromises);

    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      {
        ...entry,
        tags: entryTags.map((tag) => {
          _id: tag._id;
        }),
        userId,
      },
      { new: true }
    ).populate("tags");

    res.status(200).json({ success: true, data: updatedEntry });

    if (entry.tags) {
      // if (mongoose.Types.ObjectId.isValid(tagData)) {
      //   return tagData;
      // }
      // if (tagData && tagData.name) {
      //   let tag = await Tag.findOne({
      //     name: tagData.name,
      //     userId,
      //   });
      //   if (!tag) {
      //     tag = new Tag({
      //       name: tagData.name,
      //       color: tagData.color || "#000000",
      //       userId,
      //     });
      //     await tag.save();
      //   }
      //   return tag._id;
      // }
      //});
      //tagIds = await Promise.all(tagPromises);
    }
  } catch (error) {
    console.error("Güncelleme hatası:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};
export const createEntry = async (req, res) => {
  const entry = req.body;
  const userId = req.user.id;

  if (!entry.content) {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  try {
    const entryTags = entry.tags ?? [];

    const allPromises = entryTags.map(async (tagData) => {
      if (!tagData._id) {
        const newTag = new Tag({ ...tagData, userId });
        await newTag.save();
        tagData._id = newTag._id;
      }
    });

    await Promise.all(allPromises);

    const newEntry = new Entry({
      ...entry,
      userId,
      tags: entryTags.map((e) => {
        return { _id: e._id };
      }),
    });

    await newEntry.save();

    const populatedEntry = await Entry.findById(newEntry._id).populate(
      "tags",
      "name color"
    );

    res.status(201).json({
      success: true,
      data: populatedEntry,
    });
  } catch (error) {
    console.error("Error in Create Entry:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getAllEntries = async (req, res) => {
  const userId = req.user.id;

  try {
    const entries = await Entry.find({ userId })
      .select("_id content tags createdAt")
      .populate("tags", "name color");

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error in Fetch All Entries:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getEntryById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const entry = await Entry.findOne({ _id: id, userId }).populate(
      "tags",
      "name color"
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found or not authorized",
      });
    }

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error in Fetch Entry by Id:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getEntriesByTag = async (req, res) => {
  const { tagname } = req.params;
  const userId = req.user.id;

  try {
    const tag = await Tag.findOne({
      name: tagname,
      userId,
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    const entries = await Entry.find({
      tags: tag._id,
      userId,
    })
      .select("_id content tags createdAt")
      .populate("tags", "name color");

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error in Fetch Entries by Tag:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
