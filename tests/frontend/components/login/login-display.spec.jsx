jest.mock('react-router-dom/Link');
import React from 'react';
import { mount } from 'enzyme';
import LoginDisplay from 'components/login/login-display';

describe('<LoginDisplay />', () => {
  let wrapper;
  const props = {
    history: {
      push: jest.fn(),
    },
    isLoading: false,
    performLogin: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<LoginDisplay {...props} />);
  });

  it('should match the snapshop', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
