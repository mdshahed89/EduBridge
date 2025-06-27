import Lecture from "../../models/lecture.model.js"

export const createLecture = async (req, res) => {
  try {
    const { title, videoUrl, pdfNotes, moduleId } = req.body;
    const lecture = await Lecture.create({
      title,
      videoUrl,
      pdfNotes,
      module: moduleId,
    });
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create lecture' });
  }
};

export const getLecturesByModule = async (req, res) => {
  
  try {
    const { moduleId } = req.params;
    const lectures = await Lecture.find({ module: moduleId });
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get lectures' });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, videoUrl, pdfNotes } = req.body;

    const updatedLecture = await Lecture.findByIdAndUpdate(
      id,
      {
        title,
        videoUrl,
        pdfNotes,
      },
      { new: true } // return the updated document
    );

    if (!updatedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json(updatedLecture);
  } catch (err) {
    console.error("Update lecture failed:", err);
    res.status(500).json({ message: "Failed to update lecture" });
  }
};


export const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;
    await Lecture.findByIdAndDelete(id);
    res.status(200).json({ message: 'Lecture deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete lecture' });
  }
};