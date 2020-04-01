import axios from 'axios';
import * as moment from 'moment';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';

moment.locale('ko');
dotenv.config();

const { SLACK_WEBHOOK_URL } = process.env;

async function postDailyMeetingForTmr() {
  await post(
    moment()
      .add(1, 'day')
      .format('YYYY년 MM월 DD일 dddd 아침회의 쓰레드'),
  );
}

async function postMondayMeetingForNextWeek() {
  await post(
    moment()
      .add(1, 'week')
      .startOf('week')
      .add(1, 'day')
      .format('YYYY년 MM월 DD일 dddd 오전 10시 30분 주간회의 쓰레드'),
  );
}

async function postFridayMeetingForThisWeek() {
  await post(
    moment()
      .endOf('week')
      .add(-1, 'day')
      .format('YYYY년 MM월 DD일 dddd 오후 5시 주간회의 쓰레드'),
  );
}

postDailyMeetingForTmr();

cron.schedule('0 12 * * 1-4', postDailyMeetingForTmr);
cron.schedule('0 18 * * 5', postMondayMeetingForNextWeek);
cron.schedule('0 13 * * 5', postFridayMeetingForThisWeek);

// Post the generated message to Slack
async function post(text: string) {
  const { status, config } = await axios({
    method: 'post',
    url: SLACK_WEBHOOK_URL,
    data: { text },
  });
  console.info(status, config.data);
}
