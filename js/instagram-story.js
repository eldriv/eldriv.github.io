/* Share article to Instagram Story — best-effort web flow (TikTok uses native app APIs). */
(function (global) {
  var STORY_W = 1080;
  var STORY_H = 1920;

  function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  function wrapText(ctx, text, maxWidth, lineHeight, startY) {
    var words = text.split(' ');
    var line = '';
    var y = startY;
    for (var i = 0; i < words.length; i++) {
      var test = line + words[i] + ' ';
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), STORY_W / 2, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line.trim(), STORY_W / 2, y);
    return y + lineHeight;
  }

  function createStoryCard(imageUrl, title, url) {
    return loadImage(imageUrl).then(function (thumb) {
      var canvas = document.createElement('canvas');
      canvas.width = STORY_W;
      canvas.height = STORY_H;
      var ctx = canvas.getContext('2d');

      var bg = ctx.createLinearGradient(0, 0, 0, STORY_H);
      bg.addColorStop(0, '#1a1208');
      bg.addColorStop(0.35, '#050506');
      bg.addColorStop(1, '#050506');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, STORY_W, STORY_H);

      ctx.fillStyle = 'rgba(249, 115, 22, 0.12)';
      ctx.beginPath();
      ctx.arc(STORY_W / 2, 280, 420, 0, Math.PI * 2);
      ctx.fill();

      var thumbSize = 420;
      var thumbX = (STORY_W - thumbSize) / 2;
      var thumbY = 340;
      ctx.fillStyle = '#16161c';
      roundRect(ctx, thumbX - 8, thumbY - 8, thumbSize + 16, thumbSize + 16, 36);
      ctx.fill();
      ctx.save();
      roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 28);
      ctx.clip();
      ctx.drawImage(thumb, thumbX, thumbY, thumbSize, thumbSize);
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fb923c';
      ctx.font = '600 36px "DM Sans", system-ui, sans-serif';
      ctx.fillText('eldriv', STORY_W / 2, 260);

      ctx.fillStyle = '#fafafa';
      ctx.font = '600 52px "Instrument Serif", Georgia, serif';
      wrapText(ctx, title, 900, 62, thumbY + thumbSize + 100);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '500 32px "DM Sans", system-ui, sans-serif';
      var displayUrl = url.replace(/^https?:\/\//, '');
      ctx.fillText(displayUrl, STORY_W / 2, STORY_H - 120);

      ctx.fillStyle = '#71717a';
      ctx.font = '500 28px "DM Sans", system-ui, sans-serif';
      ctx.fillText('Add link sticker in Story', STORY_W / 2, STORY_H - 72);

      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          resolve(blob || new Blob());
        }, 'image/png', 0.92);
      });
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function downloadBlob(blob, filename) {
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 2000);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject();
  }

  function tryClipboardImage(blob) {
    if (!navigator.clipboard || !window.ClipboardItem) {
      return Promise.reject();
    }
    return navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
  }

  function openInstagramStoryComposer() {
    var scheme = 'instagram-stories://share';
    window.location.href = scheme;
  }

  function openInstagramCamera() {
    window.location.href = isIOS() ? 'instagram://story-camera' : 'instagram://camera';
  }

  function shareToInstagramStory(opts) {
    var imageUrl = opts.imageUrl;
    var title = opts.title;
    var url = opts.url;
    var onStatus = opts.onStatus || function () {};

    onStatus('Preparing your Story image…');

    return createStoryCard(imageUrl, title, url).then(function (blob) {
      var file = new File([blob], 'eldriv-story.png', { type: 'image/png' });
      var shareData = { files: [file], title: title, text: url };

      copyText(url).catch(function () {});

      if (navigator.canShare && navigator.canShare(shareData)) {
        onStatus('Choose Instagram → Story');
        return navigator.share(shareData).catch(function () {
          return fallbackShare(blob, url, onStatus);
        });
      }

      return fallbackShare(blob, url, onStatus);
    }).catch(function () {
      onStatus('Could not build image — link copied. Paste it in a Story link sticker.');
      return copyText(url);
    });
  }

  function fallbackShare(blob, url, onStatus) {
    if (isMobile()) {
      return tryClipboardImage(blob).then(function () {
        onStatus('Opening Instagram Story…');
        openInstagramStoryComposer();
      }).catch(function () {
        downloadBlob(blob, 'eldriv-story.png');
        onStatus('Image saved. Opening Instagram — pick the image, add a link sticker.');
        setTimeout(openInstagramCamera, 600);
      });
    }

    downloadBlob(blob, 'eldriv-story.png');
    onStatus('Story image downloaded & link copied. Upload in Instagram → Story.');
    return copyText(url);
  }

  global.eldrivShareToInstagramStory = shareToInstagramStory;
})(typeof window !== 'undefined' ? window : global);
