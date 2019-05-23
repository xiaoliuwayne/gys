function getPicUrl(url, v, t) {
  if (!url || typeof url !== 'string') { return ''; }
  t = t || 0;
  let psize = '';
  if (t == 0) {
    psize = (v == null || v == 0) ? '' : (v == 1) ? '?imageView2/1/w/100/h/100/q!/85' : (v == 2) ? '?imageView2/1/w/290/h/290/q!/85' : '?imageView2/1/w/800/h/800/q!/85';
  }
  return url + psize;
}

// module.exports = getPicUrl;
export {getPicUrl}
