import { notification } from 'antd';

const notificationWithIcon = (type, message) => {
  notification.config({ placement: 'topRight' });
  notification[type]({ message: message });
};

export { notificationWithIcon };
