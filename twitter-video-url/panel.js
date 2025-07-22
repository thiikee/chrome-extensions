chrome.devtools.network.onRequestFinished.addListener((req) => {
  if (req.request.url.indexOf('TweetDetail') !== -1) {
    var newline = true;
    req.getContent((body) => {
      var json = JSON.parse(body);
      json.data.threaded_conversation_with_injections_v2.instructions[1].entries.forEach((entry) => {
        if (entry.content.itemContent) {
          if (entry.content.itemContent.tweet_results) {
            var result = entry.content.itemContent.tweet_results.result;
            var legacy = result.tweet ? result.tweet.legacy : result.legacy;
            if (legacy) {
              if (legacy.extended_entities) {
                legacy.extended_entities.media.forEach((media) => {
                  if (media.video_info) {
                    var maxBitrate = 0;
                    var url;
                    media.video_info.variants.forEach((video, index, array) => {
                      var bitrate = parseInt(video.bitrate);
                      if (bitrate > maxBitrate) {
                        maxBitrate = bitrate;
                        url = video.url.replace(/\?.*$/, '');
                      }
                      if (index == array.length - 1) {
                        if (newline) {
                          document.getElementById('log').innerHTML += `<br>`;
                          newline = false;
                        }
                        document.getElementById('log').innerHTML += `<a href="${url}" target="_blank">${url}</a><br>`;
                      }
                    });
                  }
                });
              }
            }
          }
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('clear').addEventListener('click', () => {
    document.getElementById('log').innerHTML = '';
  });
});
