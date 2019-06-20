import {
  delay,
} from 'redux-saga/effects';

export default function* defaultSaga() {
  while (true) {
    console.log('saga running');
    yield delay(10000);
  }
}