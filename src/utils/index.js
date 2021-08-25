export const getTimeStamp = () => {
  let now = new Date();
  let timestamp =
    now.getFullYear() +
    '' +
    (now.getMonth() + 1 >= 10 ? '' + (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) +
    (now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()) +
    (now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) +
    (now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) +
    (now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());
  return timestamp;
};
