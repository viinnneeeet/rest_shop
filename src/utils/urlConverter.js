function urlConvertor(url) {
  return url?.split(`uploads\\`)[1]?.replace(`\\`, '/');
}

module.exports = urlConvertor;
