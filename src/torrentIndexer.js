const axios = require("axios");
const cheerio = require("cheerio");
const { sources } = require("./config");

const YtsSearch = require("./sources/yts");
const LeetxSearch = require("./sources/1337x");
const Torrentz2Search = require("./sources/torrentz2");
const EztvSearch = require("./sources/eztv");
const RarbgSearch = require("./sources/rarbg");
const SkySearch = require("./sources/skytorrents");
const ZooqleSearch = require("./sources/zooqle");
const ThePirateBaySearch = require("./sources/thepiratebay");
const LimetorrentsSearch = require("./sources/limetorrents");
const TorrentProjectSearch = require("./sources/torrentproject");

class TorrentIndexer {
  constructor(config = {}) {
    if (config.sources) {
      this.sources = { ...sources, ...config.sources };
    } else {
      this.sources = sources;
    }

    this.YTS = new YtsSearch(this.sources.yts);
    this.LEETX = new LeetxSearch(this.sources.leetx);
    this.TORRENTZ2 = new Torrentz2Search(this.sources.torrentz2);
    this.EZTV = new EztvSearch(this.sources.eztv);
    this.RARBG = new RarbgSearch(this.sources.rarbg);
    this.SKY = new SkySearch(this.sources.sky);
    this.ZOOQLE = new ZooqleSearch(this.sources.zooqle);
    this.TPB = new ThePirateBaySearch(this.sources.tpb);
    this.LIMETORRENTS = new LimetorrentsSearch(this.sources.limetorrents);
    this.TORRENTPROJECT = new TorrentProjectSearch(this.sources.torrentproject);
  }

  async search(query, type, page = 1) {
    try {
      let results = await Promise.all([
        this.YTS.search(query, type, page),
        this.LEETX.search(query, type, page),
        this.TORRENTZ2.search(query, type, page),
        this.EZTV.search(query, type, page),
        this.RARBG.search(query, type, page),
        this.SKY.search(query, type, page),
        this.ZOOQLE.search(query, type, page),
        this.TPB.search(query, type, page),
        this.LIMETORRENTS.search(query, type, page),
        this.TORRENTPROJECT.search(query, type, page)
      ]);

      return [].concat.apply([], results).filter(obj => obj);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async torrent(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      return (
        $("a[href^=magnet]")
          .eq(0)
          .attr("href") ||
        $(".torrenthash")
          .find("a")
          .text()
      );
    } catch (err) {
      throw "There was a problem extracting " + url;
    }
  }
}

module.exports = TorrentIndexer;
