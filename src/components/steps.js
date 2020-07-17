import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';
// import { getNodeText } from '@testing-library/react';

const { Step } = Steps;

const steps = [
  {
    title: 'Information',
    content: 'Information-content',
  },
  {
    title: 'Contacts',
    content: 'Contacts-content',
  },
  {
    title: 'Documents',
    content: 'Documents-content',
  },
  {
    title: 'Confirmation',
    content: 'Confirmation-content',
  },
];

const AppSteps = (props) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
    // console.log('Button Next :', current)
  };

  const prev = () => {
    setCurrent(current - 1);
    // console.log('Button prev :', current)
  };

  return (
    <div>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content">{steps[current].content}</div>

      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success('Processing complete!')}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppSteps;
