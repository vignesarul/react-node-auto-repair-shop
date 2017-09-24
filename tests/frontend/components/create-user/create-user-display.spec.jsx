jest.mock('react-router-dom');
import React from 'react';
import { mount } from 'enzyme';
import CreateUserDisplay from 'components/create-user/create-user-display';

describe('<CreateUserDisplay />', () => {
  let wrapper;
  const props = {
    history: {
      push: jest.fn(),
    },
    isLoading: false,
    createAccount: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<CreateUserDisplay {...props} />);
  });

  it('should match the snapshop', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it.skip('should render favorites list', () => {
    expect(wrapper.find('.heading').textContent).toEqual(favorites.name);
  });

  it.skip('should open wishlist modal on button click', () => {
    expect((wrapper.find('Modal').props().isOpen)).toEqual(false);
    wrapper.find('.favoritesBtn').simulate('click');
    expect((wrapper.find('Modal').props().isOpen)).toEqual(true);
  });
});
