class Product {
  constructor(id, name, price, description, landings, videoUrls, tikTokLinks, angles, username, vomitoDeMercadoUrl, step) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.description = description;
      this.landings = landings;
      this.videoUrls = videoUrls;
      this.tikTokLinks = tikTokLinks;
      this.angles = angles;
      this.username = username;
      this.vomitoDeMercadoUrl = vomitoDeMercadoUrl;
      this.step = step;
  }
}

module.exports = Product;