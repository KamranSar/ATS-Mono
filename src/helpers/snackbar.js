import SET_SNACKBAR from '@/store/modules/app.js';

function setSnackbar(msg, result, timeout) {
  SET_SNACKBAR({
    top: true,
    center: true,
    message: msg,
    color: result,
    timeout: timeout,
  });
}

export { setSnackbar };
