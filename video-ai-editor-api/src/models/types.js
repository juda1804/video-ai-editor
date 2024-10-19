class Product {
  constructor(id, name, price, description, copys, landings, videoUrls, tikTokLinks, angles) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.description = description;
      this.copys = copys;
      this.landings = landings;
      this.videoUrls = videoUrls;
      this.tikTokLinks = tikTokLinks;
      this.angles = angles;
  }
}

module.exports = Product;