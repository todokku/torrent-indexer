const TorrentSource = require("./../src/sources/torrentSource");

class TestSource extends TorrentSource {
  constructor(name) {
    super(name);
  }
  async search(results, type) {
    return super.reconstitute(results, results[0].title, type);
  }
}

module.exports = TestSource;
