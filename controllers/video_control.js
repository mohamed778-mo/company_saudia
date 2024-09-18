const Video = require("../models/video");
const Services = require("../models/service");

const postvideofromviemotoDB = async (req, res) => {
  try {
      const videoId  = req.body.videoId
      const urlParts = videoId.split('/');
      const VideoId = urlParts[0];
      const Vtoken = urlParts[1];

      const service_id = req.params.service_id;
      const service = await Services.findById(service_id);

      if (!service) {
          return res.status(404).send("Service not found");
      }

      const newVideo = new Video({
          videoURL: `https://player.vimeo.com/video/${VideoId}?h=${Vtoken}`,
          service_id: service._id,
          Service_arabic_name: service.address_arabic_main, 
          Service_english_name: service.address_english_main 
      });

      await newVideo.save();

      await Services.updateOne(
          { _id: service_id },
          { $set: { videolink: newVideo.videoURL } }
      );

      res.status(200).send(newVideo);

  } catch (e) {
      res.status(500).send(e.message);
  }
};


const getVideoinService = async (req, res) => {
    try {
        const service_id = req.params.service_id;
        const service = await Services.findOne({ "service._id": service_id });

        if (!service) {
            return res.status(404).send("Service not found");
        }

        const serviceData = service.service.find(s => s._id.toString() === service_id);
        if (!serviceData) return res.status(404).send("No videos found");

        res.status(200).send(serviceData.videolink);
    } catch (e) {
        res.status(500).send(e.message);
    }
};

const deletevideo = async (req, res) => {
  try {
      const video_id = req.params.video_id;
      const service_id = req.params.service_id;

      const video = await Video.findById(video_id);
      if (!video) return res.status(404).send("Video not found");

      await Video.findByIdAndDelete(video_id);
      await Services.updateOne(
          { _id: service_id },
          { $pull: { videolink: video.videoURL } }
      );

      res.status(200).send({ message: "Video deleted successfully" });

  } catch (e) {
      res.status(500).send(e.message);
  }
};


module.exports = {
    postvideofromviemotoDB,
    getVideoinService,
    deletevideo
};
