const {analizeVideoOptionsByProduct} = require('../services/chatGptService');

const analizeOptions = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByDocumentId(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const analysis = product.videos.map((video, index) => ({...video.analysis, sceneId: `Video_${index}_${video.sceneId}`}));
    const answer = await analizeVideoOptionsByProduct(analysis);

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}

module.exports = {
  analizeOptions
};
