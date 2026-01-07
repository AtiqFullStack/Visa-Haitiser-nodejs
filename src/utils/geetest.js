import Geetest from 'geetest'
import { GEETEST_ID, GEETEST_KEY } from './cofig';

const geetest = new Geetest({
    geetest_id: GEETEST_ID,
    geetest_key: GEETEST_KEY,
});


export default geetest
