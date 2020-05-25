export default () => {
  const app = window.document.querySelector('#app-content');
  if (app) {
    app.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: 0,
    });
  }
};
