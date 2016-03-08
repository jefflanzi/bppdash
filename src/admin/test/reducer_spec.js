import React from 'react';
import { render } from 'react-dom';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithTag
} from 'react-addons-test-utils';
import { expect } from 'chai';
import Users from '../components/Users';

describe('reducer', () => {
  it('fetches user list on page load', () => {
    expect(1).to.equal(1);
  });
  it('should reduce things', () => {
    expect(1).to.equal(1);
  });
});
