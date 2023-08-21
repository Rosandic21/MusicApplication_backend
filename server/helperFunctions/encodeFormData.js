// encodeFormData.js: used to encode form data when fetching user's access token
const encodeFormData = (data) => {
    return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

module.exports = encodeFormData