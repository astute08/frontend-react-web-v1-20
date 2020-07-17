import React, { useState } from 'react';
// import { Modal} from 'antd';
import Select from '../components/v2/select';
import notification from '../components/v2/notification';
import Button from '../components/v2/button';

const { Option } = Select;

export default () => {

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  }

  const openNotificationWithIcon = type => {
    notification[type]({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
  };

  return (
    <div>
      <Select style={{ width: 120 }} >
        <div value="jack">Jack</div>
        <div value="lucy">Lucy</div>
      </Select>

      <Button onClick={() => openNotificationWithIcon('success')}>Success</Button>



    </div>

  );
}